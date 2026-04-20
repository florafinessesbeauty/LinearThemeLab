import { Router } from "express";
import { themesRouter } from "./themes.js";
import { paymentsRouter } from "./payments.js";
import { authRouter } from "./auth.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/themes", themesRouter);
apiRouter.use("/payments", paymentsRouter);
