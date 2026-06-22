# Supabase schema

Plain-language description of the tables backing the notes app, in the `public` schema
of the Supabase project. All tables have Row Level Security enabled and are restricted
to signed-in (`authenticated`) users — there's no per-user ownership column yet, since
this is currently a single-user app.

## notes

The main table — one row per note.

| Column          | Type        | Notes |
| --------------- | ----------- | ----- |
| `id`            | bigint      | Primary key, auto-incrementing. |
| `title`         | text        | Required. |
| `body`          | text        | Optional — can be empty. |
| `created_at`    | timestamptz | Set automatically when the note is created. |
| `updated_at`    | timestamptz | Set when the note is created, and updated whenever it's edited. |
| `collection_id` | bigint      | Optional. Points to the collection this note belongs to. Empty if the note isn't in a collection. |

## collections

A way to group notes together (e.g. "Work," "Personal"). Not yet used by the app —
the table exists, but nothing creates or assigns collections yet.

| Column       | Type        | Notes |
| ------------ | ----------- | ----- |
| `id`         | bigint      | Primary key, auto-incrementing. |
| `name`       | text        | Required. |
| `created_at` | timestamptz | Set automatically when the collection is created. |

## tags

Labels that can be attached to notes (e.g. "urgent," "idea"). Not yet used by the
app.

| Column | Type   | Notes |
| ------ | ------ | ----- |
| `id`   | bigint | Primary key, auto-incrementing. |
| `name` | text   | Required, and must be unique — no two tags can have the same name. |

## note_tags

A note can have many tags, and a tag can be attached to many notes, so this table
just records which note goes with which tag. It has no `id` column of its own — the
combination of `note_id` and `tag_id` is the primary key, so the same note can't be
tagged with the same tag twice.

| Column    | Type   | Notes |
| --------- | ------ | ----- |
| `note_id` | bigint | Points to a note. |
| `tag_id`  | bigint | Points to a tag. |

## How the tables connect

- **A note can belong to one collection.** `notes.collection_id` points to
  `collections.id`. A note doesn't have to be in a collection — that column can be
  empty. If a collection is deleted, its notes aren't deleted; they just become
  uncategorized again.
- **A note can have many tags, and a tag can apply to many notes.** This
  many-to-many relationship goes through `note_tags`, which links a `notes.id` to a
  `tags.id`. If a note or a tag is deleted, the matching rows in `note_tags` are
  cleaned up automatically.
