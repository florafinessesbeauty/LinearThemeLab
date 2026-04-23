export declare class AppError extends Error {
    status: number;
    code: string;
    constructor(message: string, status?: number, code?: string);
}
export declare function isAppError(err: unknown): err is AppError;
export declare function toAppError(err: unknown, fallbackMessage?: string): AppError;
