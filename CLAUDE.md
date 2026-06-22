# CLAUDE.md

## Database changes

For changes to the database (schema changes, seed data, etc.), always use a Supabase migration (`apply_migration`) rather than direct row inserts/updates outside of a migration.

## Auth-gated pages

Every signed-in-only page must verify the user's session with the Supabase Auth server before it loads, and redirect to the sign-in page if the user is not signed in. Do not rely on the browser-side session alone.
