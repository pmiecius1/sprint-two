import { Suspense } from "react";
import { getCollections, getNotes, getTags } from "@/lib/db";
import { NotesWorkspace } from "@/components/notes/notes-workspace";
import { NotesWorkspaceSkeleton } from "@/components/notes/notes-workspace-skeleton";
import { AuthButton } from "@/components/auth-button";

async function NotesWorkspaceData({ children }: { children: React.ReactNode }) {
  const [notes, collections, tags] = await Promise.all([
    getNotes(),
    getCollections(),
    getTags(),
  ]);

  return (
    <NotesWorkspace
      notes={notes}
      collections={collections}
      tags={tags}
      authButton={
        <Suspense>
          <AuthButton />
        </Suspense>
      }
    >
      {children}
    </NotesWorkspace>
  );
}

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<NotesWorkspaceSkeleton />}>
      <NotesWorkspaceData>{children}</NotesWorkspaceData>
    </Suspense>
  );
}
