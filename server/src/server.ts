import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { securityMiddleware, errorHandler } from "./middleware/security.js";
import { apiRouter } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(securityMiddleware);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", apiRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
