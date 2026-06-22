import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollections, getNote, getTags, updateNote, deleteNote } from "@/lib/db";
import { CollectionPicker } from "@/components/notes/collection-picker";
import { TagEditor } from "@/components/notes/tag-editor";

export default async function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noteId = Number(id);
  const [note, collections, allTags] = await Promise.all([
    getNote(noteId),
    getCollections(),
    getTags(),
  ]);

  if (!note) notFound();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit note</h1>
        <Link href="/notes" className="text-sm underline underline-offset-4">
          Back to notes
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-md border p-4">
        <CollectionPicker
          noteId={note.id}
          collections={collections}
          currentCollectionId={note.collection_id}
        />
        <TagEditor noteId={note.id} tags={note.tags} allTags={allTags} />
      </div>

      <form action={updateNote} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={note.id} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={note.title}
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
            defaultValue={note.body ?? ""}
            className="rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </form>

      <form action={deleteNote} className="mt-4">
        <input type="hidden" name="id" value={note.id} />
        <button
          type="submit"
          className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          Delete note
        </button>
      </form>
    </div>
  );
}
