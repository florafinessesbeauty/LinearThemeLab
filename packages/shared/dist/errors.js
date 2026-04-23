export class AppError extends Error {
    constructor(message, status = 500, code = "INTERNAL_ERROR") {
        super(message);
        this.status = status;
        this.code = code;
    }
}
export function isAppError(err) {
    return err instanceof AppError;
}
export function toAppError(err, fallbackMessage = "Unexpected error") {
    if (err instanceof AppError)
        return err;
    if (err instanceof Error)
        return new AppError(err.message);
    return new AppError(fallbackMessage);
}
