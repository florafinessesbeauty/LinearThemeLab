import cors from "cors";
import { Request, Response, NextFunction } from "express";
export declare const securityMiddleware: (((req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void) | ((req: cors.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void))[];
export declare function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=security.d.ts.map