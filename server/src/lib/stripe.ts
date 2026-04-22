// server/src/lib/stripe.ts
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
