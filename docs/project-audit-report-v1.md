# Carvo Project Audit Report v1

## Scope

Audit requested for:

1. Whether the booking form saves data into Supabase.
2. Which tables are being used.
3. Whether `/command-center` uses mock data or real Supabase queries.
4. Replacement of mock data with real Supabase-backed data where the current schema supports it.
5. Status report: completed, partially completed, and missing.

## Findings

### 1. Booking form save path

Status: Completed.

The Putra Auto Rental booking form posts to a server action:

- `app/putra-auto-rental/booking-request-form.tsx`
- `app/putra-auto-rental/actions.ts`

The server action validates:

- Vehicle.
- Pickup location.
- Pickup datetime.
- Return datetime.
- Passenger count.
- Customer name.
- Customer email.
- Customer phone.
- Optional flight number.
- Optional AI trip intent.

It then inserts a `requested` row into Supabase `bookings`.

Note: No live browser submission was performed during this audit to avoid creating fake customer data.

### 2. Tables currently used

#### Putra storefront read path

Implemented in `lib/carvo/storefront.ts`.

Tables:

- `tenants`
- `tenant_brands`
- `fleet_locations`
- `vehicles`

#### Booking request write path

Implemented in `app/putra-auto-rental/actions.ts`.

Tables:

- `tenants`
- `vehicles`
- `fleet_locations`
- `bookings`

#### Command center read path

Implemented in `lib/carvo/command-center.ts`.

Tables:

- `tenants`
- `vehicles`
- `fleet_locations`
- `bookings`
- `activity_events`

## Command Center Audit

### Previous state

Status before audit: Mock data.

`/command-center` previously used hard-coded arrays for:

- KPI metrics.
- Fleet radar.
- Activity feed.
- Airport pickups.
- AI advisor cards.
- Runner leaderboard.
- Fleet heatmap.

### Current state

Status after audit: Supabase-backed where schema and RLS support it.

`/command-center` now calls:

- `getPutraCommandCenter()` from `lib/carvo/command-center.ts`

The page is now dynamic server-rendered and reads Supabase at request time.

Real Supabase-backed sections:

- Tenant name.
- Visible fleet counts.
- Fleet radar by vehicle status.
- Visible fleet heatmap by pickup location.
- Booking KPIs when tenant RLS permits access.
- Today's airport booking operations when tenant RLS permits access.
- Activity events when tenant RLS permits access.

Non-real sections removed or converted:

- Fake runner leaderboard was replaced with an explicit missing-data state.
- Fake AI advisor cards were replaced with derived business signals from live fleet/booking visibility.
- Fake alerts were replaced with `activity_events` query results or an RLS-aware empty state.

## Completed

- Architecture handbook exists.
- Next.js app scaffold exists.
- Supabase SSR clients exist and are typed.
- Supabase migration has been applied remotely.
- Supabase database types were regenerated from the live remote schema.
- Putra storefront reads live Supabase tenant/fleet data with a preview fallback.
- Booking form writes to Supabase `bookings`.
- `/command-center` no longer relies on hard-coded operational arrays.
- `/command-center` reads live Supabase data where the current schema and RLS allow it.
- Lint and production build pass after the audit changes.

## Partially Completed

- `/command-center` has live data wiring, but private booking and activity rows require tenant authentication because current RLS correctly blocks anonymous reads.
- Revenue, active rentals, upcoming returns, and airport operations are implemented from `bookings`, but they show locked/empty states until tenant auth is implemented.
- Activity feed is implemented from `activity_events`, but booking submission does not yet create an activity event because current RLS does not allow anonymous event insertion.
- Fleet heatmap is real but basic: it uses fleet counts by pickup location, not geographic coordinates or demand hotspots.
- Business signals are derived from current fleet/booking visibility, not a true AI advisor yet.

## Missing

- Supabase Auth UI.
- Tenant member login.
- `/command-center` route protection.
- Tenant membership seed/invite flow.
- Booking-created activity event automation.
- Runner/staff tables and runner task workflow.
- Maintenance, inspection, and profit-per-car data models in the implemented schema.
- Real revenue recognition and payment integration.
- Real flight tracking integration.
- True dynamic pricing AI and Carvo Copilot.
- Marketplace search across multiple tenants.

## Recommended Next Technical Step

Implement tenant authentication and command-center protection:

1. Add Supabase login for tenant staff.
2. Seed or invite a Putra tenant owner membership.
3. Protect `/command-center`.
4. Once authenticated, the existing command-center queries can display private `bookings` and `activity_events` data under current RLS.

