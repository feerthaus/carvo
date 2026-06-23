create or replace function public.get_public_command_center_bookings(
  target_tenant_slug text
)
returns table (
  id uuid,
  tenant_id uuid,
  status public.booking_status,
  starts_at timestamptz,
  ends_at timestamptz,
  vehicle_id uuid,
  vehicle_name text,
  pickup_location_id uuid,
  pickup_location_name text,
  quoted_total_myr numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    bookings.id,
    bookings.tenant_id,
    bookings.status,
    bookings.starts_at,
    bookings.ends_at,
    bookings.vehicle_id,
    coalesce(vehicles.name, 'Vehicle pending') as vehicle_name,
    bookings.pickup_location_id,
    coalesce(fleet_locations.name, 'Pickup pending') as pickup_location_name,
    bookings.quoted_total_myr
  from public.bookings
  join public.tenants on tenants.id = bookings.tenant_id
  left join public.vehicles
    on vehicles.id = bookings.vehicle_id
    and vehicles.tenant_id = bookings.tenant_id
  left join public.fleet_locations
    on fleet_locations.id = bookings.pickup_location_id
    and fleet_locations.tenant_id = bookings.tenant_id
  where tenants.slug = target_tenant_slug
    and tenants.status = 'active'
    and tenants.marketplace_enabled = true
    and bookings.status in ('requested', 'quoted', 'confirmed')
  order by bookings.starts_at asc
  limit 25;
$$;

grant execute on function public.get_public_command_center_bookings(text) to anon;
grant execute on function public.get_public_command_center_bookings(text) to authenticated;
