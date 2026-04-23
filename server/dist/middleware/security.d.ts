import { Request, Response, NextFunction } from "express";
export declare const securityMiddleware: any[];
type HttpError = Error & {
    statusCode?: number;
};
export declare function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction): void;
export {};
//# sourceMappingURL=security.d.ts.map