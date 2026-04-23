"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/billing.ts
const express_1 = require("express");
const stripe_1 = require("../lib/stripe");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// 1) Create Checkout Session (upgrade to Pro)
router.post("/billing/checkout", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const session = await stripe_1.stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: user.email,
            line_items: [
                {
                    price: process.env.STRIPE_PRO_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CDN_URL}/billing/success`,
            cancel_url: `${process.env.CDN_URL}/billing/cancel`,
            metadata: {
                userId: user.id,
            },
        });
        return res.json({ url: session.url });
    }
    catch (err) {
        console.error("Error creating checkout session", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// 2) Create Billing Portal Session
router.post("/billing/portal", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });
        if (!subscription?.stripeCustomerId) {
            return res.status(400).json({ error: "No Stripe customer for user" });
        }
        const portalSession = await stripe_1.stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${process.env.CDN_URL}/billing`,
        });
        return res.json({ url: portalSession.url });
    }
    catch (err) {
        console.error("Error creating billing portal session", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
