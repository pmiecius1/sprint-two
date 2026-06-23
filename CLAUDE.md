# CLAUDE.md

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase, with the Supabase MCP server

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

- Use Supabase Auth for all sign-in and session handling — never build custom auth or store passwords yourself.
- Every page under /workspace requires a signed-in user; verify this on the server and redirect to /login if they are not signed in.
- After a successful sign-in, redirect to /workspace.
- After sign-out, redirect to /login.

# Git workflow

- One branch per feature → PR → merge → delete branch.
- Branch name matches the feature (e.g. `dark-mode-toggle`, `starred-documents`).

## Verification

The app runs and is verified locally (`npm run dev`, `tsc --noEmit`, `eslint`) before
work is considered done. Confirm changes against the running dev server rather than
relying on type-checking alone.