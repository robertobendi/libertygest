# LibertyGest — Hotel Property Management System
## Complete Software Architecture & Feature Plan

---

## 1. EXECUTIVE SUMMARY

LibertyGest is a modern, cloud-native hotel PMS (Property Management System) built to replace CybHotel/eRoomNetwork. It improves upon the current system with:

- **API-first architecture** — every feature accessible via REST/GraphQL API
- **AI-agent ready** — OpenClaw (AI assistant) can operate the entire system
- **Modern UX** — responsive web app, mobile-first design
- **Real-time** — WebSocket-driven live updates across all modules
- **Multi-property** — manage multiple hotels from one dashboard
- **Multi-language** — Italian, English, German, French (expandable)

---

## 2. TECH STACK

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15 + React 19 | SSR, fast, great DX |
| **UI Library** | shadcn/ui + Tailwind CSS 4 | Beautiful, accessible, customizable |
| **State** | Zustand + TanStack Query | Lightweight, cache-friendly |
| **Backend** | Node.js + Hono (or Fastify) | Fast, typed, edge-ready |
| **API** | REST + tRPC | Type-safe end-to-end |
| **Database** | PostgreSQL 16 | Robust, relational, proven for PMS |
| **ORM** | Drizzle ORM | Type-safe, lightweight, great migrations |
| **Cache** | Redis | Sessions, real-time, rate limiting |
| **Real-time** | WebSockets (Socket.io) | Live dashboard, housekeeping updates |
| **Auth** | Better Auth or Lucia | Session-based, role management |
| **Payments** | Stripe + DATATRANS | PCI compliant, European market |
| **File Storage** | S3-compatible (MinIO/Cloudflare R2) | Documents, ID scans, invoices |
| **Search** | Meilisearch | Fast guest/reservation search |
| **Deployment** | Docker + Railway/Fly.io (or VPS) | Easy deploy, scalable |
| **AI Integration** | OpenAI API (for OpenClaw) | Tool-calling, function-based agent |

---

## 3. FEATURE MODULES

### 3.1 — DASHBOARD (Active Desktop)
> *Replaces CybHotel's Active Desktop*

- **Live occupancy overview** — visual room grid showing occupied/available/cleaning/maintenance
- **Today's arrivals & departures** — quick-action cards
- **Revenue KPIs** — today, this week, this month, vs last year
- **Occupancy rate** — real-time percentage with trend chart
- **ADR (Average Daily Rate)** — live calculation
- **RevPAR** — revenue per available room
- **Alerts & notifications** — overdue payments, overbookings, maintenance requests
- **Quick actions** — new reservation, walk-in check-in, search guest
- **Weather widget** — local weather (useful for tourism planning)
- **OpenClaw AI assistant panel** — embedded chat for AI operations

### 3.2 — RESERVATION MANAGEMENT
> *Replaces & improves CybHotel's reservation module*

- **Interactive calendar** — drag-and-drop booking on a visual timeline (Gantt-style)
- **Room availability grid** — real-time by room type and specific room
- **Booking creation** — manual, phone, walk-in, online
- **Rate management** — seasonal pricing, weekend/weekday rates, dynamic pricing
- **Rate plans** — multiple plans per room type (flexible, non-refundable, early bird, last-minute)
- **Booking modifications** — extend, shorten, change room, split stays
- **Cancellation management** — policies, penalties, automatic refunds
- **Group bookings** — block rooms, group billing, rooming lists
- **Waitlist** — when fully booked, manage waitlisted requests
- **Confirmation emails** — automatic, customizable templates (multi-language)
- **Booking notes** — internal notes per reservation
- **Deposit management** — track pre-payments, deposit deadlines
- **Overbooking protection** — alerts + configurable overbooking buffer

### 3.3 — FRONT DESK / CHECK-IN & CHECK-OUT
> *Replaces CybHotel's arrival/departure management + CybDesk kiosk*

- **Express check-in** — pre-filled from reservation data
- **Document scanning** — ID/passport capture (camera or upload)
- **Digital registration card** — e-signature on tablet/phone
- **Room assignment** — smart assignment based on preferences, accessibility, floor
- **Key/access delivery** — generate QR code, PIN code, or RFID card
- **Upgrade offers** — suggest available upgrades at check-in
- **Express check-out** — one-click with automatic invoice email
- **Late check-out management** — requests, availability check, surcharge
- **Folio review** — guest reviews charges before departure
- **Guest self-service portal** — web-based check-in/out (replaces physical kiosk)
- **Walk-in management** — quick booking + immediate check-in flow

### 3.4 — GUEST PROFILES (CRM)
> *Replaces CybHotel's customer profiles*

- **Guest database** — searchable, filterable guest records
- **Stay history** — all past/future stays, preferences, spending
- **Guest preferences** — room type, floor, pillow type, allergies, notes
- **VIP/loyalty tiers** — tag guests, automatic recognition
- **Communication log** — all emails, messages, calls logged
- **GDPR compliance** — data export, deletion requests, consent management
- **Duplicate detection** — merge duplicate guest profiles
- **Company profiles** — corporate accounts, negotiated rates, billing
- **Guest satisfaction** — post-stay survey integration, review tracking

### 3.5 — ROOM & PROPERTY MANAGEMENT
> *Replaces CybHotel's room type management*

- **Room inventory** — all rooms with type, floor, amenities, photos
- **Room types** — single, double, triple, quad, junior suite, suite (configurable)
- **Room status board** — clean, dirty, inspected, out of order, maintenance
- **Amenity management** — per-room and per-type amenities tracking
- **Floor plans** — visual property layout (optional)
- **Maintenance requests** — log issues, assign to staff, track resolution
- **Out-of-order management** — block rooms with reason and expected return date
- **Multi-property** — switch between properties from one account

### 3.6 — HOUSEKEEPING
> *Replaces CybHotel's Room Cleaning System webapp*

- **Housekeeping dashboard** — real-time room status board
- **Task assignment** — assign rooms to cleaning staff (manual or auto-distribute)
- **Mobile app for staff** — cleaners update room status from phone
- **Priority queue** — arrivals get priority, departures next, stayovers last
- **Inspection workflow** — supervisor inspects after cleaning, marks approved
- **Minibar tracking** — log consumption, auto-add to folio
- **Linen/supply tracking** — inventory for cleaning supplies
- **Lost & found** — log items, track returns
- **Time tracking** — how long each room takes to clean (performance metrics)
- **Real-time notifications** — front desk notified instantly when room is ready

### 3.7 — BILLING & INVOICING
> *Replaces CybHotel's invoice module*

- **Guest folio** — running tab of all charges during stay
- **Multiple folios** — split billing (guest pays room, company pays minibar)
- **Charge posting** — room charges, restaurant, spa, minibar, extras
- **Payment processing** — credit card (Stripe/DATATRANS), cash, bank transfer, voucher
- **Automatic charges** — nightly room rate, city tax, recurring services
- **Invoice generation** — professional PDF invoices with hotel branding
- **Credit notes** — partial/full refunds
- **City/tourist tax** — automatic calculation based on municipality rules
- **Fiscal compliance** — Italian fiscal receipt integration (SDI/Agenzia Entrate)
- **Proforma invoices** — for deposits and pre-payments
- **Account receivable** — track unpaid invoices, aging report
- **Vouchers & discounts** — percentage, fixed amount, promo codes
- **Currency support** — EUR primary, multi-currency display

### 3.8 — CHANNEL MANAGER
> *Replaces CybHotel's Channel Manager*

- **Two-way sync** — real-time availability/rate sync with OTAs
- **Supported channels:**
  - Booking.com
  - Expedia / Hotels.com
  - Airbnb
  - Google Hotel Ads
  - TripAdvisor
  - HRS
  - Custom channels (API)
- **Rate parity management** — ensure consistent pricing or strategic differentiation
- **Inventory allocation** — allocate rooms per channel
- **Restriction management** — min stay, max stay, CTA (closed to arrival), CTD
- **Mapping** — map room types and rate plans to channel equivalents
- **Booking import** — automatically create reservations from channel bookings
- **Revenue dashboard** — revenue per channel, commission tracking

### 3.9 — BOOKING ENGINE (Website Widget)
> *Replaces CybHotel's Booking Engine*

- **Embeddable widget** — JS snippet for hotel website
- **Responsive design** — works on mobile/tablet/desktop
- **Real-time availability** — live room availability and pricing
- **Multi-room booking** — guests can book multiple rooms
- **Add-ons/extras** — breakfast, parking, airport transfer, packages
- **Promo codes** — discount code input
- **Secure payment** — Stripe checkout, 3D Secure
- **Confirmation email** — instant with booking details
- **Multi-language** — IT, EN, DE, FR
- **Commission-free** — no commission on direct bookings
- **SEO-friendly** — proper meta tags, schema.org markup
- **Google Analytics** — track conversion funnel

### 3.10 — ACCESS MANAGEMENT (Smart Locks)
> *Replaces CybHotel's CybBox/CybGate QR code system*

- **QR code access** — unique per stay, auto-expires at checkout
- **PIN code access** — numeric code for room entry
- **RFID card support** — traditional key card encoding
- **Mobile key** — guest opens door with phone (BLE)
- **Common areas** — pool, gym, parking gate access control
- **Access logs** — who entered which room, when
- **Remote unlock** — staff can unlock any door from dashboard
- **Integration APIs** — compatible with major smart lock brands (Nuki, TTLock, SALTO, etc.)
- **CybBox compatibility** — maintain existing hardware if needed

### 3.11 — REPORTING & ANALYTICS
> *Improves CybHotel's statistics module*

- **Pre-built reports:**
  - Occupancy report (daily/weekly/monthly/yearly)
  - Revenue report (by room type, channel, rate plan)
  - ADR & RevPAR trends
  - Guest demographics (nationality, repeat vs new)
  - Channel performance (revenue, bookings, cancellations per OTA)
  - Housekeeping performance
  - Forecast report (upcoming occupancy/revenue)
  - Night audit report
  - City tax report
  - Accounts receivable aging
  - No-show & cancellation report
- **Custom report builder** — drag-and-drop fields, filters, date ranges
- **Export** — PDF, Excel, CSV
- **Scheduled reports** — auto-email daily/weekly/monthly
- **Dashboard widgets** — pin any report to the main dashboard

### 3.12 — REVENUE MANAGEMENT
> *Replaces CybHotel's revenue management*

- **Dynamic pricing engine** — adjust rates based on occupancy, demand, day of week
- **Rate recommendations** — AI-powered suggestions (via OpenClaw)
- **Competitor rate monitoring** — track nearby hotel prices (optional integration)
- **Yield management** — maximize revenue per room
- **Min/max stay rules** — per date range, per room type
- **Blackout dates** — block certain rates during peak periods
- **Pricing calendar** — visual rate overview with color coding

### 3.13 — COMMUNICATION & MESSAGING
> *New module — not in CybHotel*

- **Guest messaging** — in-app chat, WhatsApp, SMS, email
- **Automated messages:**
  - Pre-arrival info (directions, check-in instructions)
  - Welcome message at check-in
  - Mid-stay satisfaction check
  - Post-stay thank you + review request
- **Template management** — multi-language message templates
- **Staff internal chat** — communication between departments
- **Broadcast messages** — send to all current guests (e.g., event notification)

### 3.14 — SELF-SERVICE GUEST PORTAL
> *Modernizes CybHotel's CybDesk kiosk into a web experience*

- **Web-based** — no hardware needed, works on guest's phone
- **Pre-arrival:**
  - Upload ID/passport
  - Fill registration card
  - Select room preferences
  - Add extras (breakfast, parking)
  - Make pre-payment
- **During stay:**
  - View folio / charges
  - Request services (towels, room service)
  - Report issues
  - Extend stay
  - Access room (QR code)
- **Checkout:**
  - Review final bill
  - Pay outstanding balance
  - Download invoice
  - Leave feedback

### 3.15 — RESTAURANT & POS INTEGRATION
> *New module — extends beyond CybHotel*

- **Restaurant management** — table tracking, meal plans (breakfast/half-board/full-board)
- **POS integration** — charges from restaurant/bar post to guest folio
- **Meal plan tracking** — which meals are included, consumed
- **Breakfast list** — auto-generated from arrivals + meal plans
- **Minibar POS** — charge minibar items to folio

### 3.16 — STAFF MANAGEMENT
> *New module*

- **Employee directory** — roles, contact info, departments
- **Shift scheduling** — visual calendar for staff shifts
- **Role-based access** — receptionist, housekeeper, manager, admin, owner
- **Activity log** — who did what, when (audit trail)
- **Performance metrics** — check-ins handled, rooms cleaned, response times

---

## 4. OPENCLAW AI AGENT INTEGRATION

OpenClaw operates LibertyGest through the API as a first-class user:

### 4.1 — How It Works
```
Guest/Staff → asks OpenClaw (chat/voice) → OpenClaw calls LibertyGest API → action performed
```

### 4.2 — OpenClaw Capabilities
- **Reservation management** — "Book room 204 for Mr. Rossi, March 15-18"
- **Availability checks** — "Do we have any suites available next weekend?"
- **Price quotes** — "How much for a double room July 10-15 with breakfast?"
- **Check-in/out** — "Check in guest Müller, room 301"
- **Folio management** — "Add minibar charge of €8 to room 205"
- **Housekeeping dispatch** — "Send cleaning to room 102, guest arriving in 30 min"
- **Report generation** — "Show me this month's occupancy by room type"
- **Rate adjustments** — "Increase weekend rates by 15% for next month"
- **Guest lookup** — "Find all stays for Marco Bianchi"
- **Smart suggestions** — "We're at 90% occupancy Saturday, recommend rate increase"
- **Multi-language** — operates in IT/EN/DE/FR based on guest language

### 4.3 — Technical Integration
- **Tool-calling pattern** — OpenClaw uses OpenAI function calling with LibertyGest API as tools
- **Dedicated API scope** — `agent:*` permission scope for AI operations
- **Rate limiting** — separate limits for AI agent vs human users
- **Audit trail** — all AI actions logged with `actor: openclaw` tag
- **Confirmation mode** — configurable: some actions require human approval
- **Context injection** — OpenClaw receives hotel context (occupancy, rates, rules) in system prompt

---

## 5. DATABASE SCHEMA (High-Level)

```
properties          — hotel/property records
rooms               — individual rooms (belongs to property)
room_types          — room categories (single, double, suite...)
rate_plans          — pricing plans per room type
rates               — actual prices per date/room_type/rate_plan
reservations        — bookings (status: confirmed/checked_in/checked_out/cancelled/no_show)
reservation_rooms   — rooms assigned to reservation
guests              — guest profiles
guest_documents     — ID/passport scans
folios              — billing accounts per stay
folio_items         — individual charges/payments
invoices            — generated invoices
payments            — payment transactions
housekeeping_tasks  — cleaning assignments
maintenance_requests — repair/issue tickets
channels            — OTA/booking channel configs
channel_bookings    — bookings from external channels
access_codes        — QR/PIN/RFID codes per stay
messages            — guest/staff communications
staff               — employee records
audit_log           — all system actions
settings            — property-level configuration
```

---

## 6. ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTS                                  │
├──────────┬──────────┬──────────┬──────────┬────────────────  │
│ Web App  │ Mobile   │ Booking  │ Guest    │ OpenClaw AI     │
│ (Staff)  │ (HK)    │ Engine   │ Portal   │ Agent           │
└────┬─────┴────┬─────┴────┬─────┴────┬─────┴───────┬────────┘
     │          │          │          │             │
     └──────────┴──────────┴──────────┴─────────────┘
                           │
                    ┌──────┴──────┐
                    │   API GW    │  (Auth, Rate Limit, Logging)
                    │   + tRPC    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
    │ Core API  │   │ Channel   │   │ Payment   │
    │ Service   │   │ Service   │   │ Service   │
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────┴──────┐
                    │ PostgreSQL  │
                    │   + Redis   │
                    └─────────────┘
```

---

## 7. IMPLEMENTATION PHASES

### Phase 1 — Foundation (Weeks 1-3)
- Project scaffolding (Next.js + API)
- Database schema + migrations
- Authentication + role-based access
- Property & room setup module
- Basic dashboard layout

### Phase 2 — Core Operations (Weeks 4-7)
- Reservation management (calendar, CRUD, status flow)
- Guest profiles (CRM)
- Front desk (check-in/check-out flow)
- Room status board
- Rate management

### Phase 3 — Billing & Housekeeping (Weeks 8-10)
- Folio management
- Payment integration (Stripe)
- Invoice generation (PDF)
- City/tourist tax
- Housekeeping module + mobile view
- Italian fiscal compliance (base)

### Phase 4 — Distribution (Weeks 11-13)
- Booking engine (embeddable widget)
- Channel manager integration (Booking.com, Airbnb)
- Rate sync + availability sync
- Overbooking protection

### Phase 5 — Smart Features (Weeks 14-16)
- Access management (QR codes, PINs)
- Guest self-service portal
- Messaging system (email + WhatsApp)
- Automated communications

### Phase 6 — Intelligence (Weeks 17-19)
- Reporting & analytics module
- Revenue management / dynamic pricing
- OpenClaw AI integration
- AI-powered rate recommendations

### Phase 7 — Polish & Launch (Weeks 20-22)
- Multi-language (IT/EN/DE/FR)
- Staff management module
- Restaurant/POS integration
- Data migration from CybHotel
- Testing, security audit, launch

---

## 8. WHAT LIBERTYGEST DOES BETTER THAN CYBHOTEL

| Area | CybHotel | LibertyGest |
|------|----------|-------------|
| **UX** | Dated interface | Modern, responsive, dark/light mode |
| **Mobile** | Separate webapp for cleaning only | Full mobile experience for all roles |
| **Self check-in** | Requires physical kiosk (CybDesk) | Web-based, works on guest's phone |
| **AI** | None | OpenClaw integrated — manages hotel by chat/voice |
| **API** | Limited/none | Full API — every action programmable |
| **Channels** | Basic channel manager | Deep 2-way sync with major OTAs |
| **Messaging** | Email only | WhatsApp, SMS, in-app, automated flows |
| **Reporting** | Basic statistics | Advanced analytics + custom reports |
| **Revenue** | Basic | AI-powered dynamic pricing |
| **Multi-property** | Unknown | Built-in from day one |
| **Fiscal** | Unknown | Italian SDI/e-invoice compliant |
| **Access** | QR + RFID + CybBox | QR + PIN + RFID + Mobile BLE + smart lock APIs |
| **Guest portal** | Limited | Full self-service (pre-arrival to checkout) |

---

## 9. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: Dashboard loads < 1s, API responses < 200ms
- **Security**: OWASP Top 10 compliant, encrypted PII, PCI for payments
- **Availability**: 99.9% uptime target
- **Backup**: Automated daily backups with point-in-time recovery
- **GDPR**: Full compliance — data export, right to deletion, consent tracking
- **Accessibility**: WCAG 2.1 AA compliant
- **Audit**: Every action logged with user, timestamp, IP
- **Scalability**: Handle 1-50 properties, 1-5000 rooms
