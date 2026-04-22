import express from "express";
import billingRoutes from "./routes/billing";
import { paymentsRouter } from "./routes/payments";
import webhookRouter from "./routes/webhooks";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const app = express();

// Stripe webhook must use raw body
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  webhookRouter
);

// Everything else uses JSON
app.use(express.json());

// Billing (checkout + portal)
app.use("/api", billingRoutes);

// Payment intents
app.use("/api/payments", paymentsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
