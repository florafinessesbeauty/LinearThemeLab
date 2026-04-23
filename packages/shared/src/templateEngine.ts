export function renderTemplate(template: string, vars: Record<string, string>): string {
  return Object.keys(vars).reduce((acc, key) => {
    const pattern = new RegExp(String.raw`{{\s*${key}\s*}}`, "g");
    return acc.replace(pattern, vars[key]);
  }, template);
}
