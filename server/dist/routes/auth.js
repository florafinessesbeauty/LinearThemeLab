"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/email-login", (req, res) => {
    const { email } = req.body;
    const token = jsonwebtoken_1.default.sign({ email }, env_js_1.env.JWT_SECRET, { subject: email, expiresIn: "7d" });
    res.json({ token });
});
