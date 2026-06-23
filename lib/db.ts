"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isTagColor } from "@/components/notes/tag-colors";

export type Tag = { id: number; name: string; color: string };
export type Collection = { id: number; name: string; created_at: string };

export type Note = {
  id: number;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  collection_id: number | null;
  tags: Tag[];
};

type RawNoteRow = {
  id: number;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  collection_id: number | null;
  note_tags: { tags: Tag | null }[] | null;
};

const NOTE_SELECT =
  "id, title, body, created_at, updated_at, collection_id, note_tags(tags(id, name, color))";

function mapNote(row: RawNoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    created_at: row.created_at,
    updated_at: row.updated_at,
    collection_id: row.collection_id,
    tags: (row.note_tags ?? [])
      .map((noteTag) => noteTag.tags)
      .filter((tag): tag is Tag => tag !== null),
  };
}

export async function getNotes(): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(NOTE_SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as RawNoteRow[]).map(mapNote);
}

export async function getNote(id: number): Promise<Note | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(NOTE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapNote(data as unknown as RawNoteRow) : null;
}

export async function createNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || null;

  if (!title) throw new Error("Title is required");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({ title, body })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
  redirect(`/notes/${data.id}`);
}

export async function updateNote(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || null;

  if (!title) throw new Error("Title is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}

export async function deleteNote(formData: FormData) {
  const id = Number(formData.get("id"));

  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNoteCollection(
  noteId: number,
  collectionId: number | null,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ collection_id: collectionId, updated_at: new Date().toISOString() })
    .eq("id", noteId);

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}`);
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, created_at")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function createCollection(name: string): Promise<Collection> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Collection name is required");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .insert({ name: trimmed })
    .select("id, name, created_at")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
  return data;
}

export async function updateCollectionName(
  collectionId: number,
  name: string,
): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Collection name is required");

  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({ name: trimmed })
    .eq("id", collectionId);

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
}

export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, color")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTagColor(tagId: number, color: string) {
  if (!isTagColor(color)) throw new Error("Invalid tag color");

  const supabase = await createClient();
  const { error } = await supabase
    .from("tags")
    .update({ color })
    .eq("id", tagId);

  if (error) throw new Error(error.message);

  revalidatePath("/notes");
}

export async function addTagToNote(noteId: number, tagName: string): Promise<Tag> {
  const trimmed = tagName.trim();
  if (!trimmed) throw new Error("Tag name is required");

  const supabase = await createClient();

  const { data: tag, error: tagError } = await supabase
    .from("tags")
    .upsert({ name: trimmed }, { onConflict: "user_id,name" })
    .select("id, name, color")
    .single();

  if (tagError) throw new Error(tagError.message);

  const { error: linkError } = await supabase
    .from("note_tags")
    .upsert(
      { note_id: noteId, tag_id: tag.id },
      { onConflict: "note_id,tag_id", ignoreDuplicates: true },
    );

  if (linkError) throw new Error(linkError.message);

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/notes");
  return tag;
}

export async function removeTagFromNote(noteId: number, tagId: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("note_tags")
    .delete()
    .eq("note_id", noteId)
    .eq("tag_id", tagId);

  if (error) throw new Error(error.message);

  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/notes");
}
