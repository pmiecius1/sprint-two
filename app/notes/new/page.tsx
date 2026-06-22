import Link from "next/link";
import { createNote } from "@/lib/db";

export default function NewNotePage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New note</h1>
        <Link href="/notes" className="text-sm underline underline-offset-4">
          Back to notes
        </Link>
      </div>

      <form action={createNote} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="body" className="text-sm font-medium">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={10}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Create note
        </button>
      </form>
    </div>
  );
}
