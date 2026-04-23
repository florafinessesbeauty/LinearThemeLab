interface VersionEntry {
    path: string;
    old: string;
    new: string;
    timestamp: number;
}
export declare function saveVersionEntry(themeId: string, filePath: string, old: string, updated: string): void;
export declare function listVersions(themeId: string): VersionEntry[];
export declare function restoreVersion(themeId: string, timestamp: number): VersionEntry | null;
export {};
//# sourceMappingURL=versionService.d.ts.map