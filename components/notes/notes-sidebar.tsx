"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCollection } from "@/lib/db";
import type { Collection, Note, Tag } from "@/lib/db";
import { TagDot, TagColorPicker } from "@/components/notes/tag-color-picker";

function NoteCard({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="block rounded-md p-2 text-sm hover:bg-accent"
    >
      <div className="font-medium">{note.title}</div>
      {note.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              <TagDot color={tag.color} />
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

function CollectionGroup({
  title,
  notes,
  emptyMessage,
  defaultExpanded = false,
}: {
  title: string;
  notes: Note[];
  emptyMessage: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b py-2">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-2 py-1 text-left text-sm font-semibold hover:bg-accent rounded-md"
      >
        <span>{title}</span>
        <span className="text-xs text-muted-foreground">
          {notes.length} {expanded ? "▾" : "▸"}
        </span>
      </button>
      {expanded && (
        <div className="mt-1 flex flex-col gap-1 px-1">
          {notes.length === 0 ? (
            <p className="px-2 py-1 text-xs text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            notes.map((note) => <NoteCard key={note.id} note={note} />)
          )}
        </div>
      )}
    </div>
  );
}

export function NotesSidebar({
  notes,
  collections,
  allTags,
  selectedTagIds,
  onToggleTag,
  isSearching,
}: {
  notes: Note[];
  collections: Collection[];
  allTags: Tag[];
  selectedTagIds: number[];
  onToggleTag: (tagId: number) => void;
  isSearching: boolean;
}) {
  const router = useRouter();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  async function handleNewCollection() {
    const name = window.prompt("Collection name");
    if (!name || !name.trim()) return;

    setIsCreatingCollection(true);
    try {
      await createCollection(name);
      router.refresh();
    } finally {
      setIsCreatingCollection(false);
    }
  }

  const uncollectedNotes = notes.filter((note) => note.collection_id === null);
  const hasTagFilter = selectedTagIds.length > 0;
  const tagFilterHasNoMatches = hasTagFilter && notes.length === 0;

  return (
    <aside className="w-72 shrink-0 border-r overflow-y-auto">
      <div className="flex flex-col gap-2 border-b p-3">
        <Link
          href="/notes/new"
          className="rounded-md bg-foreground px-3 py-1.5 text-center text-sm font-medium text-background hover:opacity-90"
        >
          New note
        </Link>
        <button
          type="button"
          onClick={handleNewCollection}
          disabled={isCreatingCollection}
          className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          {isCreatingCollection ? "Creating..." : "New collection"}
        </button>
      </div>

      <div className="border-b p-3">
        <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
          Filter by tag
        </h3>
        {allTags.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <span
                  key={tag.id}
                  className={
                    "flex items-center gap-1 rounded-full pl-1 pr-2 py-0.5 text-xs " +
                    (selected
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-accent")
                  }
                >
                  <TagColorPicker tagId={tag.id} color={tag.color} />
                  <button type="button" onClick={() => onToggleTag(tag.id)}>
                    {tag.name}
                  </button>
                </span>
              );
            })}
          </div>
        )}
        {tagFilterHasNoMatches && (
          <p className="mt-2 text-xs text-muted-foreground">
            No notes have all the selected tags.
          </p>
        )}
      </div>

      <div>
        {isSearching ? (
          <CollectionGroup
            title="Search results"
            notes={notes}
            emptyMessage="No notes match your search."
            defaultExpanded
          />
        ) : (
          <>
            <CollectionGroup
              title="Uncollected"
              notes={uncollectedNotes}
              emptyMessage={
                hasTagFilter
                  ? "No uncollected notes match the selected tags."
                  : "No uncollected notes."
              }
              defaultExpanded
            />
            {collections.map((collection) => (
              <CollectionGroup
                key={collection.id}
                title={collection.name}
                notes={notes.filter(
                  (note) => note.collection_id === collection.id,
                )}
                emptyMessage={
                  hasTagFilter
                    ? "No notes in this collection match the selected tags."
                    : "No notes in this collection yet."
                }
              />
            ))}
            {collections.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No collections yet. Create one above to start grouping notes.
              </p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
