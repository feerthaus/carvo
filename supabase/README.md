# Supabase operations

The app is configured to read runtime Supabase values from `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Apply migrations

Remote migration application requires either a valid Supabase access token with
the `sbp_...` format or a direct Postgres database URL.

With an access token:

```bash
export SUPABASE_ACCESS_TOKEN=sbp_...
npx supabase link --project-ref efaojnvpjqjkcxnktjey
npx supabase db push
```

With a direct database URL:

```bash
npx supabase db push --db-url "$SUPABASE_DB_URL"
```

## Generate types

After the remote project is accessible:

```bash
npx supabase gen types typescript --project-id efaojnvpjqjkcxnktjey --schema public > lib/supabase/database.types.ts
```

The checked-in `lib/supabase/database.types.ts` currently matches the committed
initial migration.
