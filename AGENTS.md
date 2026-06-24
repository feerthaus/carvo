# AGENTS.md

## Cursor Cloud specific instructions

Carvo is a single Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4
application backed by Supabase. There is one deployable service; the standard
scripts in `package.json` (`dev`, `build`, `lint`) and the setup steps in
`README.md` are the source of truth.

Service: Carvo web app
- Run (dev): `npm run dev` — serves on `http://localhost:3000`.
- Lint: `npm run lint`
- Build: `npm run build`
- Routes: `/` (marketplace homepage, static), `/command-center` (tenant ops
  dashboard, static), `/putra-auto-rental` (white-label storefront,
  server-rendered).

Non-obvious notes:
- A `.env.local` is required for the app to read Supabase config. It is
  gitignored, so it does NOT persist via git and must be recreated each session:
  `cp .env.example .env.local`. The committed `.env.example` contains a real
  public Supabase URL + anon key, so the storefront renders live tenant data
  out of the box (the `/putra-auto-rental` page shows "Data source: Supabase
  live tenant data" when the backend is reachable).
- `lib/carvo/storefront.ts` wraps all Supabase queries in try/catch and falls
  back to a hard-coded `previewStorefront` ("Preview mode") if the backend is
  unreachable or env vars are missing, so every page still renders 200 even
  with no/invalid Supabase credentials. A green "Supabase live tenant data"
  badge vs. a preview badge is the quick way to tell which path ran.
- The homepage and command center use only static in-file mock data; only the
  storefront actually talks to Supabase.
- Applying Supabase migrations / regenerating DB types requires privileged
  credentials (a `sbp_...` access token or a direct Postgres URL) that are not
  present by default; see `supabase/README.md`. This is not needed to run the
  app locally.
