import { ThemeGenerateRequestSchema } from "./themeSchemas";

export function validateThemeRequest(input: unknown) {
  return ThemeGenerateRequestSchema.parse(input);
}
