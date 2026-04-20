import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const authRouter = Router();

authRouter.post("/email-login", (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, env.JWT_SECRET, { subject: email, expiresIn: "7d" });
  res.json({ token });
});
