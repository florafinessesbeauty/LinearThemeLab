// C:\Projects\LinearThemeLab\server\src\middleware\security.ts
import helmet from "helmet";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: "*",
    credentials: true,
  }),
];

type HttpError = Error & { statusCode?: number };

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode ?? 500;

  res.status(status).json({
    error: err.message || "Internal server error",
  });
}
