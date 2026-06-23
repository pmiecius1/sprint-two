"use client";

function slugify(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "untitled";
}

export function ExportMarkdownButton({
  title,
  body,
}: {
  title: string;
  body: string | null;
}) {
  function handleExport() {
    const content = `# ${title}\n\n${body ?? ""}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(title)}.md`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
    >
      Export to Markdown
    </button>
  );
}
