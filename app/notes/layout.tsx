import { getCollections, getNotes, getTags } from "@/lib/db";
import { NotesWorkspace } from "@/components/notes/notes-workspace";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notes, collections, tags] = await Promise.all([
    getNotes(),
    getCollections(),
    getTags(),
  ]);

  return (
    <NotesWorkspace notes={notes} collections={collections} tags={tags}>
      {children}
    </NotesWorkspace>
  );
}
