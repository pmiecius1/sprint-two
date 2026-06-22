import { createClient } from "@/lib/supabase/server";

export default async function NotesPage() {
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, body")
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Failed to load notes: {error.message}</p>;
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes?.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
