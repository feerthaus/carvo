-- Carvo initial multi-tenant foundation.
-- This migration establishes tenant isolation, storefront-ready fleet data,
-- booking requests, activity events, and RLS helper functions.

create extension if not exists "pgcrypto";

create type public.tenant_status as enum (
  'onboarding',
  'active',
  'suspended',
  'archived'
);

create type public.tenant_member_role as enum (
  'owner',
  'operations_manager',
  'fleet_manager',
  'finance_manager',
  'runner',
  'support_agent'
);

create type public.member_status as enum (
  'invited',
  'active',
  'disabled'
);

create type public.vehicle_status as enum (
  'available',
  'cleaning',
  'delivery',
  'maintenance',
  'returning',
  'rented',
  'inactive'
);

create type public.marketplace_status as enum (
  'private',
  'draft',
  'published',
  'paused'
);

create type public.booking_status as enum (
  'requested',
  'quoted',
  'confirmed',
  'cancelled',
  'completed'
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  status public.tenant_status not null default 'onboarding',
  marketplace_enabled boolean not null default false,
  primary_domain text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  platform_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.tenant_member_role not null,
  status public.member_status not null default 'invited',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table public.tenant_brands (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  display_name text not null,
  tagline text,
  logo_url text,
  hero_image_url text,
  theme jsonb not null default '{}'::jsonb,
  contact_channels jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fleet_locations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  city text not null,
  country_code text not null default 'MY',
  airport_code text,
  pickup_instructions text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  home_location_id uuid references public.fleet_locations(id) on delete set null,
  name text not null,
  make text,
  model text,
  year integer,
  seats integer not null check (seats > 0),
  transmission text,
  fuel_type text,
  daily_rate_myr numeric(10, 2) not null check (daily_rate_myr >= 0),
  status public.vehicle_status not null default 'available',
  marketplace_status public.marketplace_status not null default 'private',
  rating numeric(2, 1) check (rating >= 0 and rating <= 5),
  features text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicle_media (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid references auth.users(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  pickup_location_id uuid references public.fleet_locations(id) on delete set null,
  status public.booking_status not null default 'requested',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  passenger_count integer check (passenger_count is null or passenger_count > 0),
  flight_number text,
  customer_name text,
  customer_email text,
  customer_phone text,
  quoted_total_myr numeric(10, 2) check (quoted_total_myr is null or quoted_total_myr >= 0),
  source_channel text not null default 'storefront',
  ai_search_prompt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  source text not null default 'system',
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index tenant_memberships_user_idx on public.tenant_memberships (user_id, status);
create index tenant_brands_tenant_idx on public.tenant_brands (tenant_id);
create index fleet_locations_tenant_public_idx on public.fleet_locations (tenant_id, is_public);
create index vehicles_tenant_status_idx on public.vehicles (tenant_id, status);
create index vehicles_marketplace_idx on public.vehicles (marketplace_status, status, daily_rate_myr);
create index vehicle_media_vehicle_idx on public.vehicle_media (tenant_id, vehicle_id, sort_order);
create index bookings_tenant_status_idx on public.bookings (tenant_id, status, starts_at);
create index bookings_customer_idx on public.bookings (customer_id, starts_at desc);
create index activity_events_tenant_created_idx on public.activity_events (tenant_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tenants_set_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger tenant_memberships_set_updated_at
before update on public.tenant_memberships
for each row execute function public.set_updated_at();

create trigger tenant_brands_set_updated_at
before update on public.tenant_brands
for each row execute function public.set_updated_at();

create trigger fleet_locations_set_updated_at
before update on public.fleet_locations
for each row execute function public.set_updated_at();

create trigger vehicles_set_updated_at
before update on public.vehicles
for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and platform_role in ('owner', 'admin')
  );
$$;

create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tenant_memberships
    where tenant_id = target_tenant_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.has_tenant_role(
  target_tenant_id uuid,
  accepted_roles public.tenant_member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tenant_memberships
    where tenant_id = target_tenant_id
      and user_id = auth.uid()
      and status = 'active'
      and role = any(accepted_roles)
  );
$$;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.tenant_brands enable row level security;
alter table public.fleet_locations enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_media enable row level security;
alter table public.bookings enable row level security;
alter table public.activity_events enable row level security;

create policy "Public can view active marketplace tenants"
on public.tenants for select
using (status = 'active' and marketplace_enabled = true);

create policy "Tenant members can view their tenant"
on public.tenants for select
using (public.is_tenant_member(id) or public.current_user_is_platform_admin());

create policy "Platform admins can manage tenants"
on public.tenants for all
using (public.current_user_is_platform_admin())
with check (public.current_user_is_platform_admin());

create policy "Users can view their own profile"
on public.profiles for select
using (id = auth.uid() or public.current_user_is_platform_admin());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid() or public.current_user_is_platform_admin())
with check (id = auth.uid() or public.current_user_is_platform_admin());

create policy "Users can view memberships they belong to"
on public.tenant_memberships for select
using (
  user_id = auth.uid()
  or public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Tenant owners can manage memberships"
on public.tenant_memberships for all
using (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Public can view marketplace tenant brands"
on public.tenant_brands for select
using (
  exists (
    select 1
    from public.tenants
    where tenants.id = tenant_brands.tenant_id
      and tenants.status = 'active'
      and tenants.marketplace_enabled = true
  )
);

create policy "Tenant members can view tenant brands"
on public.tenant_brands for select
using (public.is_tenant_member(tenant_id) or public.current_user_is_platform_admin());

create policy "Tenant owners can manage tenant brands"
on public.tenant_brands for all
using (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Public can view public fleet locations"
on public.fleet_locations for select
using (
  is_public
  and exists (
    select 1
    from public.tenants
    where tenants.id = fleet_locations.tenant_id
      and tenants.status = 'active'
      and tenants.marketplace_enabled = true
  )
);

create policy "Tenant members can view fleet locations"
on public.fleet_locations for select
using (public.is_tenant_member(tenant_id) or public.current_user_is_platform_admin());

create policy "Fleet roles can manage fleet locations"
on public.fleet_locations for all
using (
  public.has_tenant_role(tenant_id, array['owner', 'operations_manager', 'fleet_manager']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(tenant_id, array['owner', 'operations_manager', 'fleet_manager']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Public can view published available vehicles"
on public.vehicles for select
using (
  marketplace_status = 'published'
  and status in ('available', 'delivery', 'returning')
  and exists (
    select 1
    from public.tenants
    where tenants.id = vehicles.tenant_id
      and tenants.status = 'active'
      and tenants.marketplace_enabled = true
  )
);

create policy "Tenant members can view vehicles"
on public.vehicles for select
using (public.is_tenant_member(tenant_id) or public.current_user_is_platform_admin());

create policy "Fleet roles can manage vehicles"
on public.vehicles for all
using (
  public.has_tenant_role(tenant_id, array['owner', 'operations_manager', 'fleet_manager']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(tenant_id, array['owner', 'operations_manager', 'fleet_manager']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Public can view public vehicle media"
on public.vehicle_media for select
using (
  is_public
  and exists (
    select 1
    from public.vehicles
    join public.tenants on tenants.id = vehicles.tenant_id
    where vehicles.id = vehicle_media.vehicle_id
      and vehicles.marketplace_status = 'published'
      and tenants.status = 'active'
      and tenants.marketplace_enabled = true
  )
);

create policy "Tenant members can view vehicle media"
on public.vehicle_media for select
using (public.is_tenant_member(tenant_id) or public.current_user_is_platform_admin());

create policy "Fleet roles can manage vehicle media"
on public.vehicle_media for all
using (
  public.has_tenant_role(tenant_id, array['owner', 'operations_manager', 'fleet_manager']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(tenant_id, array['owner', 'operations_manager', 'fleet_manager']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Customers can create booking requests"
on public.bookings for insert
with check (
  (customer_id = auth.uid() or customer_id is null)
  and exists (
    select 1
    from public.tenants
    where tenants.id = bookings.tenant_id
      and tenants.status = 'active'
  )
  and (
    vehicle_id is null
    or exists (
      select 1
      from public.vehicles
      where vehicles.id = bookings.vehicle_id
        and vehicles.tenant_id = bookings.tenant_id
        and vehicles.marketplace_status = 'published'
    )
  )
);

create policy "Customers can view their own bookings"
on public.bookings for select
using (customer_id = auth.uid());

create policy "Tenant operators can view bookings"
on public.bookings for select
using (
  public.has_tenant_role(
    tenant_id,
    array['owner', 'operations_manager', 'fleet_manager', 'finance_manager', 'support_agent']::public.tenant_member_role[]
  )
  or public.current_user_is_platform_admin()
);

create policy "Tenant operators can manage bookings"
on public.bookings for update
using (
  public.has_tenant_role(
    tenant_id,
    array['owner', 'operations_manager', 'finance_manager', 'support_agent']::public.tenant_member_role[]
  )
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(
    tenant_id,
    array['owner', 'operations_manager', 'finance_manager', 'support_agent']::public.tenant_member_role[]
  )
  or public.current_user_is_platform_admin()
);

create policy "Tenant members can view activity events"
on public.activity_events for select
using (public.is_tenant_member(tenant_id) or public.current_user_is_platform_admin());

create policy "Operations roles can create activity events"
on public.activity_events for insert
with check (
  public.has_tenant_role(
    tenant_id,
    array['owner', 'operations_manager', 'fleet_manager', 'runner', 'support_agent']::public.tenant_member_role[]
  )
  or public.current_user_is_platform_admin()
);

insert into public.tenants (
  id,
  slug,
  name,
  status,
  marketplace_enabled
)
values (
  '11111111-1111-4111-8111-111111111111',
  'putra-auto-rental',
  'Putra Auto Rental',
  'active',
  true
)
on conflict (slug) do nothing;

insert into public.tenant_brands (
  tenant_id,
  display_name,
  tagline,
  theme,
  contact_channels
)
values (
  '11111111-1111-4111-8111-111111111111',
  'Putra Auto Rental',
  'Premium airport car rental for KLIA and KLIA2.',
  '{"mode":"premium-black","accent":"amber-gold"}'::jsonb,
  '{"whatsapp":"+60000000000","email":"hello@putra-auto-rental.example"}'::jsonb
)
on conflict (tenant_id) do nothing;

insert into public.fleet_locations (
  id,
  tenant_id,
  name,
  city,
  airport_code,
  pickup_instructions
)
values
  (
    '22222222-2222-4222-8222-222222222221',
    '11111111-1111-4111-8111-111111111111',
    'KLIA1 Door 1',
    'Sepang',
    'KUL',
    'Meet your runner at KLIA1 Door 1.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'KLIA2 Door 3',
    'Sepang',
    'KUL',
    'Meet your runner at KLIA2 Door 3.'
  ),
  (
    '22222222-2222-4222-8222-222222222223',
    '11111111-1111-4111-8111-111111111111',
    'Subang Airport',
    'Subang',
    'SZB',
    'Runner will confirm the exact pickup bay before arrival.'
  )
on conflict (id) do nothing;

insert into public.vehicles (
  tenant_id,
  home_location_id,
  name,
  make,
  model,
  year,
  seats,
  transmission,
  fuel_type,
  daily_rate_myr,
  status,
  marketplace_status,
  rating,
  features
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
    'Perodua Alza Premium',
    'Perodua',
    'Alza',
    2024,
    7,
    'Automatic',
    'Petrol',
    168.00,
    'available',
    'published',
    4.9,
    array['7 seats', 'Airport pickup', 'Family luggage']
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222223',
    'Honda City RS',
    'Honda',
    'City RS',
    2023,
    5,
    'Automatic',
    'Petrol',
    145.00,
    'available',
    'published',
    4.8,
    array['Business travel', 'Fuel efficient', 'Compact sedan']
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222221',
    'Toyota Vellfire',
    'Toyota',
    'Vellfire',
    2022,
    7,
    'Automatic',
    'Petrol',
    520.00,
    'available',
    'published',
    5.0,
    array['Executive transfer', 'Captain seats', 'Airport VIP']
  );

insert into public.activity_events (
  tenant_id,
  event_type,
  source,
  title,
  body,
  payload
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'tenant.seeded',
    'system',
    'Putra Auto Rental activated',
    'Tenant #1 is ready with initial storefront, fleet, and airport locations.',
    '{"tenant":"putra-auto-rental"}'::jsonb
  );
