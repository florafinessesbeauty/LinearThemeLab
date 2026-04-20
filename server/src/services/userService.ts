const themesByUser: Record<string, any[]> = {};

export function addUserTheme(userId: string, theme: any) {
  if (!themesByUser[userId]) themesByUser[userId] = [];
  themesByUser[userId].push(theme);
}

export function listUserThemes(userId: string) {
  return themesByUser[userId] || [];
}

export function getThemeById(userId: string, themeId: string) {
  return (themesByUser[userId] || []).find((t) => t.id === themeId);
}
