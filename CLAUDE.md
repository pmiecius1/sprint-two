# CLAUDE.md

## Tech stack

- Next.js (App Router), Server Components + Server Actions
- TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + RLS), with the Supabase MCP server
- `@supabase/ssr` for all Supabase client creation — browser (`lib/supabase/client.ts`), server (`lib/supabase/server.ts`), and middleware (`lib/supabase/proxy.ts`). Never instantiate a Supabase client any other way.

## Database changes

For changes to the database (schema changes, seed data, etc.), always use a Supabase migration (`apply_migration`) rather than direct row inserts/updates outside of a migration.

## Data access

All Supabase table reads and writes go through `lib/db.ts` — don't create per-table
helper files (e.g. `lib/collections.ts`, `lib/tags.ts`) and don't call
`supabase.from(...)` directly from pages or components. As collections, tags, and
note_tags get real CRUD code, add it to `lib/db.ts` rather than a new module.

Documents (notes, collections, tags) are persisted in Supabase and scoped to the
signed-in user via `user_id` + RLS — a user must only ever see documents they
created. `localStorage` and `sessionStorage` are not acceptable persistence layers
for this project — no document data may live in either, under any circumstances.

## Authentication rules

- Use Supabase Auth for all sign-in and session handling — never build custom auth, never hash or store passwords yourself. Sign-up, sign-in, password reset, and sign-out all go through `supabase.auth.*` (`signUp`, `signInWithPassword`, `signInWithOAuth`, `updateUser`, `signOut`).
- Server-side code must always call `supabase.auth.getUser()` to check who's signed in — never `getSession()`. `getSession()` reads the session from cookies without verifying it against the Auth server, so it cannot be trusted for an authorization decision. If `getSession()` shows up in a diff for any server file, flag it before merging.
- Every page in the document workspace (currently under /notes) requires a signed-in user; verify this on the server (middleware in `lib/supabase/proxy.ts`, plus `getUser()` in any server component/action that needs the user) and redirect to /login if they are not signed in.
- After a successful sign-in, redirect to /notes.
- After sign-out, redirect to /login.
- The Supabase service-role key must never be used in this app, and must never be put in a `NEXT_PUBLIC_*` env var or any other client-accessible config. Only the anon/publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) is exposed to the browser; all authorization is enforced by RLS, not by a privileged key.

# Git workflow

- One branch per feature → PR → merge → delete branch.
- Branch name matches the feature (e.g. `dark-mode-toggle`, `starred-documents`).

## Verification

The app runs and is verified locally (`npm run dev`, `tsc --noEmit`, `eslint`) before
work is considered done. Confirm changes against the running dev server rather than
relying on type-checking alone.