"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = require("../lib/stripe");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
router.post("/stripe", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("Missing STRIPE_WEBHOOK_SECRET");
        return res.status(500).send("Webhook secret not configured");
    }
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error("Webhook signature verification failed", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const subscriptionId = session.subscription;
                const customerId = session.customer;
                const userId = session.metadata?.userId;
                if (userId && subscriptionId && customerId) {
                    await prisma_1.prisma.user.update({
                        where: { id: userId },
                        data: {
                            stripeCustomerId: customerId,
                            stripeSubscriptionId: subscriptionId,
                            subscriptionStatus: "active",
                            plan: "pro",
                        },
                    });
                }
                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const subscriptionId = subscription.id;
                const status = subscription.status;
                const customerId = subscription.customer;
                const user = await prisma_1.prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                });
                if (user) {
                    await prisma_1.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            stripeSubscriptionId: subscriptionId,
                            subscriptionStatus: status,
                            plan: status === "active" ? "pro" : "free",
                        },
                    });
                }
                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                const user = await prisma_1.prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                });
                if (user) {
                    await prisma_1.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            subscriptionStatus: "past_due",
                        },
                    });
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (err) {
        console.error("Webhook handler error", err);
        res.status(500).send("Webhook handler error");
    }
});
exports.default = router;
