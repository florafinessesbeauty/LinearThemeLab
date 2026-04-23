"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = require("../lib/stripe");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
router.post("/stripe", async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.error("Missing STRIPE_WEBHOOK_SECRET");
        return res.status(500).send("Webhook secret not configured");
    }
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Invalid signature";
        console.error("Webhook signature verification failed:", message);
        return res.status(400).send(`Webhook Error: ${message}`);
    }
    try {
        await handleStripeEvent(event);
        return res.json({ received: true });
    }
    catch (err) {
        console.error("Webhook handler error:", err);
        return res.status(500).send("Webhook handler error");
    }
});
exports.default = router;
/* -------------------------------------------------------------------------- */
/*                                EVENT HANDLER                               */
/* -------------------------------------------------------------------------- */
async function handleStripeEvent(event) {
    const obj = event.data.object;
    switch (event.type) {
        case "checkout.session.completed":
            if (isCheckoutSession(obj))
                return handleCheckoutCompleted(obj);
            break;
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
            if (isSubscription(obj))
                return handleSubscriptionUpdated(obj);
            break;
        case "invoice.payment_failed":
            if (isInvoice(obj))
                return handleInvoiceFailed(obj);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
}
/* -------------------------------------------------------------------------- */
/*                               TYPE GUARDS                                  */
/* -------------------------------------------------------------------------- */
function isCheckoutSession(obj) {
    return obj && typeof obj === "object" && "mode" in obj;
}
function isSubscription(obj) {
    return obj && typeof obj === "object" && "status" in obj && "customer" in obj;
}
function isInvoice(obj) {
    return obj && typeof obj === "object" && "billing_reason" in obj;
}
/* -------------------------------------------------------------------------- */
/*                           INDIVIDUAL HANDLERS                              */
/* -------------------------------------------------------------------------- */
async function handleCheckoutCompleted(session) {
    const userId = session.metadata?.userId ?? null;
    const subscriptionId = typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id ?? null;
    const customerId = typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null;
    if (!userId || !subscriptionId || !customerId)
        return;
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
async function handleSubscriptionUpdated(subscription) {
    const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id ?? null;
    if (!customerId)
        return;
    const user = await prisma_1.prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });
    if (!user)
        return;
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            plan: subscription.status === "active" ? "pro" : "free",
        },
    });
}
async function handleInvoiceFailed(invoice) {
    const customerId = typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer?.id ?? null;
    if (!customerId)
        return;
    const user = await prisma_1.prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });
    if (!user)
        return;
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "past_due" },
    });
}
