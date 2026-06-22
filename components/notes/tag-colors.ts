export const TAG_COLORS = [
  { name: "Gray", hex: "#6b7280" },
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
] as const;

export const DEFAULT_TAG_COLOR = TAG_COLORS[0].hex;

export function isTagColor(value: string): boolean {
  return TAG_COLORS.some((color) => color.hex === value);
}
