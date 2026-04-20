import { themeRequestSchema } from "./themeSchemas";

export function validateThemeRequest(input: unknown) {
  return themeRequestSchema.parse(input);
}
