# Carvo Architecture Handbook v1

## 1. Product Intent

Carvo is a multi-tenant, white-label mobility SaaS platform for car rental operators and their customers. Tenant #1 is Putra Auto Rental, but the system must be designed from day one as a platform that can support many independent rental companies, marketplace discovery, corporate accounts, mobile apps, and future mobility modules.

Carvo should not feel like a generic rental admin panel. It should feel like a premium, intelligent mobility operating system that combines:

- Airbnb-style discovery and trust.
- Booking.com-style inventory comparison and conversion.
- Uber-style real-time operations and handover visibility.
- Stripe-style business dashboards and financial clarity.
- Tesla-style premium product presentation.
- ChatGPT-style conversational intelligence.

Primary technical stack:

- Frontend: Next.js, React, TypeScript, PWA-first.
- Backend: Supabase Postgres, Supabase Auth, Supabase Storage, Supabase Realtime, Edge Functions where useful.
- Architecture: Modular monolith with clear bounded contexts.
- Tenancy: Tenant-isolated data model from day one.

Primary design theme:

- Premium black.
- White.
- Amber gold accents.
- Aviation-inspired information hierarchy.
- Mobile-first.
- Enterprise-grade performance and trust.

## 2. Architectural Principles

1. Multi-tenant from the first table.
   - Every tenant-owned operational record carries `tenant_id`.
   - Public marketplace records expose only approved, marketplace-safe data.

2. Modular monolith first, distributed later.
   - Keep one deployable application.
   - Separate modules by domain boundaries, service interfaces, events, and database ownership conventions.
   - Avoid early microservices until operational pressure requires extraction.

3. Marketplace-ready without forcing marketplace behavior on every tenant.
   - A tenant can operate as private white-label storefront only.
   - A tenant can opt into Carvo marketplace discovery later.
   - Marketplace ranking and trust are platform-level concerns, not tenant-owned concerns.

4. Mobile and PWA are first-class channels.
   - Booking, pickup, inspection, runner assignment, and support flows must work well on mobile.
   - Customer, runner, owner, and corporate user experiences must be API-aligned.

5. Intelligence is a product surface, not an add-on.
   - AI search, pricing recommendations, business advice, fleet health, and support should be modeled as platform capabilities with audit trails.

6. Premium UX is part of architecture.
   - The product should be fast, visual, real-time, and confidence-building.
   - Internal operations should be command-center driven instead of table-first CRUD.

## 3. User Types and Access Model

### 3.1 Platform Roles

- Platform Owner: Carvo internal operator with cross-tenant visibility.
- Platform Support: Carvo support user with scoped tenant access for troubleshooting.
- Marketplace Operations: Manages verification, ranking rules, marketplace campaigns, and disputes.

### 3.2 Tenant Roles

- Tenant Owner: Owns tenant account, billing, configuration, and all business data.
- Operations Manager: Manages bookings, fleet status, runners, handovers, and incidents.
- Fleet Manager: Manages vehicles, maintenance, inspections, documents, and availability.
- Finance Manager: Manages payments, invoices, expenses, profit per car, and reporting.
- Runner: Handles delivery, pickup, handover, inspection, and customer updates.
- Support Agent: Handles customer support and booking changes.

### 3.3 Customer Roles

- Guest Customer: Can search and begin booking before account creation where appropriate.
- Registered Customer: Can book, review, manage profile, and join membership tiers.
- Corporate Admin: Manages company account, employees, policies, and monthly billing.
- Corporate Employee: Books within company policy and billing rules.

## 4. Bounded Contexts

The modular monolith should be organized around these bounded contexts. Each context should expose application services to the UI and other contexts, while keeping its domain rules local.

### 4.1 Identity and Access

Responsibilities:

- Supabase Auth integration.
- User profiles.
- Tenant membership.
- Role assignment.
- Corporate account membership.
- Platform support access.

Key concepts:

- User.
- Tenant membership.
- Role.
- Permission.
- Corporate membership.

Notes:

- Supabase Auth owns authentication identity.
- Application tables own business profiles, tenant membership, and authorization metadata.

### 4.2 Tenant and White Label

Responsibilities:

- Tenant account.
- Brand profile.
- Custom domain.
- Theme tokens.
- Storefront configuration.
- Marketplace participation settings.
- Tenant onboarding and verification status.

Key concepts:

- Tenant.
- Tenant brand.
- Tenant domain.
- Marketplace profile.
- Verification badge.

Notes:

- Putra Auto Rental is tenant #1, not a special case in code.
- White-label storefront configuration must be data-driven.

### 4.3 Fleet Catalog

Responsibilities:

- Vehicle records.
- Vehicle classes and models.
- Images.
- Features.
- Documents.
- Fleet status.
- Location assignment.
- Marketplace display readiness.

Key concepts:

- Vehicle.
- Vehicle class.
- Vehicle media.
- Vehicle document.
- Vehicle feature.
- Fleet location.

Notes:

- A vehicle is operational inventory and must stay tenant-isolated.
- Marketplace projections can expose a public listing view.

### 4.4 Availability and Inventory

Responsibilities:

- Availability calendar.
- Holds.
- Booking conflicts.
- Location-based inventory.
- Live fleet availability.
- Fleet status transitions.

Key concepts:

- Inventory unit.
- Availability hold.
- Availability block.
- Fleet status event.

Notes:

- Availability should be treated as a high-integrity domain.
- Booking confirmation must not double-book vehicles.

### 4.5 Booking and Rental Lifecycle

Responsibilities:

- Search intent.
- Quotes.
- Booking creation.
- Rental agreement.
- Pickup.
- Active rental.
- Return.
- Extension.
- Cancellation.
- No-show.

Key concepts:

- Booking.
- Rental.
- Quote.
- Rental agreement.
- Handover.
- Return.

Lifecycle:

1. Search intent.
2. Quote generated.
3. Availability hold.
4. Booking confirmed.
5. Runner assigned.
6. Vehicle handed over.
7. Rental active.
8. Vehicle returned.
9. Inspection completed.
10. Rental closed.

### 4.6 Airport Operations

Responsibilities:

- Flight-aware booking.
- Flight status tracking.
- ETA updates.
- Airport pickup location rules.
- Runner assignment.
- Delay handling.

Key concepts:

- Flight itinerary.
- Airport handover plan.
- Pickup zone.
- Runner dispatch.

Initial locations:

- KLIA1 Door 1.
- KLIA2 Door 3.
- Subang.

Future locations:

- Johor.
- Sabah.
- Sarawak.

### 4.7 Pricing, Promotions, and Revenue

Responsibilities:

- Rate plans.
- Dynamic pricing recommendations.
- Promotions.
- Coupons.
- Seasonal campaigns.
- Long-term rental pricing.
- Marketplace commission models.

Key concepts:

- Rate plan.
- Price quote.
- Promotion.
- Pricing recommendation.
- Commission rule.

Promotion examples:

- Last Minute Deals.
- Weekend Specials.
- Holiday Campaigns.
- Airport Specials.

### 4.8 Payments, Billing, and Finance

Responsibilities:

- Payment intent tracking.
- Deposit tracking.
- Invoices.
- Refunds.
- Tenant subscription billing.
- Corporate monthly billing.
- Profit per car.
- Expense tracking.

Key concepts:

- Payment.
- Invoice.
- Refund.
- Deposit.
- Expense.
- Vehicle profit report.

Notes:

- Payment provider integration should be abstracted.
- Marketplace settlement must be platform-owned.

### 4.9 Maintenance and Inspection

Responsibilities:

- Service schedules.
- Tyres.
- Insurance.
- Road tax.
- Maintenance alerts.
- Damage inspection.
- AI-assisted photo review.

Key concepts:

- Inspection.
- Damage report.
- Maintenance plan.
- Service event.
- Compliance document.

Notes:

- AI damage detection should assist, not replace, human confirmation.
- Inspection evidence must be immutable once signed.

### 4.10 Staff Operations

Responsibilities:

- Runner assignment.
- Task management.
- Leaderboards.
- On-time performance.
- Customer ratings.
- Staff availability.

Key concepts:

- Staff member.
- Runner task.
- Assignment.
- Performance metric.

Gamification metrics:

- Deliveries.
- On-time handovers.
- Customer ratings.
- Issue-free returns.

### 4.11 Customer, Loyalty, and Reviews

Responsibilities:

- Customer profile.
- Membership tier.
- Reviews.
- Trust signals.
- Preferences.
- Support history.

Key concepts:

- Customer profile.
- Membership account.
- Loyalty transaction.
- Review.

Membership tiers:

- Silver.
- Gold.
- Platinum.
- Corporate.

Benefits:

- Free delivery.
- Priority support.
- Upgrades.
- Loyalty rewards.

### 4.12 Corporate Mobility

Responsibilities:

- Corporate account.
- Employee management.
- Monthly billing.
- Booking policy.
- Fleet allocation.
- Usage reporting.

Key concepts:

- Corporate account.
- Corporate employee.
- Mobility policy.
- Monthly statement.

### 4.13 Marketplace and Trust

Responsibilities:

- Tenant storefronts.
- Marketplace search.
- Ranking.
- Verification badges.
- Reviews aggregation.
- Demand hotspots.
- Trust indicators.
- Cross-tenant promotions.

Key concepts:

- Marketplace listing.
- Storefront.
- Verification status.
- Marketplace ranking signal.
- Demand signal.

Badges:

- Top Rated.
- Fast Response.
- Most Booked.
- Verified Operator.

### 4.14 Intelligence and Copilot

Responsibilities:

- AI search.
- Travel assistant.
- Business advisor.
- Dynamic pricing recommendations.
- Fleet maintenance prediction.
- Natural language analytics.

Key concepts:

- AI conversation.
- AI recommendation.
- Recommendation action.
- Insight.
- Forecast.

Examples:

- "I am travelling with 6 people from KLIA for 3 days under RM500."
- "Increase Bezza price by RM20."
- "Occupancy expected to reach 90%."
- "Promote Alza inventory."
- "Which car makes the most profit?"

### 4.15 Analytics and Reporting

Responsibilities:

- Tenant KPIs.
- Marketplace KPIs.
- Funnel analytics.
- Vehicle profitability.
- Occupancy.
- Forecasting.
- Trust metrics.

Key concepts:

- Metric snapshot.
- Event.
- Dashboard card.
- Forecast.

## 5. Aggregate Roots

### 5.1 Tenant Aggregate

Root: Tenant.

Entities:

- Tenant brand profile.
- Tenant settings.
- Tenant domain.
- Marketplace participation.
- Tenant verification.

Invariants:

- Tenant slug must be globally unique.
- Custom domain must map to one active tenant.
- Marketplace visibility requires verification and marketplace opt-in.

### 5.2 User Profile Aggregate

Root: User profile.

Entities:

- Tenant memberships.
- Corporate memberships.
- Role assignments.

Invariants:

- A user can belong to multiple tenants.
- A user can have different roles in different tenants.
- Platform roles are separate from tenant roles.

### 5.3 Vehicle Aggregate

Root: Vehicle.

Entities:

- Vehicle media.
- Vehicle documents.
- Vehicle features.
- Vehicle status events.
- Vehicle compliance records.

Invariants:

- Vehicle belongs to exactly one tenant.
- Operational status changes must be evented.
- Vehicle cannot be marketplace-listed until required media and compliance fields are complete.

### 5.4 Availability Aggregate

Root: Availability calendar or inventory unit.

Entities:

- Availability holds.
- Availability blocks.
- Location availability.

Invariants:

- Confirmed bookings cannot overlap for the same vehicle.
- Holds expire automatically.
- Maintenance blocks override bookable inventory.

### 5.5 Booking Aggregate

Root: Booking.

Entities:

- Quote.
- Booking line items.
- Customer details.
- Flight itinerary.
- Payment references.
- Cancellation record.

Invariants:

- Booking must belong to one tenant, even when discovered through the marketplace.
- Confirmed booking requires a valid quote, customer, and availability hold.
- Booking status transitions must be explicit and auditable.

### 5.6 Rental Aggregate

Root: Rental.

Entities:

- Handover.
- Return.
- Inspection.
- Agreement.
- Extension.

Invariants:

- Rental starts from a confirmed booking.
- Handover requires vehicle, customer, and staff confirmation.
- Rental cannot close until return inspection is completed or waived by an authorized role.

### 5.7 Payment Aggregate

Root: Payment.

Entities:

- Payment attempts.
- Refunds.
- Deposits.
- Invoice references.

Invariants:

- Financial events must be append-only.
- Refunds cannot exceed captured amount.
- Marketplace settlement state must not be tenant-editable.

### 5.8 Inspection Aggregate

Root: Inspection.

Entities:

- Photos.
- Damage findings.
- AI findings.
- Human confirmation.
- Signatures.

Invariants:

- Signed inspections are immutable except through corrective adjustment records.
- AI findings must be marked as machine-generated until confirmed.

### 5.9 Maintenance Aggregate

Root: Maintenance plan.

Entities:

- Service schedules.
- Maintenance events.
- Tyre records.
- Insurance record.
- Road tax record.

Invariants:

- Expired compliance records generate alerts.
- Vehicle should become unavailable when critical maintenance is overdue.

### 5.10 Corporate Account Aggregate

Root: Corporate account.

Entities:

- Employees.
- Billing settings.
- Booking policies.
- Monthly statements.

Invariants:

- Employee bookings must follow corporate policy unless overridden.
- Corporate billing records are immutable after statement close.

### 5.11 Marketplace Storefront Aggregate

Root: Storefront.

Entities:

- Public tenant profile.
- Badges.
- Marketplace promotions.
- Review summary.
- Public fleet projection.

Invariants:

- Storefront can only publish marketplace-approved data.
- Review scores are computed, not manually edited by tenant users.

### 5.12 Recommendation Aggregate

Root: AI recommendation.

Entities:

- Recommendation evidence.
- Suggested action.
- Acceptance or dismissal.
- Result measurement.

Invariants:

- AI actions that change business state require authorized human approval unless explicitly configured for automation.
- Recommendation history is retained for audit and learning.

## 6. Tenant Model

### 6.1 Tenant Identity

Each tenant is represented by a platform-owned tenant record:

- `id`: UUID primary key.
- `slug`: stable unique identifier.
- `name`: legal or operating name.
- `status`: onboarding, active, suspended, archived.
- `primary_domain`: optional custom domain.
- `marketplace_enabled`: tenant opt-in flag.
- `created_at`, `updated_at`.

Tenant #1:

- Name: Putra Auto Rental.
- Slug: `putra-auto-rental`.
- Initial mode: white-label storefront plus tenant operations.
- Future mode: marketplace participant when verified.

### 6.2 Tenant Isolation

Tenant-owned tables must include:

- `tenant_id uuid not null`.
- Foreign key to `tenants(id)`.
- Index beginning with `tenant_id`.
- RLS policy that restricts tenant users to memberships for that tenant.

Examples:

- `vehicles`.
- `bookings`.
- `rentals`.
- `inspections`.
- `runner_tasks`.
- `expenses`.
- `rate_plans`.

### 6.3 Tenant Membership

User-to-tenant access is modeled through `tenant_memberships`:

- `tenant_id`.
- `user_id`.
- `role`.
- `status`.

This allows:

- One user to manage multiple rental companies.
- Platform support to be modeled separately from direct tenant membership.
- Future agency or franchise structures.

### 6.4 White Label Model

White-label configuration should be data-driven:

- Brand name.
- Logo.
- Theme tokens.
- Hero assets.
- Contact channels.
- Storefront copy.
- Domain mapping.
- SEO metadata.
- Supported pickup locations.
- Payment rules.

The same application renders different tenant storefronts by resolving:

1. Hostname or route prefix.
2. Tenant record.
3. Tenant brand settings.
4. Public inventory projection.

### 6.5 Tenant Data Classes

Classify data before writing RLS policies:

1. Tenant private data.
   - Fleet costs, profit, staff metrics, internal notes.

2. Tenant operational data.
   - Bookings, rentals, inspections, runner tasks.

3. Tenant public storefront data.
   - Public fleet listing, brand profile, approved promotions.

4. Platform marketplace data.
   - Ranking, aggregated demand, verification badges.

5. Customer-owned data.
   - Profiles, saved trips, reviews, loyalty.

## 7. Database Architecture

### 7.1 Database Style

Use Supabase Postgres as the source of truth.

Recommended approach:

- Normalize transactional data.
- Use views or materialized views for marketplace/public projections.
- Use event tables for audit trails and real-time feeds.
- Use JSONB only for flexible metadata where schema churn is high.
- Prefer explicit columns for data used in filtering, sorting, RLS, or reporting.

### 7.2 Schema Organization

Start with a single application schema unless Supabase conventions require otherwise:

- `public.tenants`.
- `public.tenant_memberships`.
- `public.vehicles`.
- `public.bookings`.
- `public.rentals`.

Use naming and module ownership in code to preserve boundaries before introducing multiple Postgres schemas.

Future schema split candidates:

- `marketplace`.
- `analytics`.
- `ai`.
- `billing`.

### 7.3 Core Tables

Platform and tenancy:

- `tenants`.
- `tenant_brands`.
- `tenant_domains`.
- `tenant_memberships`.
- `platform_roles`.

Fleet:

- `vehicles`.
- `vehicle_models`.
- `vehicle_media`.
- `vehicle_features`.
- `vehicle_documents`.
- `fleet_locations`.
- `vehicle_status_events`.

Availability:

- `availability_holds`.
- `availability_blocks`.
- `booking_inventory_assignments`.

Booking and rentals:

- `customers`.
- `bookings`.
- `booking_quotes`.
- `booking_line_items`.
- `flight_itineraries`.
- `rentals`.
- `handovers`.
- `returns`.
- `rental_agreements`.

Operations:

- `staff_profiles`.
- `runner_tasks`.
- `activity_events`.
- `alerts`.

Maintenance and inspection:

- `inspections`.
- `inspection_photos`.
- `damage_findings`.
- `maintenance_plans`.
- `maintenance_events`.
- `compliance_documents`.

Finance:

- `payments`.
- `payment_attempts`.
- `refunds`.
- `invoices`.
- `expenses`.
- `vehicle_profit_snapshots`.

Marketplace:

- `storefronts`.
- `marketplace_listings`.
- `marketplace_badges`.
- `reviews`.
- `promotions`.
- `demand_signals`.

Intelligence:

- `ai_conversations`.
- `ai_messages`.
- `ai_recommendations`.
- `forecast_snapshots`.
- `pricing_recommendations`.

Corporate:

- `corporate_accounts`.
- `corporate_memberships`.
- `corporate_policies`.
- `corporate_statements`.

### 7.4 Required Column Conventions

Tenant-owned tables:

- `id uuid primary key`.
- `tenant_id uuid not null references tenants(id)`.
- `created_at timestamptz not null default now()`.
- `updated_at timestamptz not null default now()`.
- `created_by uuid references auth.users(id)` where useful.
- `updated_by uuid references auth.users(id)` where useful.

Audit or event tables:

- Append-only by default.
- Include actor information.
- Include source: user, system, ai, integration, webhook.
- Include event type and payload.

Marketplace projection tables:

- Include source tenant.
- Include publish status.
- Include last indexed timestamp.
- Avoid private operational fields.

### 7.5 Index Strategy

Default indexes:

- `(tenant_id, id)` for tenant-owned tables.
- `(tenant_id, status)` for operational queues.
- `(tenant_id, created_at desc)` for activity feeds.
- `(tenant_id, starts_at, ends_at)` for booking and availability windows.
- Geospatial indexes for locations when PostGIS is enabled.
- Search indexes for marketplace discovery.

Marketplace indexes:

- Location.
- Date availability.
- Vehicle class.
- Price.
- Rating.
- Badge.
- Promotion status.

### 7.6 Realtime Strategy

Use Supabase Realtime for:

- Tenant command center.
- Live activity feed.
- Fleet radar.
- Runner task updates.
- Booking status changes.
- Flight delay alerts.

Do not stream every table by default. Publish domain events to focused tables or channels:

- `activity_events`.
- `alerts`.
- `runner_tasks`.
- `vehicle_status_events`.

## 8. RLS Strategy

### 8.1 RLS Principles

1. RLS is mandatory for tenant-owned tables.
2. Application code must pass through Supabase with user context for user-facing actions.
3. Service role access is reserved for trusted server-side jobs, webhooks, and migrations.
4. Public marketplace views must expose only approved public data.
5. RLS helpers should be centralized in SQL functions to reduce policy duplication.

### 8.2 Access Helper Functions

Recommended database helper functions:

- `auth_user_id()`: returns authenticated user id.
- `is_platform_admin()`: checks platform role.
- `is_tenant_member(tenant_id)`: checks active tenant membership.
- `has_tenant_role(tenant_id, role[])`: checks role.
- `can_manage_booking(tenant_id)`: booking operations permission.
- `can_manage_fleet(tenant_id)`: fleet operations permission.
- `can_view_finance(tenant_id)`: finance permission.

These helpers must be stable, security definer where appropriate, and carefully reviewed.

### 8.3 Policy Classes

Tenant private read:

- Tenant owners and authorized tenant roles can read.
- Platform admins can read.
- Customers cannot read.

Tenant operational write:

- Authorized tenant roles can write.
- Runners can update only assigned operational fields.
- Platform admins can perform support actions with audit logs.

Customer booking read:

- Customer can read their own booking.
- Tenant can read bookings for its tenant.
- Corporate admins can read bookings for their corporate account.

Marketplace public read:

- Anonymous users can read approved marketplace projections only.
- Anonymous users cannot read tenant private tables directly.

Finance:

- Tenant owner and finance manager can read.
- Platform support access should be restricted and audited.

AI recommendations:

- Tenant users can read recommendations for their tenant.
- Only authorized users can accept recommendations that mutate business state.

### 8.4 Storage RLS

Storage buckets:

- `tenant-brand-assets`: public or CDN-safe brand assets.
- `vehicle-media`: public approved images, private raw uploads.
- `inspection-evidence`: private, signed URL access only.
- `documents`: private compliance and agreement documents.

Rules:

- Public storefront media must be explicitly marked public.
- Inspection and agreement files must never be public.
- Upload paths should include `tenant_id`.
- Storage policies must verify tenant membership.

### 8.5 Service Role Rules

Use service role only for:

- Server-side webhooks.
- Scheduled maintenance jobs.
- Marketplace indexing.
- AI processing jobs.
- Payment provider callbacks.

Never expose service role keys to the browser.

## 9. Future Marketplace Strategy

### 9.1 Phases

Phase 1: White-label SaaS foundation.

- Tenant operations.
- Tenant storefront.
- Putra Auto Rental initial launch.
- Public listing pages for one tenant.

Phase 2: Marketplace opt-in.

- Multiple tenant storefronts.
- Marketplace search page.
- Public listing projections.
- Reviews and badges.
- Tenant verification workflow.

Phase 3: Marketplace intelligence.

- Ranking signals.
- Demand heatmaps.
- Dynamic promotions.
- AI search.
- Personalization.
- Destination-led discovery.

Phase 4: Mobility platform expansion.

- Parking.
- Workshop.
- Car wash.
- Airport transfer.
- Tours.
- Used car marketplace.
- Insurance.
- Financing.

### 9.2 Marketplace Data Boundary

Do not query tenant private tables directly for public marketplace pages. Instead, publish safe projections:

- Approved vehicle summary.
- Approved vehicle images.
- Public rate range.
- Availability summary.
- Tenant rating.
- Tenant response performance.
- Promotions.
- Verification badges.

This allows tenant data to remain operationally private while marketplace pages stay fast, cacheable, and safe.

### 9.3 Ranking Signals

Potential ranking inputs:

- Availability match.
- Price competitiveness.
- Response speed.
- Booking conversion.
- Review score.
- Handover success rate.
- Cancellation rate.
- Verification status.
- Promotion quality.
- Customer membership preferences.

Ranking must be explainable enough for tenant trust.

### 9.4 Marketplace Commission and Settlement

Support both:

- SaaS subscription only.
- Marketplace commission.

Marketplace booking records should track:

- Source channel.
- Commission rule.
- Commission amount.
- Settlement status.
- Tenant payout status.

## 10. Product Experience Architecture

### 10.1 Experience Pillars

1. Premium.
   - Black canvas, white typography, amber gold action accents.
   - High-quality vehicle imagery.
   - Confident spacing and cinematic layout.

2. Intelligent.
   - AI search and assistant embedded into discovery and operations.
   - Proactive recommendations instead of passive reports.

3. Alive.
   - Real-time fleet availability.
   - Live activity feed.
   - Flight updates.
   - Fleet radar.

4. Trustworthy.
   - Reviews, badges, handover success rate, verification.
   - Transparent pricing and vehicle condition.

5. Mobile-first.
   - Search, booking, inspection, runner operations, and support should be optimized for phones.

### 10.2 Homepage Information Architecture

Hero:

- Large featured vehicle.
- Premium black background.
- Intelligent search bar with:
  - Location.
  - Dates.
  - Flight number.
  - AI search.
- Natural language prompt example:
  - "I am travelling with 6 people from KLIA for 3 days under RM500."

Featured Cars:

- Large visual carousel.
- Vehicle image.
- Rating.
- Price.
- Availability.

Promotions:

- Last Minute Deals.
- Weekend Specials.
- Holiday Campaigns.
- Airport Specials.

Top Rated Rental Companies:

- Rating.
- Reviews.
- Fleet size.
- Verification badges.
- Top Rated, Fast Response, Most Booked badges.

Live Fleet Availability:

- KLIA.
- KLIA2.
- Subang.
- Cyberjaya.
- Johor.
- Sabah.
- Sarawak.

Discovery Feed:

- Trending Cars.
- Popular Destinations.
- Family Trips.
- Business Travel.
- Airport Rentals.

Trust Indicators:

- Total bookings.
- Total cars.
- Average rating.
- Successful handover rate.

Interactive Malaysia Map:

- Fleet distribution.
- Demand hotspots.
- Airport demand.

Customer Reviews:

- Premium testimonial cards.
- Verified booking marker.

AI Travel Assistant:

- Floating assistant.
- Suggests vehicles.
- Suggests destinations.
- Recommends upgrades.
- Answers booking questions.

### 10.3 Tenant Dashboard as Operations Command Center

The tenant dashboard should not begin with admin tables. It should be a real-time command center.

Dashboard Overview:

- Bento grid layout.
- Revenue today.
- Occupancy rate.
- Active rentals.
- Available cars.
- Upcoming returns.

Live Activity Feed:

- New booking.
- Vehicle returned.
- Flight delayed.
- Runner assigned.
- Payment captured.
- Inspection issue detected.

Fleet Radar:

- Available.
- Cleaning.
- Delivery.
- Maintenance.
- Returning.

Operations Center:

- Today's pickups.
- Today's returns.
- Runner status.
- Flight tracking.
- Alerts.

Profit Per Car:

- Revenue.
- Expenses.
- Profit.
- ROI.
- Trend.

Fleet Heatmap:

- Demand map.
- Idle inventory.
- Airport pressure.

Dynamic Pricing AI:

- Demand-based recommendations.
- Occupancy-based recommendations.
- Holiday and market trend signals.
- Human approval workflow.

AI Business Advisor:

- Proactive business recommendations.
- Forecasts.
- Pricing changes.
- Promotion opportunities.

Carvo Copilot:

- Natural language owner interface.
- Example questions:
  - "Which car makes the most profit?"
  - "Which tenant performs best?"
  - "What is next week's forecast?"
  - "Which vehicles need servicing?"

Smart Vehicle Inspection:

- AI-assisted damage detection from photos.
- Before and after comparison.
- Human confirmation.

Predictive Maintenance:

- Service schedule.
- Tyres.
- Insurance.
- Road tax.
- Alerts.

Staff Gamification:

- Runner leaderboard.
- Deliveries.
- On-time performance.
- Customer ratings.

### 10.4 Airport Experience

Airport operations are a core differentiator.

Customer booking should support:

- Flight number.
- Arrival terminal.
- ETA.
- Delay detection.
- Suggested pickup door.
- Runner handoff.

Operations should show:

- Flight status.
- Delay alerts.
- Runner assignment.
- Pickup location.
- Customer readiness.

Example pickup locations:

- KLIA1 Door 1.
- KLIA2 Door 3.

### 10.5 Storefront and Marketplace Pages

Tenant storefront pages:

- Brand hero.
- Fleet.
- Reviews.
- Ratings.
- Promotions.
- Verification badges.
- Airport pickup coverage.

Marketplace pages:

- Search-led discovery.
- AI-led recommendations.
- Company comparison.
- Price and availability clarity.
- Trust-first ranking.

## 11. Application Architecture

### 11.1 Frontend Structure

Recommended high-level modules:

- `app/(marketplace)`: public marketplace and discovery.
- `app/(tenant)`: tenant white-label storefronts.
- `app/(command-center)`: tenant operations.
- `app/(customer)`: customer account and bookings.
- `app/(corporate)`: corporate portal.
- `app/(platform)`: internal Carvo platform operations.
- `features/*`: domain-oriented UI and application services.
- `lib/supabase`: Supabase clients.
- `lib/auth`: authorization helpers.
- `lib/domain`: shared domain primitives.

### 11.2 Backend Module Style

Inside the modular monolith, each bounded context should own:

- Domain types.
- Application services.
- Query services.
- Server actions or route handlers.
- Validation schemas.
- Mapping to database rows.

Avoid one global `services` folder that mixes domains.

### 11.3 Eventing

Start with database-backed domain events:

- `activity_events` for operations feed.
- Specific lifecycle events where needed.

Examples:

- `booking.created`.
- `booking.confirmed`.
- `flight.delayed`.
- `runner.assigned`.
- `vehicle.returned`.
- `inspection.damage_detected`.
- `payment.captured`.

These events power:

- Live command center.
- Customer notifications.
- Analytics.
- AI recommendations.

## 12. AI Architecture

### 12.1 AI Search

Natural language search should convert customer intent into structured filters:

- Passenger count.
- Pickup location.
- Date range.
- Budget.
- luggage needs.
- Trip type.
- Flight number.

The result should include:

- Recommended vehicles.
- Explanation.
- Tradeoffs.
- Upgrade suggestions.

### 12.2 AI Travel Assistant

Assistant responsibilities:

- Recommend vehicles.
- Suggest destinations.
- Explain pickup.
- Recommend upgrades.
- Answer booking questions.

Guardrails:

- Do not invent availability.
- Do not override pricing without a quote.
- Do not expose tenant private data.

### 12.3 AI Business Advisor

Advisor responsibilities:

- Pricing recommendations.
- Occupancy forecasts.
- Promotion suggestions.
- Maintenance warnings.
- Profit insights.

Every recommendation should store:

- Evidence.
- Confidence.
- Suggested action.
- Accepted, dismissed, or snoozed state.
- Business result.

## 13. Security and Compliance

Security requirements:

- RLS on all tenant-owned tables.
- No service role key in browser.
- Signed URLs for private files.
- Audit logs for privileged actions.
- Explicit role checks for finance and platform support.
- Immutable financial events.
- Immutable signed inspection evidence.

Privacy requirements:

- Customers see only their own bookings and profile data.
- Tenants do not see other tenant operations.
- Marketplace pages expose only approved public projections.
- AI must respect tenant and customer data boundaries.

## 14. Carvo OS Long-Term Module Strategy

Carvo should be designed as a mobility platform that can expand into:

- Car Rental.
- Parking.
- Workshop.
- Car Wash.
- Airport Transfer.
- Tours.
- Used Car Marketplace.
- Insurance.
- Financing.

Each future module should follow the same pattern:

- Independent bounded context.
- Tenant-aware data model.
- Marketplace projection where relevant.
- Shared identity, billing, trust, and AI layers.

## 15. Initial Build Priorities

The first product slice should prove:

1. Tenant isolation works.
2. Putra Auto Rental can operate as tenant #1.
3. Customers can discover and request or book vehicles.
4. The interface feels premium and marketplace-led.
5. Tenant staff see a command center, not a spreadsheet.
6. Supabase Auth, RLS, and Storage patterns are correct.
7. The data model does not block marketplace expansion.

Recommended first vertical slice:

- Tenant setup.
- Vehicle catalog.
- Public storefront.
- Search and quote.
- Booking request.
- Operations command center.
- Runner task.
- Basic inspection.
- Activity feed.

## 16. Non-Negotiable Decisions

- All tenant-owned records include `tenant_id`.
- Putra Auto Rental must not be hard-coded.
- Public marketplace data must be projected from private tenant data.
- Financial and inspection records need auditability.
- AI recommendations require traceability.
- The tenant dashboard is an operations command center.
- Mobile and PWA behavior are first-class.
- Supabase RLS is part of the architecture, not an afterthought.

