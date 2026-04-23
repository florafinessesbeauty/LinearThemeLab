"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
// C:\Projects\LinearThemeLab\server\src\middleware\auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = header.replace("Bearer ", "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (!payload.sub || !payload.email) {
            return res.status(401).json({ error: "Invalid token payload" });
        }
        req.user = { id: String(payload.sub), email: payload.email };
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}
