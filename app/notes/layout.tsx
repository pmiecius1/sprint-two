import { Suspense } from "react";
import { getCollections, getNotes, getTags } from "@/lib/db";
import { NotesWorkspace } from "@/components/notes/notes-workspace";
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
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <NotesWorkspaceData>{children}</NotesWorkspaceData>
    </Suspense>
  );
}
