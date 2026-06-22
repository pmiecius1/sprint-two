import Link from "next/link";

export default function NotesPage() {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-xl font-semibold">No note selected</h1>
      <p className="text-sm text-muted-foreground">
        Pick a note from the sidebar, or create a new one to get started.
      </p>
      <Link
        href="/notes/new"
        className="mt-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
      >
        New note
      </Link>
    </div>
  );
}
