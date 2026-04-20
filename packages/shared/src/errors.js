"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.isAppError = isAppError;
exports.toAppError = toAppError;
class AppError extends Error {
    constructor(message, status = 500, code = "INTERNAL_ERROR") {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.AppError = AppError;
function isAppError(err) {
    return err instanceof AppError;
}
function toAppError(err, fallbackMessage = "Unexpected error") {
    if (err instanceof AppError)
        return err;
    if (err instanceof Error)
        return new AppError(err.message);
    return new AppError(fallbackMessage);
}
