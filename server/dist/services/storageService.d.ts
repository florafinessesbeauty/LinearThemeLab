import { type ThemeFile } from "@linearthemelab/shared";
export interface UploadResult {
    key: string;
    url: string;
}
export declare function uploadThemeZip(id: string, files: ThemeFile[]): Promise<UploadResult>;
export declare function createThemeId(): string;
//# sourceMappingURL=storageService.d.ts.map