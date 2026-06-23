export function NotesWorkspaceSkeleton() {
  return (
    <div className="flex min-h-svh w-full animate-pulse flex-col">
      <div className="flex items-center justify-between gap-4 border-b p-3">
        <div className="h-9 w-full max-w-md rounded-md bg-muted" />
        <div className="h-9 w-28 rounded-md bg-muted" />
      </div>
      <div className="flex flex-1">
        <aside className="w-72 shrink-0 border-r p-3">
          <div className="flex flex-col gap-2">
            <div className="h-9 rounded-md bg-muted" />
            <div className="h-9 rounded-md bg-muted" />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="flex gap-1">
              <div className="h-5 w-16 rounded-full bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-6 rounded-md bg-muted" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md bg-muted" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
