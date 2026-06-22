"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTagColor } from "@/lib/db";
import { TAG_COLORS } from "@/components/notes/tag-colors";

export function TagDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export function TagColorPicker({
  tagId,
  color,
}: {
  tagId: number;
  color: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handlePick(hex: string) {
    if (hex === color) {
      setOpen(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateTagColor(tagId, hex);
      router.refresh();
    } finally {
      setIsSaving(false);
      setOpen(false);
    }
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Change tag color"
        className="flex items-center justify-center rounded-full p-0.5 hover:bg-accent"
      >
        <TagDot color={color} />
      </button>
      {open && (
        <>
          <span
            className="fixed inset-0 z-0"
            onClick={() => setOpen(false)}
          />
          <span className="absolute top-full left-0 z-10 mt-1 flex flex-wrap gap-1 rounded-md border bg-popover p-2 shadow-md">
            {TAG_COLORS.map((option) => (
              <button
                key={option.hex}
                type="button"
                title={option.name}
                disabled={isSaving}
                onClick={() => handlePick(option.hex)}
                className="flex size-5 items-center justify-center rounded-full ring-offset-1 hover:ring-2 hover:ring-foreground/30"
                style={{ backgroundColor: option.hex }}
              >
                {option.hex === color && (
                  <span className="size-1.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </span>
        </>
      )}
    </span>
  );
}
