"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billing_1 = __importDefault(require("./routes/billing"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const app = (0, express_1.default)();
// Stripe webhook needs raw body
app.post("/webhooks/stripe", express_1.default.raw({ type: "application/json" }), webhooks_1.default);
// All other routes use JSON
app.use(express_1.default.json());
app.use("/api", billing_1.default);
// ... your other routes
exports.default = app;
