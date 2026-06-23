# Carvo

Carvo is a multi-tenant white-label mobility SaaS platform for car rental
operators, customers, and future marketplace experiences.

Tenant #1 is Putra Auto Rental.

## Architecture

- Architecture Handbook v1: `docs/architecture-handbook-v1.md`
- Initial Supabase migration: `supabase/migrations/20260623153000_initial_multi_tenant_schema.sql`
- Supabase clients:
  - Browser: `lib/supabase/client.ts`
  - Server: `lib/supabase/server.ts`

## Local development

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the app:

```bash
npm run dev
```

Validate:

```bash
npm run lint
npm run build
```

## Product surfaces

- `/` - Carvo premium marketplace homepage
- `/putra-auto-rental` - Putra Auto Rental white-label storefront
- `/command-center` - Tenant operations command center shell
