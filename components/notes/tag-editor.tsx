"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTagToNote, removeTagFromNote } from "@/lib/db";
import type { Tag } from "@/lib/db";

export function TagEditor({
  noteId,
  tags,
  allTags,
}: {
  noteId: number;
  tags: Tag[];
  allTags: Tag[];
}) {
  const router = useRouter();
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTag.trim()) return;

    setIsSaving(true);
    try {
      await addTagToNote(noteId, newTag.trim());
      setNewTag("");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove(tagId: number) {
    setIsSaving(true);
    try {
      await removeTagFromNote(noteId, tagId);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Tags</span>
      <div className="flex flex-wrap gap-1">
        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tags yet.</p>
        ) : (
          tags.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemove(tag.id)}
                disabled={isSaving}
                aria-label={`Remove ${tag.name}`}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          list="all-tags"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag..."
          disabled={isSaving}
          className="rounded-md border px-2 py-1 text-sm"
        />
        <datalist id="all-tags">
          {allTags.map((tag) => (
            <option key={tag.id} value={tag.name} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md border px-3 py-1 text-sm hover:bg-accent"
        >
          Add
        </button>
      </form>
    </div>
  );
}
