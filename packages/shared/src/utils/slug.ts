export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(/[^a-z0-9-]/g, "")
    .replaceAll(/-+/g, "-");
}
