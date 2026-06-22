"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Note = {
  id: number;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
};

export async function getNotes(): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, body, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getNote(id: number): Promise<Note | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, body, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
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
