# LibertyGest MVP Plan

## Vision
Replace CybHotel with a modern, AI-ready hotel PMS that has:
- **Admin Panel** — hotel management backend (rooms, reservations, pricing, housekeeping, stats)
- **Public Website** — guest-facing hotel site with room booking engine
- **API Layer** — REST endpoints for OpenClaw AI agent integration

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | shadcn/ui + Tailwind CSS 4 |
| Calendar | Custom Gantt (MVP), upgrade to FullCalendar Premium later |
| Data Grid | TanStack Table v8 (via shadcn DataTable) |
| Charts | Recharts (via shadcn chart primitives) |
| Forms | React Hook Form v7 + Zod v3 |
| State (client) | Zustand v5 |
| State (server) | TanStack Query v5 |
| API (internal) | tRPC v11 |
| API (external) | REST Route Handlers |
| Database | PostgreSQL 16 (Neon serverless) |
| ORM | Drizzle ORM |
| Auth | Better Auth (RBAC, organizations) |
| i18n | next-intl |
| Email | Resend |

## Monorepo Structure

```
libertygest/
  apps/
    admin/                 # Next.js 15 — hotel management panel
    web/                   # Next.js 15 — public hotel website + booking
  packages/
    db/                    # Drizzle schema, migrations, seed data
    api/                   # tRPC routers + REST handlers (shared logic)
    types/                 # Shared Zod schemas + TypeScript types
    ui/                    # Shared shadcn/ui components
    config/                # Shared ESLint, TypeScript, Tailwind config
```

## MVP Phases

### Phase 1: Foundation (Current)
- [x] CybHotel deep analysis
- [ ] Monorepo setup (Turborepo + Next.js 15 x2)
- [ ] Database schema (Drizzle + core tables)
- [ ] Auth system (Better Auth + RBAC roles)
- [ ] Base UI layout (admin sidebar, header, auth pages)

### Phase 2: Core Admin — Room & Property Management
- [ ] Property settings page
- [ ] Room types CRUD
- [ ] Rooms CRUD (number, floor, type)
- [ ] Piano Camere (room floor plan Gantt view)
- [ ] Room status management (available, occupied, cleaning, maintenance)

### Phase 3: Reservation Engine
- [ ] Guest management (CRUD, search, dedup candidates)
- [ ] New reservation flow (search availability → select offer → guest details → confirm)
- [ ] Reservation list with filters (date, channel, status, guest)
- [ ] Reservation detail view (guest info, room, payment, notes, timeline)
- [ ] Check-in / Check-out workflow

### Phase 4: Pricing Engine
- [ ] Rate plans (Primary/Derived hierarchy)
- [ ] Default pricing per room type (min/max/per-person)
- [ ] Calendar price overrides
- [ ] Dynamic pricing algorithm (occupancy + lead time + day-type)
- [ ] Extras/supplements with date-range pricing
- [ ] VAT configuration
- [ ] Promotions engine
- [ ] Voucher system

### Phase 5: Public Website + Booking Engine
- [ ] Hotel showcase pages (multilingual IT/DE/EN/FR)
- [ ] Room type gallery with photos and amenities
- [ ] Availability search widget
- [ ] Booking flow (dates → room selection → guest details → payment → confirmation)
- [ ] Booking confirmation email
- [ ] SEO optimization (localized routes, metadata, sitemap)

### Phase 6: Operations
- [ ] Housekeeping module (status board, mobile PWA, forecast, history)
- [ ] Dashboard (today's arrivals/departures, occupancy, revenue, cleaning status)
- [ ] Statistics (occupancy, revenue, marketing channels, KPI cockpit)
- [ ] Reports (check-in, income, touristic/ISTAT)
- [ ] Communication history per reservation

### Phase 7: Integrations
- [ ] OpenClaw AI agent REST API
- [ ] Channel manager (OTA sync)
- [ ] Payment gateway (Stripe)
- [ ] HESTA/POLCA/ISTAT regulatory reporting
- [ ] Gate opener / IoT integration
- [ ] Audit log with trigger-based changelog

## Database Design Principles

1. **Multi-tenant**: Shared schema + PostgreSQL RLS with `property_id`
2. **Pricing**: Sparse override table (defaults + calendar exceptions)
3. **Rate plans**: Primary/Derived hierarchy resolved in application layer
4. **Multilingual**: JSONB on entity rows `{"it":"...","en":"...","de":"...","fr":"..."}`
5. **Audit**: Trigger-based changelog with JSONB old/new, partitioned by month
6. **Soft delete**: Archive table pattern (active tables stay clean)
7. **Guest dedup**: Scored candidate queue + manual merge
8. **Extras**: Self-service unlimited types (unlike CybHotel's hardcoded 4)

## Design Improvements Over CybHotel

1. **Full RBAC** — 5 built-in roles + custom permission overrides
2. **Mobile-first housekeeping** — PWA with swipe status, notes, photos
3. **Self-service extras** — create unlimited add-on services
4. **60-min session timeout** — configurable, no reCAPTCHA on every login
5. **Unified search** — Cmd+K global search across reservations, guests, rooms
6. **Guest CRM** — profiles, preferences, stay history, loyalty
7. **Communication log** — per-reservation email timeline with delivery status
8. **Audit trail** — every pricing/settings change tracked with who/when/what
9. **Calendar navigation** — prev/next arrows, preset periods, no manual date typing
10. **Real-time dashboard** — SSE-based live updates for room status
