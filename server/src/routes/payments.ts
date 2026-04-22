import { Router } from "express";
import { stripe } from "../lib/stripe";
import { requireAuth, AuthRequest } from "../middleware/auth";

export const paymentsRouter = Router();

paymentsRouter.post(
  "/create-intent",
  requireAuth,
  async (req: AuthRequest, res) => {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        userId: req.user!.id,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  }
);
