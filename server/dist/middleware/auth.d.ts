import { Request, Response, NextFunction } from "express";
interface AuthUser {
    id: string;
    email: string;
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
export declare function requireAuth(req: AuthRequest, res: Response, next: NextFunction): any;
export {};
//# sourceMappingURL=auth.d.ts.map