# LibertyGest Frontend & Full-Stack Research

**Project:** LibertyGest Hotel PMS
**Researched:** 2026-04-13
**Overall confidence:** HIGH (most decisions verified via multiple 2026 sources)

---

## 1. FRAMEWORK — Next.js 15 (confirmed)

**Verdict: Next.js 15 with App Router. No contest for this project.**

The existing PLAN.md already picked Next.js 15 and research confirms it. Here is the
evidence-based rationale:

### Why not the alternatives

**SvelteKit** — 85KB vs 240KB bundle is a real win, but the ecosystem gap matters here.
LibertyGest needs complex admin forms, Gantt calendars, data grids, charts, RBAC — every
one of those has a well-documented React/Next.js path. SvelteKit's smaller community means
fewer Stack Overflow answers, fewer ready-made components, and fewer hiring options if Rocco
ever brings on a developer. The bundle size advantage disappears entirely once you load
Mobiscroll or FullCalendar anyway. Reject.

**Nuxt 4** — Vue ecosystem. No advantage for this project over Next.js given the target
stack is React. Nuxt DevTools are excellent but not a sufficient differentiator. Reject.

**Remix** — Excellent DX, web-standards-first. But smaller ecosystem than Next.js and the
Shopify acquisition/React Router merge has created uncertainty. Less community tooling for
the admin dashboard use case. Reject.

### Next.js 15 strengths for this project

- App Router is now stable and the Pages Router is entering maintenance mode
- React Server Components reduce client-side JS for the public website
- Route Handlers replace express-style API endpoints cleanly
- Middleware enables RBAC at the edge (check session role before serving admin routes)
- Vercel/self-host both well-supported; deploy on Railway, Fly.io, or VPS
- AI SDK (Vercel) has native Next.js App Router integration — directly useful for OpenClaw
- The job market is dominated by React + Next.js if Rocco ever needs outside help

### Deployment target recommendation

**Neon** (serverless Postgres) over Supabase for database hosting. After the Databricks
acquisition (2025), Neon dropped storage prices ~80%. Auto-suspend means near-zero cost
when idle. Native `@neondatabase/serverless` driver works perfectly with Next.js Route
Handlers. Supabase is excellent but brings auth/realtime/storage you won't use (you're
building your own auth and using S3-compatible storage separately).

---

## 2. MONOREPO STRATEGY — Turborepo (recommended with caveats)

**Verdict: Turborepo for now. Upgrade path to Nx if the codebase grows.**

LibertyGest has two distinct frontends: the admin panel and the public hotel website. A
monorepo lets you share types, Zod schemas, utility functions, and API client code without
npm package publishing.

**Turborepo wins for teams under 5 developers** (this project: 1-2 developers):
- Minimal setup, turborepo.json is ~20 lines
- Vercel built it; excellent Next.js integration
- Caching is automatic — changed packages only rebuild affected dependents
- Lower learning curve than Nx

**Nx would be better if:**
- You hit 10+ packages in the monorepo
- You need enforced architectural boundaries (e.g., "admin app must not import from public app")
- You need code generators for scaffolding new modules

**Monorepo structure recommendation:**
```
libertygest/
  apps/
    admin/          # Next.js 15 — hotel management panel
    web/            # Next.js 15 — public hotel website
  packages/
    db/             # Drizzle schema + migrations
    api-client/     # tRPC client (shared between admin + web)
    types/          # Shared TypeScript types, Zod schemas
    ui/             # Shared shadcn/ui components (optional)
    config/         # Shared eslint, tsconfig, tailwind base
```

---

## 3. UI COMPONENT LIBRARY — shadcn/ui + Tailwind CSS 4

**Verdict: shadcn/ui for the admin panel. Tailwind CSS 4 for both.**

### Why shadcn/ui beats the alternatives for this project

**vs Ant Design:**
- Ant Design's aesthetic is strongly opinionated toward enterprise-Chinese design language.
  Getting it to look like a modern European hotel software requires fighting the defaults.
  Customization cost is high. Bundle is large. Reject for primary UI.

**vs Material UI (MUI):**
- MUI is excellent but the component code is locked in a library you can't modify. When you
  need a deeply custom Gantt cell or a specialized pricing table, you hit walls. MUI X (data
  grid, date pickers, charts) requires paid license for advanced features. The v5 emotion-based
  styling conflicts with Tailwind. Reject as primary.

**vs Mantine:**
- Mantine is the strongest alternative and genuinely good. It ships faster to productivity than
  shadcn/ui. If Rocco wants to minimize setup time, Mantine is a valid choice. However:
  shadcn/ui has become the dominant ecosystem in 2026, with more admin templates, more
  community components, and better Tailwind 4 alignment. The "copy components into your
  project" model means deep customization is always possible — critical for a Gantt calendar
  admin and specialized hotel forms. shadcn/ui wins on long-term flexibility.

### Key shadcn/ui components for LibertyGest

- `DataTable` (TanStack Table integration) — reservation lists, guest lists, billing
- `Calendar` / `DatePicker` — check-in/check-out date selection
- `Sheet` (slide-over panel) — reservation detail panel on admin calendar
- `Command` — global search (Cmd+K), guest lookup, quick actions
- `Form` + React Hook Form integration — built-in, zero extra work
- `Dialog` — confirmation modals, quick-add reservation
- `Tabs` — room detail, guest profile sections
- `Badge` — room status (available/occupied/cleaning/maintenance)

### Tailwind CSS 4

Tailwind v4 (released 2025) uses a new Vite-first engine. No `tailwind.config.js` — all
configuration via CSS variables in a `.css` file. Significantly faster build times. Fully
compatible with Next.js 15. Use it.

---

## 4. CALENDAR / GANTT — FullCalendar Premium (resource-timeline)

**Verdict: FullCalendar with the Premium Scheduler plugin.**

This is the most critical UI decision for LibertyGest. The room calendar — rooms as rows,
dates as columns, bookings as draggable blocks — is the core of every PMS. Getting this
wrong means a rewrite.

### Option evaluation

| Library | Model | Cost | Hotel Fit | Notes |
|---------|-------|------|-----------|-------|
| FullCalendar Premium | Commercial | ~$500/dev/yr | Excellent | Resource-timeline view is exactly a hotel room grid |
| Mobiscroll | Commercial | $995 one-time | Excellent | Property booking calendar demo exists |
| DHTMLX Scheduler | Commercial | $599+ | Very good | Long-established, Java-era feel |
| Bryntum Scheduler | Commercial | $940/dev | Excellent | Most powerful, most expensive |
| react-big-calendar | MIT free | Free | Poor | No resource/row-per-room view |
| shadcn/ui Gantt | MIT free | Free | Limited | Basic, no drag-drop for reservations |
| SVAR React Gantt | MIT free | Free | Moderate | No resource rows |

**Recommendation: FullCalendar Premium Scheduler.**

Reasons:
1. `resource-timeline` view maps directly to the hotel concept: each room is a resource row,
   time flows left to right, bookings are draggable events
2. React component first-class support (`@fullcalendar/react`)
3. TypeScript types included
4. Event drag-drop, resize, overlap prevention built-in
5. v9 planned for Q1 2026 with composable React components
6. Most tutorials and examples for hotel/accommodation use cases are FullCalendar-based

**If budget is a hard constraint:** Mobiscroll at $995 one-time (vs FullCalendar's annual
subscription) may be cheaper long-term. Mobiscroll has an explicit "property booking calendar"
demo with exact-time labels for hotel rooms.

**Do not use free open-source options for this.** The room calendar is the UI centrepiece of
the entire PMS. It must support: drag to create/move/resize reservations, multi-room view,
room status color coding, overlapping stay detection, and real-time updates via WebSocket.
Free libraries cannot deliver this without massive custom code.

---

## 5. DATA GRID — TanStack Table v8

**Verdict: TanStack Table (headless) with shadcn/ui DataTable pattern.**

For reservation lists, guest lists, billing tables, housekeeping boards: TanStack Table is
the correct choice. It is headless — you own the HTML — which means it integrates natively
with shadcn/ui components and Tailwind classes.

Key features needed:
- Multi-column sorting (sortable by date, room, status, amount)
- Column-level filtering + global search
- Row selection (bulk operations: bulk assign housekeeper, bulk generate invoices)
- Virtualization for large datasets (react-window integration for 1000+ rows)
- Expandable rows (reservation detail inline)

The shadcn/ui DataTable recipe uses TanStack Table under the hood. This is not extra work —
it's the documented integration path.

**Do not use AG Grid** unless you need Excel-like spreadsheet editing. AG Grid Community is
free but the React version has licensing complications at scale. For display + filter + sort,
TanStack Table is sufficient and much lighter.

---

## 6. ORM — Drizzle ORM

**Verdict: Drizzle ORM over Prisma for this project.**

This was the closest decision. Both are excellent. Here is the evidence:

### Drizzle wins for LibertyGest because:

1. **No code generation step.** Prisma requires `npx prisma generate` after every schema change.
   On a complex PMS schema (15+ tables), this adds friction during development. Drizzle's type
   inference is instantaneous — change the schema, TypeScript immediately knows.

2. **SQL-close queries for complex joins.** Hotel PMS queries are inherently complex:
   "Give me all reservations for room 101 with guest data, rate plan, and payment status, for
   the next 30 days, excluding cancelled ones." These are multi-join queries. Drizzle's
   `.leftJoin()`, `.where()`, `.select()` syntax produces exactly the SQL you'd write manually,
   and you can see and optimize it.

3. **Tiny bundle (~7.4KB vs Prisma's ~1.6MB post-v7 optimizations).** When Route Handlers
   run at the edge or in serverless environments, cold start time matters. Drizzle has zero
   binary dependencies.

4. **Drizzle Studio** — visual database browser comparable to Prisma Studio.

5. **Drizzle Kit** — migration tool that generates SQL migration files you can review and
   version-control. No magic.

### When Prisma would win:
- If the team doesn't know SQL well and prefers the declarative abstraction
- If you need Prisma Accelerate (connection pooling SaaS)
- Larger community = more Stack Overflow answers for edge cases

**Note:** Prisma 7 reduced bundle from 14MB to 1.6MB and dropped the Rust engine. The gap
has narrowed. Either choice is defensible. Drizzle is the recommended choice for a developer
who wants to understand what the database is doing.

---

## 7. AUTH — Better Auth

**Verdict: Better Auth over Auth.js v5, Lucia, or Clerk.**

### Status of alternatives

- **Lucia** — Deprecated as of March 2025. Transformed into educational resources. Do not use
  for new projects.
- **Clerk** — Excellent DX but $800/month at 50,000 MAU. A hotel PMS has staff users (20-50
  at most) but the public website guests are not auth users in the Clerk sense. Still, Clerk's
  "organizations" feature maps well to multi-property. Cost is manageable for staff-only auth
  (~$0 under 10K MAU). Viable option but not recommended.
- **Auth.js v5** — Good, free, self-hosted. Largest Next.js community. However, the "better-auth"
  project has emerged as the modern replacement with better TypeScript ergonomics and built-in
  RBAC support.

### Better Auth wins because:

1. **Built-in RBAC with organizations** — maps directly to LibertyGest: one "organization" per
   hotel property, users have roles (admin, receptionist, housekeeper, owner)
2. **Framework-agnostic but Next.js first-class support**
3. **Database sessions** (not JWT by default) — sessions are immediately revocable, important
   for hotel security (fire a staff member, their session dies instantly)
4. **TypeScript-first design** — full type inference on session object
5. **Self-hosted** — your data, your control, no per-MAU pricing
6. **Active development in 2026**

### RBAC roles for LibertyGest

```
superadmin    → full access, multi-property
admin         → full access, single property
receptionist  → reservations, check-in/out, billing
housekeeper   → housekeeping module only (read rooms, update status)
maintenance   → maintenance requests only
revenue_mgr   → rates, pricing, statistics
readonly      → statistics and reports only
```

---

## 8. FORMS — React Hook Form + Zod

**Verdict: React Hook Form v7 + Zod v3. The ecosystem standard.**

No real competition in 2026. Formik is declining in downloads. TanStack Form is promising but
not yet as mature for complex multi-step forms.

Key advantages for LibertyGest:

- **Uncontrolled inputs** — React Hook Form does not re-render the form on every keystroke.
  A reservation form with 30+ fields stays fast.
- **Zod integration via `@hookform/resolvers`** — write your schema once in Zod, use it for
  both form validation and TypeScript types. One source of truth.
- **Multi-step forms** — RHF supports field arrays and dynamic fields natively. Critical for
  group booking (add N guests to one reservation).
- **shadcn/ui Form component** — wraps RHF natively. Zero integration work.

```typescript
// Example: Zod schema powers both validation AND TypeScript types
const reservationSchema = z.object({
  guestId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.date(),
  checkOut: z.date().refine(d => d > checkIn, "Must be after check-in"),
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(10),
  ratePlanId: z.string().uuid(),
  notes: z.string().max(500).optional(),
})
type ReservationInput = z.infer<typeof reservationSchema>
```

---

## 9. STATE MANAGEMENT — Zustand + TanStack Query

**Verdict: Zustand for client state, TanStack Query for server state.**

This is the 2026 consensus pattern. Server state (reservations, rooms, guests) belongs to
TanStack Query (caching, background refetch, optimistic updates). Client state (UI open/closed,
selected room on calendar, active filters) belongs to Zustand.

**Do not use Redux Toolkit** for this project. It is correct for large teams needing enforced
patterns and time-travel debugging. For 1-2 developers, the boilerplate cost is not justified.

**Why Zustand over Jotai:**
- Single store model is easier to reason about for an admin dashboard
- Easier debugging (one store, not scattered atoms)
- Jotai's atom model is excellent for composable derived state (e.g., calculator apps,
  complex filtering UI) but overkill for LibertyGest's state needs (sidebar open, selected
  date range, active room filter)

### State split example

```typescript
// Zustand — UI state
const useAdminStore = create((set) => ({
  calendarView: 'month',          // week | month | day
  selectedRoomFilter: 'all',
  sidebarOpen: true,
  activeReservationId: null,
  setCalendarView: (view) => set({ calendarView: view }),
}))

// TanStack Query — server state
const { data: reservations } = useQuery({
  queryKey: ['reservations', { from, to, propertyId }],
  queryFn: () => api.reservations.list({ from, to, propertyId }),
  staleTime: 30_000,     // 30 seconds before background refetch
  refetchInterval: 60_000 // live updates every 60s as fallback to WebSocket
})
```

---

## 10. API LAYER — tRPC + REST Route Handlers

**Verdict: tRPC for internal admin operations, REST Route Handlers for public API + AI agent.**

### Architecture

```
Admin frontend  →  tRPC (type-safe, RPC-style, no schema generation)
Public website  →  tRPC or direct Server Components (SSR)
OpenClaw AI     →  REST API (Route Handlers in Next.js)
External OTA    →  REST API (channel manager integration)
```

**Why tRPC for internal:**
- End-to-end TypeScript types between server and client — no OpenAPI spec to maintain
- Works through Next.js Route Handlers (single Next.js app = no separate backend needed)
- React Query integration built-in (`@trpc/react-query`)
- Input validation with Zod on every procedure

**Why REST for external/AI:**
- OpenClaw AI agent needs standard HTTP calls with clear URL patterns
- External channel managers (Booking.com, Expedia) use REST webhooks
- REST endpoints are easier to document and expose to third parties
- tRPC procedures are not consumable by non-TypeScript clients

### API structure

```
/api/trpc/[trpc]     # Admin tRPC router (authenticated)
/api/v1/reservations # Public REST (OpenClaw + webhooks)
/api/v1/rooms        # Public REST
/api/v1/availability # Public REST (booking engine)
/api/webhooks/stripe # Stripe payment webhooks
/api/webhooks/ota    # Channel manager callbacks
```

---

## 11. i18n — next-intl

**Verdict: next-intl for both admin and public website.**

Languages needed: IT (primary), DE, EN, FR.

### Why next-intl

- Built specifically for Next.js App Router
- Works with React Server Components — translations in Server Components = no client JS overhead
- Minimal setup for Next.js (no complex provider tree)
- Supports typed message keys via TypeScript integration
- Static rendering with localized routes (`/it/`, `/de/`, `/en/`, `/fr/`)

### Why not the alternatives

- **react-i18next:** More boilerplate for App Router, larger bundle (~6KB), not built for RSC.
  Valid if team knows i18next from previous projects. Not recommended for a new project.
- **Paraglide:** Excellent type safety, tree-shakeable, actively developed by the inlang team.
  Smaller community than next-intl. Good choice if Rocco wants maximum type safety and
  smallest bundle. Second recommendation.

### Scope

- **Admin panel:** Minimal i18n needed (Rocco operates it, probably in Italian only). Add
  basic IT/EN for the admin to unblock future staff from other countries.
- **Public website:** Full IT/DE/EN/FR with localized slugs for SEO
  (`/it/camere/`, `/de/zimmer/`, `/en/rooms/`, `/fr/chambres/`)

---

## 12. CHARTS — Recharts

**Verdict: Recharts for the statistics dashboard.**

LibertyGest's KPI dashboard needs: line charts (RevPAR trend), bar charts (occupancy by month),
pie/donut charts (room type breakdown), area charts (revenue vs last year). These are all
low-to-medium density datasets (30-365 data points max).

### Why Recharts

- Native React components, no external library wrapper
- SVG-based — perfect fidelity at any screen size/zoom level
- Excellent TypeScript support
- Composable: `<AreaChart><XAxis><YAxis><Tooltip><Legend>` — no magic
- shadcn/ui ships chart primitives built on Recharts
- Sufficient for hotel KPI volumes (never >1000 data points in a chart)

### When Apache ECharts would be needed

ECharts is the right choice when you need: 100,000+ data point visualizations, maps/geo
charts, WebGL acceleration, or 3D charts. LibertyGest needs none of these. ECharts is
heavier and the React wrapper (`echarts-for-react`) adds another abstraction layer.

**Chart.js** is canvas-based — faster for large datasets but SVG is better for hotel
dashboards where the user zooms in and exports to PDF.

---

## 13. DATABASE HOSTING — Neon (serverless PostgreSQL)

**Verdict: Neon over Supabase, self-hosted, or PlanetScale.**

After Databricks acquisition (2025), Neon dropped prices significantly:
- Storage: $0.35/GB-month (down from $1.75)
- Free tier: 100 compute-unit hours/month (doubled)
- Auto-suspend after 5min idle = near-zero cost for development environments

**Why not Supabase:** Supabase bundles auth, storage, edge functions, realtime. LibertyGest
already handles each of those separately (Better Auth, S3/R2, Next.js Route Handlers,
WebSockets). You'd be paying for platform features you ignore.

**Why not self-hosted Postgres initially:** Operational overhead (backups, HA, upgrades)
without benefit until scale justifies it. Neon handles all of this.

**Migration path:** Neon uses standard PostgreSQL. If LibertyGest outgrows Neon pricing at
scale, migrating to self-hosted Postgres is a `pg_dump` and DNS change.

---

## 14. COMPLETE RECOMMENDED STACK SUMMARY

```
Monorepo:         Turborepo
Framework:        Next.js 15 (App Router) — admin + public website as separate apps
Language:         TypeScript 5 (strict mode)

UI:
  Base:           shadcn/ui + Tailwind CSS 4
  Calendar:       FullCalendar Premium (resource-timeline) OR Mobiscroll ($995 one-time)
  Data Grid:      TanStack Table v8 (via shadcn DataTable)
  Charts:         Recharts (shadcn/ui chart primitives)
  Forms:          React Hook Form v7 + Zod v3

State:
  Client:         Zustand v5
  Server:         TanStack Query v5 (React Query)

API:
  Internal:       tRPC v11 (admin operations)
  External:       REST Route Handlers (OpenClaw AI, channel managers, webhooks)

Database:
  Engine:         PostgreSQL 16
  Hosting:        Neon (serverless, auto-suspend)
  ORM:            Drizzle ORM
  Migrations:     Drizzle Kit (SQL migration files)

Auth:             Better Auth (RBAC, organizations, database sessions)

i18n:             next-intl (admin: IT/EN, public: IT/DE/EN/FR)

Real-time:        WebSockets (Socket.io or native WS) for live room status
Cache:            Upstash Redis (serverless Redis — pairs with Neon)
File Storage:     Cloudflare R2 (S3-compatible, cheaper than AWS S3 egress)
Search:           Meilisearch (guest search, reservation lookup)
Email:            Resend (transactional: confirmations, invoices)
Payments:         Stripe + DATATRANS (European market)
AI (OpenClaw):    Vercel AI SDK + OpenAI API (tool-calling, function-based agent)
```

---

## 15. DECISIONS THAT NEED DEEPER RESEARCH

### A. FullCalendar vs Mobiscroll for the room calendar

This is the most consequential UI decision and requires a proof-of-concept before committing.
Both are commercial. Key questions to prototype:

1. Can FullCalendar resource-timeline render 50 rooms x 90 days smoothly without virtualization?
2. Does Mobiscroll's property-booking-calendar demo match LibertyGest's visual requirements?
3. Which handles WebSocket-driven real-time updates more cleanly?

**Action:** Build a 2-hour prototype with real hotel data in both before committing.

### B. WebSocket real-time architecture

The dashboard requires live room status (housekeeping updates, new arrivals). Next.js Route
Handlers are stateless — WebSockets need a separate server process or Upstash QStash/webhooks.

Options:
- Socket.io server as a separate Next.js custom server (complicates deployment)
- Upstash Redis Pub/Sub with polling (simpler but not instant)
- Partykit (WebSocket-first hosting, Cloudflare Workers)
- Server-Sent Events (SSE) from Next.js Route Handlers (simpler than WS, unidirectional)

For a hotel PMS, SSE (server-sent events) may be sufficient — the dashboard only needs to
receive updates, not send them over WebSocket. Investigate SSE as the simplest path.

### C. Multi-property architecture

The PLAN.md mentions multi-property support. This affects the database schema significantly:
- Every table needs a `property_id` column + row-level security
- Drizzle doesn't have built-in RLS (Prisma has ZenStack extension for this)
- Better Auth organizations map to properties — validate this works for the schema

### D. OpenClaw AI agent protocol

The AI agent (OpenClaw) needs a formal tool schema (OpenAI function calling format). Research
needed on which REST endpoints to expose, what the input/output schemas look like, and how
to prevent the agent from making destructive operations (e.g., mass-cancel reservations).

### E. PDF generation (invoices, registration cards)

Italian fiscal law requires specific invoice formats. Research needed:
- `@react-pdf/renderer` vs Puppeteer headless Chrome vs `pdfkit`
- Italian fiscal requirements (fattura elettronica integration?)

---

## 16. PITFALLS SPECIFIC TO HOTEL PMS

### P1 — Date/timezone handling (CRITICAL)

Hotels operate in local time. Guests book in their timezone. The database must store all
datetimes in UTC but display in the hotel's local timezone. Using JavaScript `Date` objects
naively causes off-by-one-day errors on check-in/out dates.

**Prevention:** Use `date-fns-tz` or `Temporal` (TC39, available via polyfill). Store all
dates as `TIMESTAMPTZ` in PostgreSQL. Never use `new Date()` for business logic — always
pass explicit timezone context.

### P2 — Double booking race conditions

Two receptionists booking the same room simultaneously. Optimistic locking at the ORM level
is not enough.

**Prevention:** Use PostgreSQL advisory locks or `SELECT ... FOR UPDATE` in the booking
transaction. Drizzle supports raw SQL for this. Implement at the database layer, not
application layer.

### P3 — FullCalendar/Mobiscroll license scope

Commercial calendar licenses typically restrict to a single project/domain. Multi-property
LibertyGest deployed on multiple domains may require additional licenses.

**Prevention:** Check license terms for multi-domain/SaaS use before purchasing.

### P4 — Tailwind CSS 4 shadcn/ui compatibility

shadcn/ui components are being migrated to Tailwind v4. As of April 2026, not all third-party
shadcn/ui components from community registries have been updated. Mixing v3 and v4 patterns
causes styling conflicts.

**Prevention:** Use only shadcn/ui official components until the ecosystem stabilizes. Check
v4 migration status before installing community components.

### P5 — Drizzle complex migrations on live data

Schema migrations on a live hotel PMS carry risk (e.g., adding NOT NULL column to reservations
table with 10,000 existing rows). Drizzle Kit generates SQL that may lock the table.

**Prevention:** Use `pg_advisory_lock`-free migration strategies. For large tables, use
`ADD COLUMN nullable` then backfill, then `SET NOT NULL`. Review all generated Drizzle
migration SQL before running in production.

### P6 — i18n SEO for the public website

Google must index localized URLs, not JavaScript-rendered text. With next-intl + Next.js
App Router's static rendering, this works correctly — but only if `generateStaticParams` is
correctly implemented for all dynamic routes.

**Prevention:** Test localized SEO with Google's URL Inspection Tool before launch. Use
`hreflang` tags (next-intl generates these automatically with correct config).

---

## Sources

- [The Real Talk: SvelteKit vs Next.js vs Nuxt.js in 2026](https://dev.to/bytelearn_dev/the-real-talk-sveltekit-vs-nextjs-vs-nuxtjs-in-2026-3clg)
- [Next.js vs Nuxt vs SvelteKit: Choosing the Right Framework for SaaS Development](https://supastarter.dev/blog/nextjs-vs-nuxt-vs-sveltekit-for-saas-development)
- [Mantine vs shadcn/ui: Complete Developer Comparison 2026](https://saasindie.com/blog/mantine-vs-shadcn-ui-comparison)
- [shadcn/ui vs MUI vs Ant Design: Which React UI Library Should You Choose in 2026?](https://adminlte.io/blog/shadcn-ui-vs-mui-vs-ant-design/)
- [Drizzle vs Prisma ORM in 2026: A Practical Comparison](https://makerkit.dev/blog/tutorials/drizzle-vs-prisma)
- [Drizzle vs Prisma: Choosing the Right TypeScript ORM in 2026](https://medium.com/@codabu/drizzle-vs-prisma-choosing-the-right-typescript-orm-in-2026-deep-dive-63abb6aa882b)
- [Better Auth vs Lucia vs NextAuth (2026)](https://trybuildpilot.com/625-better-auth-vs-lucia-vs-nextauth-2026)
- [Best i18n Libraries for Next.js, React in 2026](https://dev.to/erayg/best-i18n-libraries-for-nextjs-react-react-native-in-2026-honest-comparison-3m8f)
- [Top 5 React Gantt Chart Libraries Compared (2026)](https://svar.dev/blog/top-react-gantt-charts/)
- [Best JavaScript Gantt Chart Libraries 2025-2026](https://dhtmlx.com/blog/top-8-javascript-gantt-chart-libraries-2026/)
- [Mobiscroll React Pricing](https://mobiscroll.com/pricing)
- [FullCalendar React Resource Timeline](https://fullcalendar.io/docs/timeline-view)
- [State Management in 2026: Zustand vs Jotai vs Redux Toolkit](https://dev.to/jsgurujobs/state-management-in-2026-zustand-vs-jotai-vs-redux-toolkit-vs-signals-2gge)
- [TanStack in 2026: From Query to Full-Stack](https://www.codewithseb.com/blog/tanstack-ecosystem-complete-guide-2026)
- [Turborepo vs Nx 2026](https://www.pkgpulse.com/blog/turborepo-vs-nx-monorepo-2026)
- [oRPC vs tRPC v11 vs Hono RPC (2026)](https://www.pkgpulse.com/blog/orpc-vs-trpc-vs-hono-rpc-type-safe-apis-2026)
- [Neon vs Supabase vs PlanetScale: Managed Postgres for Next.js in 2026](https://dev.to/whoffagents/neon-vs-supabase-vs-planetscale-managed-postgres-for-nextjs-in-2026-2el4)
- [Choosing a React Form Library in 2026](https://formisch.dev/blog/react-form-library-comparison/)
- [ECharts vs. Recharts vs. Chart.js](https://theaverageprogrammer.hashnode.dev/choosing-the-right-charting-library-for-your-nextjs-dashboard)
- [Best React Data Grid Libraries 2026](https://www.syncfusion.com/blogs/post/top-react-data-grid-libraries)
