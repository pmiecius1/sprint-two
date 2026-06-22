# CLAUDE.md

## Database changes

For changes to the database (schema changes, seed data, etc.), always use a Supabase migration (`apply_migration`) rather than direct row inserts/updates outside of a migration.

## Authentication rules

- Use Supabase Auth for all sign-in and session handling — never build custom auth or store passwords yourself.
- Every page under /workspace requires a signed-in user; verify this on the server and redirect to /login if they are not signed in.
- After a successful sign-in, redirect to /workspace.
- After sign-out, redirect to /login.

# Git workflow

- One branch per feature → PR → merge → delete branch.
- Branch name matches the feature (e.g. `dark-mode-toggle`, `starred-documents`).