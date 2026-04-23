import type { ThemeFile } from "@linearthemelab/shared";
export declare function uploadThemeZip(id: string, files: ThemeFile[]): Promise<{
    key: string;
    url: string;
}>;
export declare function createThemeId(): `${string}-${string}-${string}-${string}-${string}`;
//# sourceMappingURL=storageService.d.ts.map