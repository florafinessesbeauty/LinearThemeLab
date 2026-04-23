"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billing_1 = __importDefault(require("./routes/billing"));
const payments_1 = require("./routes/payments");
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
// Stripe webhook must use raw body
app.post("/webhooks/stripe", express_1.default.raw({ type: "application/json" }), webhooks_1.default);
// Everything else uses JSON
app.use(express_1.default.json());
// Billing (checkout + portal)
app.use("/api", billing_1.default);
// Payment intents
app.use("/api/payments", payments_1.paymentsRouter);
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
