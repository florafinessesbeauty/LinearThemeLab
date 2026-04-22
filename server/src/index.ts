import express from "express";
import billingRoutes from "./routes/billing";
import stripeWebhookRoutes from "./routes/webhooks";

const app = express();

// Stripe webhook needs raw body
app.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookRoutes
);

// All other routes use JSON
app.use(express.json());

app.use("/api", billingRoutes);
// ... your other routes

export default app;
