create table if not exists public.tenant_member_invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  role public.tenant_member_role not null default 'owner',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  accepted_by uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists tenant_member_invites_tenant_email_idx
on public.tenant_member_invites (tenant_id, lower(email));

create trigger tenant_member_invites_set_updated_at
before update on public.tenant_member_invites
for each row execute function public.set_updated_at();

alter table public.tenant_member_invites enable row level security;

create policy "Tenant owners can view invites"
on public.tenant_member_invites for select
using (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create policy "Tenant owners can manage invites"
on public.tenant_member_invites for all
using (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
)
with check (
  public.has_tenant_role(tenant_id, array['owner']::public.tenant_member_role[])
  or public.current_user_is_platform_admin()
);

create or replace function public.claim_tenant_invite(target_tenant_slug text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record public.tenant_member_invites%rowtype;
  current_email text;
begin
  if auth.uid() is null then
    return false;
  end if;

  current_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  if current_email = '' then
    return false;
  end if;

  select tenant_member_invites.*
  into invite_record
  from public.tenant_member_invites
  join public.tenants on tenants.id = tenant_member_invites.tenant_id
  where tenants.slug = target_tenant_slug
    and tenants.status = 'active'
    and lower(tenant_member_invites.email) = current_email
    and tenant_member_invites.status = 'pending'
  limit 1
  for update;

  if not found then
    return false;
  end if;

  insert into public.tenant_memberships (
    tenant_id,
    user_id,
    role,
    status
  )
  values (
    invite_record.tenant_id,
    auth.uid(),
    invite_record.role,
    'active'
  )
  on conflict (tenant_id, user_id)
  do update set
    role = excluded.role,
    status = 'active',
    updated_at = now();

  update public.tenant_member_invites
  set
    status = 'accepted',
    accepted_by = auth.uid(),
    accepted_at = now()
  where id = invite_record.id;

  return true;
end;
$$;

grant execute on function public.claim_tenant_invite(text) to authenticated;

insert into public.tenant_member_invites (
  tenant_id,
  email,
  role,
  status
)
values (
  '11111111-1111-4111-8111-111111111111',
  'owner@putra-auto-rental.example',
  'owner',
  'pending'
)
on conflict (tenant_id, lower(email)) do nothing;
