export default function NoteEditorLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-32 rounded-md bg-muted" />
        <div className="h-8 w-24 rounded-md bg-muted" />
      </div>
      <div className="mb-6 h-24 rounded-md border bg-muted/40" />
      <div className="flex flex-col gap-4">
        <div className="h-10 rounded-md bg-muted" />
        <div className="h-40 rounded-md bg-muted" />
        <div className="h-10 w-32 rounded-md bg-muted" />
      </div>
    </div>
  );
}
