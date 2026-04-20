"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
const stripe_js_1 = require("../config/stripe.js");
const auth_js_1 = require("../middleware/auth.js");
exports.paymentsRouter = (0, express_1.Router)();
exports.paymentsRouter.post("/create-intent", auth_js_1.requireAuth, async (req, res) => {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe_js_1.stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
            userId: req.user.id
        }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
});
