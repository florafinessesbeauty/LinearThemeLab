// C:\Projects\LinearThemeLab\server\src\middleware\auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

interface AuthUser {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload & {
      email?: string;
    };

    if (!payload.sub || !payload.email) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { id: String(payload.sub), email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
