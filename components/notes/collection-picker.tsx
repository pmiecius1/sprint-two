"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateNoteCollection } from "@/lib/db";
import type { Collection } from "@/lib/db";

export function CollectionPicker({
  noteId,
  collections,
  currentCollectionId,
}: {
  noteId: number;
  collections: Collection[];
  currentCollectionId: number | null;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const collectionId = value === "" ? null : Number(value);

    setIsSaving(true);
    try {
      await updateNoteCollection(noteId, collectionId);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="collection" className="text-sm font-medium">
        Collection
      </label>
      <select
        id="collection"
        defaultValue={currentCollectionId ?? ""}
        onChange={handleChange}
        disabled={isSaving}
        className="rounded-md border px-2 py-1 text-sm"
      >
        <option value="">Uncollected</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </select>
      {isSaving && (
        <span className="text-xs text-muted-foreground">Saving...</span>
      )}
    </div>
  );
}
