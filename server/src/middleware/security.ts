import helmet from "helmet";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

export const securityMiddleware = [
  helmet(),
  cors({
    origin: "*",
    credentials: true
  })
];

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal server error"
  });
}
