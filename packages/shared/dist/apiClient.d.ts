export interface ApiClientOptions {
    baseUrl: string;
    token?: string;
}
export declare class ApiClient {
    private readonly opts;
    constructor(opts: ApiClientOptions);
    private headers;
    health(): Promise<any>;
    generateTheme(body: unknown): Promise<any>;
}
export declare function generateThemeFrontend(data: {
    platform: string;
    niche: string;
    goal: string;
}): Promise<any>;
