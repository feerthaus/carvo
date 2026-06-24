create or replace function public.record_public_booking_requested(
  target_booking_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_record public.bookings%rowtype;
  tenant_slug text;
  vehicle_name text;
  pickup_name text;
begin
  select bookings.*
  into booking_record
  from public.bookings
  join public.tenants on tenants.id = bookings.tenant_id
  where bookings.id = target_booking_id
    and bookings.status = 'requested'
    and bookings.source_channel = 'putra-storefront'
    and tenants.status = 'active'
    and tenants.marketplace_enabled = true
  limit 1;

  if not found then
    return false;
  end if;

  select tenants.slug
  into tenant_slug
  from public.tenants
  where tenants.id = booking_record.tenant_id;

  select vehicles.name
  into vehicle_name
  from public.vehicles
  where vehicles.id = booking_record.vehicle_id
    and vehicles.tenant_id = booking_record.tenant_id;

  select fleet_locations.name
  into pickup_name
  from public.fleet_locations
  where fleet_locations.id = booking_record.pickup_location_id
    and fleet_locations.tenant_id = booking_record.tenant_id;

  insert into public.activity_events (
    tenant_id,
    event_type,
    source,
    title,
    body,
    payload
  )
  values (
    booking_record.tenant_id,
    'booking.requested',
    'storefront',
    'New booking request ' || upper(left(booking_record.id::text, 8)),
    coalesce(booking_record.customer_name, 'A customer') || ' requested ' ||
      coalesce(vehicle_name, 'a vehicle') || ' from ' ||
      coalesce(pickup_name, 'a pickup location') || '.',
    jsonb_build_object(
      'tenant', tenant_slug,
      'booking_id', booking_record.id,
      'vehicle_id', booking_record.vehicle_id,
      'pickup_location_id', booking_record.pickup_location_id,
      'starts_at', booking_record.starts_at,
      'ends_at', booking_record.ends_at
    )
  );

  return true;
end;
$$;

grant execute on function public.record_public_booking_requested(uuid) to anon;
grant execute on function public.record_public_booking_requested(uuid) to authenticated;
