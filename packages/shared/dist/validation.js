import { ThemeGenerateRequestSchema } from "./themeSchemas";
export function validateThemeRequest(input) {
    return ThemeGenerateRequestSchema.parse(input);
}
