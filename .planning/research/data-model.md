# LibertyGest — Database Schema & Data Modeling Research

**Researched:** 2026-04-13
**Based on:** CybHotel deep analysis + PostgreSQL best practices research
**Overall confidence:** HIGH for structural patterns, MEDIUM for performance optimizations at scale

---

## Table of Contents

1. [Multi-Tenancy Decision](#1-multi-tenancy-decision)
2. [Core Property & Room Model](#2-core-property--room-model)
3. [Rate Plan Hierarchy](#3-rate-plan-hierarchy)
4. [Pricing Storage Strategy](#4-pricing-storage-strategy)
5. [Dynamic Pricing Algorithm Model](#5-dynamic-pricing-algorithm-model)
6. [Extras & Supplements](#6-extras--supplements)
7. [Promotions & Vouchers](#7-promotions--vouchers)
8. [Restrictions Model](#8-restrictions-model)
9. [Reservations & Orders](#9-reservations--orders)
10. [Housekeeping](#10-housekeeping)
11. [Guest CRM & Deduplication](#11-guest-crm--deduplication)
12. [RBAC Model](#12-rbac-model)
13. [Multilingual Content](#13-multilingual-content)
14. [Audit Log Pattern](#14-audit-log-pattern)
15. [Communication History](#15-communication-history)
16. [Channel Manager Integration](#16-channel-manager-integration)
17. [Regulatory Reporting Tables](#17-regulatory-reporting-tables)
18. [Soft Delete Strategy](#18-soft-delete-strategy)
19. [Complete Schema (annotated DDL)](#19-complete-schema-annotated-ddl)
20. [Indexes & Performance](#20-indexes--performance)
21. [Key Design Decisions Summary](#21-key-design-decisions-summary)

---

## 1. Multi-Tenancy Decision

### Recommendation: Shared Schema with Row-Level Security (RLS)

**Pattern chosen:** Single database, single schema, `property_id` foreign key on every tenant-scoped table, enforced via PostgreSQL RLS policies.

**Why not schema-per-tenant:**
- Schema proliferation degrades PostgreSQL performance beyond ~100 schemas
- Migrations must be applied N times (one per hotel) — operational complexity
- CybHotel's own architecture uses `hotel_ext_id` on shared URLs, confirming shared-table approach is standard in this domain
- LibertyGest will start with tens of properties, not thousands — RLS overhead is negligible at this scale

**Why RLS over application-only enforcement:**
- RLS is the final backstop: a buggy query path cannot leak cross-tenant data
- JWT claims (`app.current_property_id`, `app.current_user_id`) are set at connection time via `SET LOCAL`
- Works correctly with Supabase, Prisma, Drizzle, and raw pg connections
- Single migration path for schema changes

**Implementation pattern:**
```sql
-- Set before each query in the connection pool
SET LOCAL app.current_property_id = '...';
SET LOCAL app.current_user_id = '...';

-- Policy on every tenant-scoped table
CREATE POLICY tenant_isolation ON rooms
  USING (property_id = current_setting('app.current_property_id')::uuid);
```

**Tables exempt from RLS (global):** `properties`, `users`, `roles`, `permissions`, `languages`

---

## 2. Core Property & Room Model

### Properties (hotels)

Each `property` is one physical hotel. One owner account can have many properties. This is the multi-property boundary.

```sql
CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   UUID NOT NULL REFERENCES users(id),
  slug            TEXT UNIQUE NOT NULL,           -- URL-safe identifier
  name            TEXT NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'EUR', -- ISO 4217
  timezone        TEXT NOT NULL DEFAULT 'Europe/Rome',
  country_code    CHAR(2) NOT NULL,               -- ISO 3166-1 alpha-2
  vat_number      TEXT,
  iban            TEXT,
  address         JSONB NOT NULL DEFAULT '{}',    -- street, city, zip, country
  contact         JSONB NOT NULL DEFAULT '{}',    -- phone, email, website
  wifi            JSONB NOT NULL DEFAULT '{}',    -- ssid, password
  brand_color     CHAR(7),                        -- hex
  settings        JSONB NOT NULL DEFAULT '{}',    -- misc config
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Regulatory identifiers (separate table to avoid wide row)
CREATE TABLE property_regulatory (
  property_id     UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
  hesta_email     TEXT,
  hesta_phone     TEXT,
  hesta_contact   TEXT,
  hesta_ust_id    TEXT,
  hesta_auto_send BOOLEAN NOT NULL DEFAULT false,
  polca_code      TEXT,
  istat_code      TEXT,
  besr_id         TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Room Types

```sql
CREATE TABLE room_types (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id         UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  code                TEXT NOT NULL,                    -- internal code, e.g. 'DBLSUP'
  -- multilingual name stored as JSONB: {"it": "Doppia Superiore", "en": "Superior Double", ...}
  name                JSONB NOT NULL DEFAULT '{}',
  description         JSONB NOT NULL DEFAULT '{}',      -- multilingual long description
  amenities           TEXT[] NOT NULL DEFAULT '{}',     -- array of amenity keys
  bed_config          JSONB NOT NULL DEFAULT '{}',      -- {"beds": [{"type": "double", "count": 1}]}
  nominal_capacity    SMALLINT NOT NULL DEFAULT 2,
  max_capacity        SMALLINT NOT NULL DEFAULT 2,
  sort_order          SMALLINT NOT NULL DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, code)
);

-- Photos for room types (separate to support ordering and metadata)
CREATE TABLE room_type_photos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id    UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  storage_url     TEXT NOT NULL,
  alt_text        JSONB NOT NULL DEFAULT '{}',   -- multilingual
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  is_cover        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Physical Rooms

```sql
CREATE TABLE rooms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_type_id    UUID NOT NULL REFERENCES room_types(id),
  room_number     TEXT NOT NULL,
  floor           SMALLINT NOT NULL,
  notes           TEXT,                           -- maintenance notes, internal only
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, room_number)
);
```

---

## 3. Rate Plan Hierarchy

### Design: Adjacency List with Depth-1 Constraint

CybHotel uses a single level of derivation (Primary → Derived). LibertyGest should support depth-1 max (one parent level) to keep price resolution simple and avoid recursive CTE overhead at query time.

**Derivation resolution rule:**
- `Derived price = ROUND(parent_price * (1 + pct_delta/100) + fixed_delta, 2)`
- If both `pct_delta` and `fixed_delta` are non-zero, percentage is applied first, then fixed is added.
- Derived plans cannot have their own calendar overrides — they inherit the parent's and apply the delta.

```sql
CREATE TABLE rate_plans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id         UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name                JSONB NOT NULL DEFAULT '{}',     -- multilingual
  is_primary          BOOLEAN NOT NULL DEFAULT true,
  parent_plan_id      UUID REFERENCES rate_plans(id),  -- NULL for primary plans
  delta_type          TEXT CHECK (delta_type IN ('pct', 'fixed', 'both')),
  pct_delta           NUMERIC(6,2),                    -- e.g. -10.00 = -10%
  fixed_delta         NUMERIC(10,2),                   -- e.g. 15.00 CHF absolute add
  restriction_plan_id UUID REFERENCES restriction_plans(id),
  -- Cancellation policy stored as ordered array of thresholds
  -- [{"days_before": 4, "refund_pct": 100}, {"days_before": 0, "refund_pct": 0}]
  cancellation_policy JSONB NOT NULL DEFAULT '[]',
  included_extra_ids  UUID[] NOT NULL DEFAULT '{}',    -- extras included in this plan
  applicable_room_type_ids UUID[] NOT NULL DEFAULT '{}', -- empty = all room types
  is_active           BOOLEAN NOT NULL DEFAULT true,
  sort_order          SMALLINT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Enforce: derived plans must have a parent; primary plans must not
  CONSTRAINT derivation_consistency CHECK (
    (is_primary = true AND parent_plan_id IS NULL) OR
    (is_primary = false AND parent_plan_id IS NOT NULL)
  ),
  -- Prevent self-reference
  CONSTRAINT no_self_reference CHECK (id != parent_plan_id)
);
```

**Why JSONB for cancellation_policy:** The policy is a small ordered array (2-5 entries max), queried by the application to render the policy and calculate refunds. It is never queried as a SQL filter condition. JSONB avoids a separate `cancellation_policy_tiers` table and its join overhead.

---

## 4. Pricing Storage Strategy

### Decision: Sparse Override Table + Computed View

**The problem:** A "dense" calendar (one row per room_type × date) for 10 room types over 2 years = 7,300 rows. Manageable but requires pre-population and bulk updates. A "sparse" table stores only overrides, requiring a fallback to defaults.

**Recommendation: Sparse overrides with a default row per room_type per rate_plan.**

This mirrors exactly what CybHotel implements: `Valori di default` (one default min/max/discount per room type) + `Valori a calendario` (sparse overrides). It is efficient, easy to edit in bulk, and trivially portable.

```sql
-- Default pricing per room type per rate plan (fallback when no calendar override exists)
CREATE TABLE rate_plan_defaults (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  rate_plan_id    UUID NOT NULL REFERENCES rate_plans(id) ON DELETE CASCADE,
  room_type_id    UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  min_price       NUMERIC(10,2) NOT NULL,
  max_price       NUMERIC(10,2) NOT NULL,
  per_person_discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rate_plan_id, room_type_id)
);

-- Sparse calendar overrides (only dates that differ from defaults)
CREATE TABLE price_calendar (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  rate_plan_id    UUID NOT NULL REFERENCES rate_plans(id) ON DELETE CASCADE,
  room_type_id    UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  stay_date       DATE NOT NULL,
  min_price       NUMERIC(10,2),    -- NULL = inherit from default
  max_price       NUMERIC(10,2),    -- NULL = inherit from default
  per_person_discount NUMERIC(10,2), -- NULL = inherit from default
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      UUID REFERENCES users(id),
  UNIQUE (rate_plan_id, room_type_id, stay_date)
);
```

**Effective price resolution (application layer):**
```
effective_min = COALESCE(calendar.min_price, default.min_price)
effective_max = COALESCE(calendar.max_price, default.max_price)
```

**For derived plans**, the application resolves prices from the parent plan's calendar/default, then applies the delta. Derived plans never write to `price_calendar` directly.

**Materialized view for reporting (refresh nightly or on-demand):**
```sql
CREATE MATERIALIZED VIEW mv_effective_prices AS
SELECT
  rpd.property_id,
  rpd.rate_plan_id,
  rpd.room_type_id,
  d.stay_date,
  COALESCE(pc.min_price, rpd.min_price) AS effective_min,
  COALESCE(pc.max_price, rpd.max_price) AS effective_max,
  COALESCE(pc.per_person_discount, rpd.per_person_discount) AS effective_discount
FROM rate_plan_defaults rpd
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '2 years', '1 day') d(stay_date)
LEFT JOIN price_calendar pc
  ON pc.rate_plan_id = rpd.rate_plan_id
  AND pc.room_type_id = rpd.room_type_id
  AND pc.stay_date = d.stay_date;

CREATE UNIQUE INDEX ON mv_effective_prices (property_id, rate_plan_id, room_type_id, stay_date);
```

Use this view for the pricing calendar grid display and for bulk OTA price pushes.

---

## 5. Dynamic Pricing Algorithm Model

The algorithm computes a score from three factor tables, then interpolates the result between `min_price` and `max_price`.

```sql
CREATE TABLE pricing_algo_config (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_type_id    UUID REFERENCES room_types(id), -- NULL = applies to all room types
  is_active       BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (property_id, room_type_id)
);

-- Scored bands for each factor type
-- factor_type: 'occupancy' | 'lead_time' | 'day_type'
-- For occupancy/lead_time: range_from/range_to are the band boundaries
-- For day_type: range_from = 0 (weekday), range_from = 1 (weekend)
CREATE TABLE pricing_algo_bands (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id       UUID NOT NULL REFERENCES pricing_algo_config(id) ON DELETE CASCADE,
  factor_type     TEXT NOT NULL CHECK (factor_type IN ('occupancy', 'lead_time', 'day_type')),
  range_from      NUMERIC(8,2) NOT NULL,
  range_to        NUMERIC(8,2),                  -- NULL = open upper bound
  score           SMALLINT NOT NULL,
  sort_order      SMALLINT NOT NULL DEFAULT 0
);
```

**Algorithm resolution logic (application layer, pseudocode):**
```
total_score = occupancy_score + lead_time_score + day_type_score
max_possible_score = sum of max scores across all bands
normalized = total_score / max_possible_score   -- 0.0 to 1.0
suggested_price = min_price + (max_price - min_price) * normalized
```

The application layer (not the database) executes this per-request when computing available rates.

---

## 6. Extras & Supplements

Self-service extras (contrast with CybHotel's support-only creation). Each extra has date-range pricing and a VAT category.

```sql
CREATE TABLE extras (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  code            TEXT NOT NULL,
  name            JSONB NOT NULL DEFAULT '{}',       -- multilingual
  description     JSONB NOT NULL DEFAULT '{}',       -- multilingual
  category        TEXT NOT NULL CHECK (category IN ('breakfast', 'pool', 'service', 'tax', 'fee', 'other')),
  unit_type       TEXT NOT NULL CHECK (unit_type IN ('per_stay', 'per_night', 'per_person_night', 'per_person_stay')),
  vat_rate        NUMERIC(5,2) NOT NULL DEFAULT 0,   -- e.g. 7.70 for 7.7%
  is_bookable     BOOLEAN NOT NULL DEFAULT true,     -- guest can add at booking time
  is_ota_visible  BOOLEAN NOT NULL DEFAULT false,
  icon            TEXT,                              -- icon key from icon library
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, code)
);

-- Date-range pricing for extras (sparse: only date ranges with non-default pricing)
CREATE TABLE extra_prices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extra_id        UUID NOT NULL REFERENCES extras(id) ON DELETE CASCADE,
  valid_from      DATE NOT NULL,
  valid_to        DATE NOT NULL,
  price           NUMERIC(10,2) NOT NULL,
  CHECK (valid_from <= valid_to),
  -- No overlapping date ranges for the same extra
  EXCLUDE USING gist (extra_id WITH =, daterange(valid_from, valid_to, '[]') WITH &&)
);

-- Default price when no date-range applies
ALTER TABLE extras ADD COLUMN default_price NUMERIC(10,2) NOT NULL DEFAULT 0;
```

**Note on the EXCLUDE constraint:** PostgreSQL's `btree_gist` extension enables exclusion constraints on dateranges. Requires `CREATE EXTENSION IF NOT EXISTS btree_gist;`. This enforces at the database level that no two price ranges overlap for the same extra, preventing pricing ambiguity.

**Unavailability for extras (e.g. pool closed for maintenance):**
```sql
CREATE TABLE extra_unavailability (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extra_id        UUID NOT NULL REFERENCES extras(id) ON DELETE CASCADE,
  unavail_from    DATE NOT NULL,
  unavail_to      DATE NOT NULL,
  reason          TEXT,
  CHECK (unavail_from <= unavail_to)
);
```

---

## 7. Promotions & Vouchers

### Promotions

```sql
CREATE TABLE promotions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id           UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  discount_pct          NUMERIC(5,2) NOT NULL CHECK (discount_pct > 0 AND discount_pct <= 100),
  is_stackable          BOOLEAN NOT NULL DEFAULT false,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  -- Booking window: when the booking must be made
  booking_from          DATE,
  booking_to            DATE,
  -- Stay window: when the stay must occur
  stay_from             DATE,
  stay_to               DATE,
  -- Dates within the stay window that are excluded
  excluded_stay_dates   DATE[] NOT NULL DEFAULT '{}',
  -- Last-minute config
  is_last_minute        BOOLEAN NOT NULL DEFAULT false,
  last_minute_days      SMALLINT,    -- mutually exclusive with last_minute_hours
  last_minute_hours     SMALLINT,
  -- Stay length requirements
  min_nights            SMALLINT,
  max_nights            SMALLINT,
  -- Channel visibility
  visible_kiosk         BOOLEAN NOT NULL DEFAULT true,
  -- 'all' | 'registered' | 'business' | 'none'
  visible_webapp        TEXT NOT NULL DEFAULT 'all' CHECK (visible_webapp IN ('all', 'registered', 'business', 'none')),
  -- Scoping: empty array = applies to all
  applicable_room_type_ids UUID[] NOT NULL DEFAULT '{}',
  applicable_rate_plan_ids UUID[] NOT NULL DEFAULT '{}',
  -- Specific user targeting (user IDs)
  specific_user_ids     UUID[] NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Note on excluded_stay_dates:** Stored as `DATE[]` (PostgreSQL array) rather than a separate junction table. The set is small (typically 0–20 dates per promotion), is always read and written as a whole, and never queried individually via SQL. Array storage is appropriate here. If the set grew to hundreds of dates, a junction table would be warranted.

### Vouchers

```sql
CREATE TABLE vouchers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  code            TEXT NOT NULL,
  voucher_type    TEXT NOT NULL CHECK (voucher_type IN ('pct', 'fixed', 'total_price', 'per_night_price')),
  value           NUMERIC(10,2) NOT NULL,
  valid_from      DATE NOT NULL,
  valid_to        DATE NOT NULL,
  -- Scoping: empty array = all room types / extras
  applicable_room_type_ids UUID[] NOT NULL DEFAULT '{}',
  included_extra_ids UUID[] NOT NULL DEFAULT '{}',
  used_at         TIMESTAMPTZ,            -- NULL = not yet used
  used_by_reservation_id UUID,           -- set when redeemed
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, code),
  CHECK (valid_from <= valid_to)
);
```

---

## 8. Restrictions Model

Named restriction plans (e.g., "Summer Plan", "Standard Plan") with sparse calendar rules. A rate plan references one restriction plan.

```sql
CREATE TABLE restriction_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- restriction_type: 'min_stay' | 'max_stay' | 'booking_lead_min' | 'booking_lead_max'
--                   | 'checkin_days' | 'checkout_days'
-- For stay restrictions: value = integer (nights)
-- For allowed_days restrictions: value = comma-separated day numbers (0=Mon...6=Sun)
CREATE TABLE restriction_rules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restriction_plan_id UUID NOT NULL REFERENCES restriction_plans(id) ON DELETE CASCADE,
  room_type_id        UUID REFERENCES room_types(id), -- NULL = applies to all room types
  restriction_type    TEXT NOT NULL,
  value               TEXT NOT NULL,                  -- flexible: "3" or "0,5,6"
  valid_from          DATE NOT NULL,
  valid_to            DATE NOT NULL,
  CHECK (valid_from <= valid_to),
  EXCLUDE USING gist (
    restriction_plan_id WITH =,
    room_type_id WITH =,
    restriction_type WITH =,
    daterange(valid_from, valid_to, '[]') WITH &&
  )
);
```

---

## 9. Reservations & Orders

### Core Reservation

A reservation may span multiple physical rooms (e.g., a family booking two rooms). Each room block within a reservation has its own rate, dates, and guest count.

```sql
CREATE TABLE reservations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id           UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_number    TEXT NOT NULL,           -- human-readable, e.g. "RES-2026-0042"
  guest_id              UUID REFERENCES guests(id),
  channel               TEXT NOT NULL,           -- 'direct', 'booking_com', 'expedia', 'admin', etc.
  channel_reservation_id TEXT,                  -- OTA's own reference number
  status                TEXT NOT NULL DEFAULT 'confirmed'
                        CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  checkin_enabled       BOOLEAN NOT NULL DEFAULT false,
  -- Contact data snapshot at booking time (denormalized for historical accuracy)
  guest_snapshot        JSONB NOT NULL DEFAULT '{}',  -- {first_name, last_name, email, phone, country, ...}
  -- Voucher applied at booking level
  voucher_id            UUID REFERENCES vouchers(id),
  -- Applied promotions (array of promotion IDs)
  applied_promotion_ids UUID[] NOT NULL DEFAULT '{}',
  special_requests      TEXT,
  internal_notes        TEXT,
  booked_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at          TIMESTAMPTZ,
  cancellation_reason   TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, reservation_number)
);

-- One row per room within a multi-room reservation
CREATE TABLE reservation_rooms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  room_id         UUID NOT NULL REFERENCES rooms(id),
  room_type_id    UUID NOT NULL REFERENCES room_types(id),
  rate_plan_id    UUID NOT NULL REFERENCES rate_plans(id),
  checkin_date    DATE NOT NULL,
  checkout_date   DATE NOT NULL,
  num_adults      SMALLINT NOT NULL DEFAULT 1,
  num_kids        SMALLINT NOT NULL DEFAULT 0,
  -- Per-night price array for audit trail
  -- [{"date": "2026-04-10", "price": 120.00}, ...]
  nightly_prices  JSONB NOT NULL DEFAULT '[]',
  base_amount     NUMERIC(10,2) NOT NULL,        -- sum of nightly prices
  extra_amount    NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount    NUMERIC(10,2) NOT NULL,
  CHECK (checkin_date < checkout_date)
);

-- Extras attached to a reservation room
CREATE TABLE reservation_room_extras (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_room_id   UUID NOT NULL REFERENCES reservation_rooms(id) ON DELETE CASCADE,
  extra_id              UUID NOT NULL REFERENCES extras(id),
  quantity              SMALLINT NOT NULL DEFAULT 1,
  unit_price            NUMERIC(10,2) NOT NULL,
  total_price           NUMERIC(10,2) NOT NULL,
  -- 'per_stay' extras: one row; 'per_night' extras: one row per night OR aggregate
  valid_from            DATE,
  valid_to              DATE
);
```

### Orders & Invoicing

An order is a financial document (invoice or receipt) associated with a reservation.

```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_id  UUID NOT NULL REFERENCES reservations(id),
  order_number    TEXT NOT NULL,             -- human-readable invoice number
  order_type      TEXT NOT NULL CHECK (order_type IN ('invoice', 'receipt', 'credit_note', 'proforma')),
  status          TEXT NOT NULL DEFAULT 'unpaid'
                  CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'overdue', 'voided', 'refunded')),
  -- Fiscal document info
  invoice_ref     TEXT,
  issue_date      DATE,
  due_date        DATE,
  -- Amounts (gross, VAT breakdown stored in order_lines)
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  vat_total       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- OTA-collected flag (OTA pays hotel net; hotel does not collect from guest)
  ota_collected   BOOLEAN NOT NULL DEFAULT false,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, order_number)
);

CREATE TABLE order_lines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  description     TEXT NOT NULL,
  quantity        NUMERIC(8,2) NOT NULL DEFAULT 1,
  unit_price      NUMERIC(10,2) NOT NULL,
  vat_rate        NUMERIC(5,2) NOT NULL DEFAULT 0,
  line_total      NUMERIC(10,2) NOT NULL,
  category        TEXT NOT NULL           -- 'room', 'breakfast', 'extra', 'tax', 'discount', 'refund'
);

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id),
  amount          NUMERIC(10,2) NOT NULL,
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'ota_collected', 'voucher', 'other')),
  paid_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  reference       TEXT,                              -- transaction ID, receipt number
  recorded_by     UUID REFERENCES users(id),
  notes           TEXT
);

CREATE TABLE refunds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id),
  amount          NUMERIC(10,2) NOT NULL,
  refund_method   TEXT NOT NULL,
  refunded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason          TEXT,
  recorded_by     UUID REFERENCES users(id)
);
```

---

## 10. Housekeeping

```sql
-- Room unavailability (maintenance blocks, not reservations)
CREATE TABLE room_unavailability (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_id         UUID NOT NULL REFERENCES rooms(id),
  unavail_from    DATE NOT NULL,
  unavail_to      DATE NOT NULL,
  reason          TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (unavail_from <= unavail_to)
);

-- Current cleaning status per room (one row per room, upserted)
CREATE TABLE room_status (
  room_id         UUID PRIMARY KEY REFERENCES rooms(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL,
  status          TEXT NOT NULL DEFAULT 'clean'
                  CHECK (status IN ('dirty', 'deep_clean', 'in_progress', 'inspecting', 'clean', 'do_not_disturb')),
  assigned_to     UUID REFERENCES users(id),
  last_updated_by UUID REFERENCES users(id),
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes           TEXT
);

-- Full history of every status transition (immutable, append-only)
CREATE TABLE housekeeping_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  room_id         UUID NOT NULL REFERENCES rooms(id),
  status_from     TEXT NOT NULL,
  status_to       TEXT NOT NULL,
  changed_by      UUID NOT NULL REFERENCES users(id),
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes           TEXT,
  photo_urls      TEXT[] NOT NULL DEFAULT '{}'      -- storage URLs for photos
);
```

**Trigger to maintain `room_status` from events:**
```sql
CREATE OR REPLACE FUNCTION sync_room_status() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO room_status (room_id, property_id, status, last_updated_by, last_updated_at, notes)
  VALUES (NEW.room_id, NEW.property_id, NEW.status_to, NEW.changed_by, NEW.changed_at, NEW.notes)
  ON CONFLICT (room_id) DO UPDATE
    SET status = EXCLUDED.status,
        last_updated_by = EXCLUDED.last_updated_by,
        last_updated_at = EXCLUDED.last_updated_at,
        notes = EXCLUDED.notes;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_housekeeping_event
  AFTER INSERT ON housekeeping_events
  FOR EACH ROW EXECUTE FUNCTION sync_room_status();
```

---

## 11. Guest CRM & Deduplication

### Guest Profiles

```sql
CREATE TABLE guests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Canonical contact info
  email               TEXT,
  email_verified      BOOLEAN NOT NULL DEFAULT false,
  phone               TEXT,
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  -- Identity & regulatory
  nationality         CHAR(2),             -- ISO 3166-1 alpha-2
  document_type       TEXT CHECK (document_type IN ('passport', 'id_card', 'drivers_license', 'other')),
  document_number     TEXT,
  document_expiry     DATE,
  date_of_birth       DATE,
  gender              TEXT CHECK (gender IN ('M', 'F', 'other', 'unspecified')),
  -- Address
  address             JSONB NOT NULL DEFAULT '{}',
  -- CRM
  language_preference CHAR(2) DEFAULT 'it',
  is_vip              BOOLEAN NOT NULL DEFAULT false,
  is_blacklisted      BOOLEAN NOT NULL DEFAULT false,
  tags                TEXT[] NOT NULL DEFAULT '{}',    -- e.g. ['corporate', 'loyalty_gold']
  preferences         JSONB NOT NULL DEFAULT '{}',     -- free-form: dietary, room preferences, etc.
  notes               TEXT,
  -- Loyalty
  loyalty_points      INTEGER NOT NULL DEFAULT 0,
  loyalty_tier        TEXT DEFAULT 'standard',
  -- Deduplication
  master_guest_id     UUID REFERENCES guests(id),      -- if this is a duplicate, points to canonical
  dedupe_score        JSONB NOT NULL DEFAULT '{}',     -- fuzzy match scores for monitoring
  -- Source tracking
  source              TEXT DEFAULT 'direct',           -- 'direct' | 'booking_com' | 'expedia' | ...
  external_ids        JSONB NOT NULL DEFAULT '{}',     -- {"booking_com_id": "...", "expedia_id": "..."}
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Communication preferences (GDPR)
CREATE TABLE guest_consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id        UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  consent_type    TEXT NOT NULL CHECK (consent_type IN ('marketing_email', 'marketing_sms', 'analytics', 'data_retention')),
  granted         BOOLEAN NOT NULL,
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address      TEXT,
  source          TEXT
);
```

### Deduplication Strategy

**Matching signals (ranked by reliability):**
1. Exact email match → HIGH confidence duplicate
2. Phone number match (normalized, stripped of formatting) → HIGH confidence
3. First name + last name + date_of_birth → HIGH confidence
4. First name fuzzy (Jaro-Winkler > 0.85) + last name fuzzy + nationality → MEDIUM confidence
5. Document number match → DEFINITIVE (same person)

**Implementation approach:**
- On guest creation, the application runs similarity queries against existing records
- Results above threshold are flagged in a `guest_merge_candidates` table for manual review
- Staff can merge candidates via the CRM UI, which sets `master_guest_id` on the duplicate and migrates reservation links
- Automated merge only on `document_number` match (definitive identity)

```sql
CREATE TABLE guest_merge_candidates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL,
  guest_id_a      UUID NOT NULL REFERENCES guests(id),
  guest_id_b      UUID NOT NULL REFERENCES guests(id),
  match_score     NUMERIC(5,2) NOT NULL,
  match_signals   JSONB NOT NULL DEFAULT '{}',   -- which fields matched
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'merged', 'dismissed')),
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**PostgreSQL extension for fuzzy matching:** `pg_trgm` (trigram similarity). Available by default in PostgreSQL. Use `similarity(a, b) > 0.6` for name matching.

---

## 12. RBAC Model

### Hybrid approach: Built-in roles + custom permission overrides

```sql
-- System-defined roles (seeded, not user-created)
CREATE TABLE roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL UNIQUE,          -- 'owner', 'revenue_manager', 'front_desk', 'housekeeper', 'accountant'
  is_system       BOOLEAN NOT NULL DEFAULT false, -- system roles cannot be deleted
  description     TEXT
);

-- Fine-grained permissions (seeded list of all possible actions)
CREATE TABLE permissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource        TEXT NOT NULL,                 -- 'reservations', 'pricing', 'housekeeping', etc.
  action          TEXT NOT NULL,                 -- 'read', 'create', 'update', 'delete', 'export'
  description     TEXT,
  UNIQUE (resource, action)
);

-- Which permissions each role has by default
CREATE TABLE role_permissions (
  role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id   UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User membership in a property (a user can be staff at multiple properties)
CREATE TABLE property_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id         UUID NOT NULL REFERENCES roles(id),
  -- Permission overrides (add or remove specific permissions for this user)
  granted_permissions   UUID[] NOT NULL DEFAULT '{}',  -- extra permissions beyond role
  revoked_permissions   UUID[] NOT NULL DEFAULT '{}',  -- permissions removed from role
  is_active       BOOLEAN NOT NULL DEFAULT true,
  invited_at      TIMESTAMPTZ,
  joined_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, user_id)
);

-- User accounts (cross-property identity)
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  email_verified  BOOLEAN NOT NULL DEFAULT false,
  password_hash   TEXT,                          -- NULL if OAuth-only
  auth_provider   TEXT,                          -- 'email' | 'google' | 'apple'
  auth_provider_id TEXT,
  full_name       TEXT NOT NULL,
  avatar_url      TEXT,
  language        CHAR(2) NOT NULL DEFAULT 'it',
  is_suspended    BOOLEAN NOT NULL DEFAULT false,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Permission check function (for RLS policies):**
```sql
CREATE OR REPLACE FUNCTION user_has_permission(resource TEXT, action TEXT) RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID := current_setting('app.current_user_id')::uuid;
  v_property_id UUID := current_setting('app.current_property_id')::uuid;
  v_permission_id UUID;
BEGIN
  SELECT p.id INTO v_permission_id
  FROM permissions p WHERE p.resource = resource AND p.action = action;

  RETURN EXISTS (
    SELECT 1 FROM property_users pu
    JOIN role_permissions rp ON rp.role_id = pu.role_id
    WHERE pu.user_id = v_user_id
      AND pu.property_id = v_property_id
      AND pu.is_active = true
      AND rp.permission_id = v_permission_id
      AND v_permission_id != ALL(pu.revoked_permissions)
    UNION ALL
    SELECT 1 FROM property_users pu
    WHERE pu.user_id = v_user_id
      AND pu.property_id = v_property_id
      AND pu.is_active = true
      AND v_permission_id = ANY(pu.granted_permissions)
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

---

## 13. Multilingual Content

### Decision: JSONB columns on the entity table (not a separate translations table)

**Why JSONB over a translations junction table:**
- Room type names, descriptions, email templates, and showcase sections are always read/written together with their parent entity
- No per-language SQL filter queries needed (content is rendered in the application layer)
- Eliminates 4 additional JOINs per content fetch (one per language table)
- Schema change for adding a new language (e.g., `ru`) requires no DDL — just populate a new JSONB key
- Well-suited for small, bounded content (hotel content is not Wikipedia)

**Structure:**
```jsonb
{
  "it": "Doppia Superiore",
  "en": "Superior Double Room",
  "de": "Superior Doppelzimmer",
  "fr": "Chambre Double Supérieure"
}
```

**When to consider a translations table instead:** If content exceeds ~10KB per row, requires full-text search per language, or needs complex versioning/approval workflows. None of these apply to hotel room descriptions.

```sql
-- Showcase content (hotel's public-facing page sections)
CREATE TABLE showcase_sections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  section_key     TEXT NOT NULL,                   -- 'welcome_primary', 'hotel_description', etc.
  content         JSONB NOT NULL DEFAULT '{}',     -- multilingual content
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, section_key)
);

-- Email templates
CREATE TABLE email_templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  template_key    TEXT NOT NULL,                   -- 'booking_confirmation', 'pre_arrival', 'post_stay'
  subject         JSONB NOT NULL DEFAULT '{}',     -- multilingual
  body_html       JSONB NOT NULL DEFAULT '{}',     -- multilingual
  is_active       BOOLEAN NOT NULL DEFAULT true,
  -- Scheduled triggers: null = manual only
  -- [{"trigger": "checkin", "offset_days": -3, "offset_direction": "before"}]
  schedule_config JSONB,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, template_key)
);
```

---

## 14. Audit Log Pattern

### Decision: Trigger-based changelog table (not event sourcing)

**Why not full event sourcing:**
- Event sourcing requires rebuilding current state from events for every read — adds latency and application complexity
- LibertyGest's audit requirements are "who changed what and when" (accountability), not "rebuild any past state" (event replay)
- A simple changelog with JSONB old/new values satisfies the stated requirement: debugging pricing changes, accountability

**Why triggers over application-layer logging:**
- Triggers fire regardless of whether the change came from the application, an admin SQL query, a migration script, or an automated job
- 100% coverage guaranteed — application code cannot forget to log
- No additional round-trips or application coupling

```sql
CREATE TABLE audit_log (
  id              BIGSERIAL PRIMARY KEY,          -- BIGSERIAL (not UUID) for sequential ordering efficiency
  property_id     UUID,                           -- NULL for global changes (user management, etc.)
  table_name      TEXT NOT NULL,
  record_id       UUID NOT NULL,
  operation       TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  changed_by      UUID,                           -- NULL for system/migration changes
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  old_values      JSONB,                          -- NULL for INSERT
  new_values      JSONB,                          -- NULL for DELETE
  -- Application context (set via SET LOCAL before the operation)
  request_id      TEXT,                           -- trace ID for grouping related changes
  user_agent      TEXT,
  ip_address      INET
);

-- Partition by month for manageable size (audit log grows unboundedly)
-- Use PostgreSQL declarative partitioning
CREATE TABLE audit_log_2026_04 PARTITION OF audit_log
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
```

**Trigger template (applied to pricing-sensitive tables):**
```sql
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    property_id, table_name, record_id, operation,
    changed_by, old_values, new_values,
    request_id, ip_address
  )
  VALUES (
    COALESCE(NEW.property_id, OLD.property_id),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    current_setting('app.current_user_id', true)::uuid,
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::jsonb END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb END,
    current_setting('app.request_id', true),
    current_setting('app.ip_address', true)::inet
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Tables that must have audit triggers:**
- `rate_plans`, `rate_plan_defaults`, `price_calendar`
- `promotions`, `vouchers`
- `extras`, `extra_prices`
- `restriction_plans`, `restriction_rules`
- `reservations`, `orders`
- `properties`, `property_regulatory`
- `property_users` (role changes)

---

## 15. Communication History

```sql
CREATE TABLE communication_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_id  UUID REFERENCES reservations(id),
  guest_id        UUID REFERENCES guests(id),
  channel         TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'in_app', 'manual')),
  direction       TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  subject         TEXT,
  body_preview    TEXT,                          -- first 500 chars, for list display
  template_key    TEXT,                          -- which template was used, if automated
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at    TIMESTAMPTZ,
  opened_at       TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'sent'
                  CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'bounced', 'failed')),
  provider_message_id TEXT,                      -- e.g. Resend/SendGrid message ID
  sent_by         UUID REFERENCES users(id),     -- NULL = automated
  metadata        JSONB NOT NULL DEFAULT '{}'
);
```

---

## 16. Channel Manager Integration

```sql
-- OTA/channel configuration per property
CREATE TABLE channel_configs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  channel_code    TEXT NOT NULL,                 -- 'booking_com', 'expedia', 'airbnb', etc.
  is_active       BOOLEAN NOT NULL DEFAULT false,
  price_markup_pct NUMERIC(5,2) NOT NULL DEFAULT 0,  -- % added on top of base price
  -- Max availability per room type: {"room_type_uuid": 4, ...}
  max_availability JSONB NOT NULL DEFAULT '{}',
  -- OTA-specific settings (API keys, property IDs, etc.) — encrypted at rest
  credentials     JSONB NOT NULL DEFAULT '{}',
  tax_handling    TEXT NOT NULL DEFAULT 'excluded' CHECK (tax_handling IN ('included', 'excluded')),
  last_pushed_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, channel_code)
);

-- Sync status log (immutable, append-only)
CREATE TABLE channel_sync_log (
  id              BIGSERIAL PRIMARY KEY,
  property_id     UUID NOT NULL,
  channel_code    TEXT NOT NULL,
  sync_type       TEXT NOT NULL CHECK (sync_type IN ('availability', 'rates', 'restrictions', 'reservation')),
  direction       TEXT NOT NULL CHECK (direction IN ('push', 'pull')),
  status          TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),
  records_affected INTEGER,
  error_message   TEXT,
  payload_summary JSONB,                         -- what was sent/received
  synced_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 17. Regulatory Reporting Tables

Rather than generating reports purely from reservations, maintain pre-aggregated nightly snapshots to make report generation fast and idempotent.

```sql
-- Nightly snapshot of overnight stays (for ISTAT/HESTA reporting)
CREATE TABLE overnight_snapshots (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id         UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  stay_date           DATE NOT NULL,
  guest_id            UUID REFERENCES guests(id),
  reservation_id      UUID REFERENCES reservations(id),
  nationality         CHAR(2),
  is_minor            BOOLEAN NOT NULL DEFAULT false,
  room_type_id        UUID REFERENCES room_types(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, stay_date, reservation_id, guest_id)
);

-- Generated regulatory reports (idempotent: can regenerate any period)
CREATE TABLE regulatory_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  report_type     TEXT NOT NULL CHECK (report_type IN ('istat', 'hesta', 'polca', 'checkin_report', 'income_report')),
  period_from     DATE NOT NULL,
  period_to       DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'submitted')),
  file_url        TEXT,                          -- storage URL for generated PDF/XML
  submitted_at    TIMESTAMPTZ,
  generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_by    UUID REFERENCES users(id)
);
```

---

## 18. Soft Delete Strategy

### Decision: Archive table pattern (not `deleted_at` flag)

**Against `deleted_at` on active tables:**
- Every query must append `WHERE deleted_at IS NULL` — leaks into all code paths
- Unique constraints require partial indexes to work correctly
- Foreign key integrity is undermined (a "deleted" reservation can still have live orders pointing to it)
- GDPR deletion requests require complex CTE queries to find and purge

**Recommended approach:** Keep active tables clean. Use a `deleted_records` archive for recovery and audit.

```sql
CREATE TABLE deleted_records (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_table  TEXT NOT NULL,
  original_id     UUID NOT NULL,
  deleted_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_by      UUID REFERENCES users(id),
  deletion_reason TEXT,
  data            JSONB NOT NULL              -- full row snapshot at deletion time
);

CREATE INDEX ON deleted_records (original_table, original_id);
CREATE INDEX ON deleted_records (deleted_at);
```

**For reservations specifically:** Cancellations are NOT deletions — they are status transitions to `'cancelled'`. Only use `deleted_records` for:
- Rooms removed from inventory
- Rate plans deactivated and purged after a grace period
- Test data cleanup in development

**`is_active` flags** (not soft deletes) for entities that should be hidden without deletion: `rate_plans.is_active`, `rooms.is_active`, `extras.is_active`, `promotions.is_active`.

---

## 19. Complete Schema (annotated DDL)

The tables above constitute the full schema. Extension requirements:

```sql
-- Required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "btree_gist";    -- EXCLUDE constraints on dateranges
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- trigram similarity for guest deduplication
CREATE EXTENSION IF NOT EXISTS "unaccent";      -- accent-insensitive name matching for Italian/German names
```

---

## 20. Indexes & Performance

### Critical indexes for reservation availability queries

```sql
-- Room availability: finding free rooms for a date range
-- (joins reservation_rooms to find occupied rooms)
CREATE INDEX idx_reservation_rooms_dates
  ON reservation_rooms (room_id, checkin_date, checkout_date)
  WHERE checkin_date IS NOT NULL;

-- Price calendar lookups (most frequent query path)
CREATE INDEX idx_price_calendar_lookup
  ON price_calendar (rate_plan_id, room_type_id, stay_date);

-- Reservation search by guest (CRM lookups)
CREATE INDEX idx_reservations_guest_id
  ON reservations (property_id, guest_id);

-- Reservation list by checkin date (daily operations view)
CREATE INDEX idx_reservations_checkin
  ON reservations (property_id, status)
  INCLUDE (reservation_number, guest_snapshot, booked_at);

-- Guest fuzzy search (trigram)
CREATE INDEX idx_guests_name_trgm
  ON guests USING gin ((first_name || ' ' || last_name) gin_trgm_ops);

CREATE INDEX idx_guests_email
  ON guests (lower(email))
  WHERE email IS NOT NULL;

-- Audit log queries (by table + record)
CREATE INDEX idx_audit_log_record
  ON audit_log (table_name, record_id, changed_at DESC);

-- Housekeeping events (history queries)
CREATE INDEX idx_housekeeping_events_room
  ON housekeeping_events (property_id, room_id, changed_at DESC);

-- Channel sync log (status monitoring)
CREATE INDEX idx_channel_sync_recent
  ON channel_sync_log (property_id, channel_code, synced_at DESC);
```

### Partition strategy for large tables

| Table | Partition key | Strategy |
|-------|--------------|----------|
| `audit_log` | `changed_at` | Monthly range partitions |
| `channel_sync_log` | `synced_at` | Monthly range partitions |
| `overnight_snapshots` | `stay_date` | Yearly range partitions |
| `housekeeping_events` | `changed_at` | Yearly range partitions |

Partitioning is NOT needed at launch (tables will be small). Add when any table exceeds ~5M rows.

---

## 21. Key Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Multi-tenancy | Shared schema + RLS | Single migration path, PostgreSQL-native isolation |
| Pricing storage | Sparse override + defaults | Matches CybHotel model, efficient for sparse data |
| Derived rate resolution | Application-layer computation | Avoids recursive SQL, deterministic |
| Multilingual content | JSONB on entity table | No joins needed, language addition is schema-free |
| Audit log | Trigger-based changelog | 100% coverage, simple query model |
| Soft delete | Archive table (not `deleted_at`) | Clean FK integrity, GDPR-compliant |
| Cancellation tracking | Status field ('cancelled') | Not a delete — reservation data must be retained |
| Guest deduplication | Score + manual merge queue | Automated only on definitive signal (document match) |
| RBAC | Built-in roles + per-user overrides | Handles standard cases + edge cases without complexity |
| Extras | Self-service, unlimited types | Fixes CybHotel's major friction point |
| Date-range constraints | EXCLUDE with btree_gist | Database-enforced non-overlap for pricing/extras |
| Primary keys | UUID (gen_random_uuid()) | Safe for distributed systems, OTA-origin IDs can coexist |
| Monetary values | `NUMERIC(10,2)` | No floating-point rounding errors |

---

## Gaps & Open Questions

1. **OTA credential encryption:** `channel_configs.credentials` should be encrypted at rest using `pgcrypto`'s `pgp_sym_encrypt` or stored in a secrets manager (Vault, AWS Secrets Manager) with only a reference in the table. The schema above defers this to the implementation phase.

2. **Availability locking under concurrent bookings:** The schema uses row-level pessimistic locks (`SELECT ... FOR UPDATE`) on `reservation_rooms` to prevent double-booking. Full concurrency design (with queue behavior under high OTA load) requires a separate phase.

3. **Loyalty points mechanics:** The schema has `loyalty_points` and `loyalty_tier` columns but no loyalty rules table. Define earn/burn rules during the CRM phase.

4. **Kiosk interface data model:** The `visible_kiosk` flag on promotions is captured, but the full kiosk session model (self check-in flow, document scan) is a separate feature with its own schema extensions.

5. **Meeting rooms:** CybHotel has a meeting room module with QR key generation. Excluded from this model — treat as a Phase 2 extension. The `rooms` table can accommodate meeting rooms with a `room_category` discriminator column added later.

6. **GDPR data retention:** A job that automatically purges guest PII after a configurable retention period (e.g., 7 years for financial records, 2 years for non-transacting guest profiles) needs implementation. The `guest_consents` table provides the legal basis tracking required.

---

*Research compiled from: CybHotel deep analysis, PostgreSQL documentation, AWS RLS multi-tenancy guide, SoftwareMill event sourcing article, brandur.org soft deletion analysis, DEV.to hotel reservation schema, and CYBERTEC PostgreSQL auditing resources.*
