"use client";

import { useMemo, useState } from "react";
import type { Collection, Note, Tag } from "@/lib/db";
import { NotesSidebar } from "@/components/notes/notes-sidebar";

function matchesQuery(note: Note, query: string): boolean {
  const q = query.toLowerCase();
  return (
    note.title.toLowerCase().includes(q) ||
    (note.body ?? "").toLowerCase().includes(q)
  );
}

function matchesAllTags(note: Note, tagIds: number[]): boolean {
  return tagIds.every((id) => note.tags.some((tag) => tag.id === id));
}

export function NotesWorkspace({
  notes,
  collections,
  tags,
  children,
}: {
  notes: Note[];
  collections: Collection[];
  tags: Tag[];
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const isSearching = searchQuery.trim().length > 0;

  const visibleNotes = useMemo(() => {
    const trimmed = searchQuery.trim();
    return notes
      .filter((note) => (trimmed ? matchesQuery(note, trimmed) : true))
      .filter((note) => matchesAllTags(note, selectedTagIds));
  }, [notes, searchQuery, selectedTagIds]);

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="border-b p-3">
        <input
          type="search"
          placeholder="Search notes by title or body..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-1">
        <NotesSidebar
          notes={visibleNotes}
          collections={collections}
          allTags={tags}
          selectedTagIds={selectedTagIds}
          onToggleTag={toggleTag}
          isSearching={isSearching}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
