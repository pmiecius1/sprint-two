import Link from "next/link";
import { getNotes } from "@/lib/db";

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Link
          href="/notes/new"
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
        >
          New note
        </Link>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No notes yet. Create your first one.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                href={`/notes/${note.id}`}
                className="block rounded-md border p-4 hover:bg-accent"
              >
                <h2 className="font-semibold">{note.title}</h2>
                {note.body && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {note.body}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
