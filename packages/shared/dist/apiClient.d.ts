export interface ApiClientOptions {
    baseUrl: string;
    token?: string;
}
export declare class ApiClient {
    private readonly opts;
    constructor(opts: ApiClientOptions);
    private headers;
    health(): Promise<unknown>;
    generateTheme(body: unknown): Promise<unknown>;
}
export declare function generateThemeFrontend(data: {
    platform: string;
    niche: string;
    goal: string;
}): Promise<unknown>;
//# sourceMappingURL=apiClient.d.ts.map