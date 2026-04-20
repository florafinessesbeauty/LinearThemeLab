"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const env_js_1 = require("./config/env.js");
const security_js_1 = require("./middleware/security.js");
const index_js_1 = require("./routes/index.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(security_js_1.securityMiddleware);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/", index_js_1.apiRouter);
app.use(security_js_1.errorHandler);
app.listen(env_js_1.env.PORT, () => {
    console.log(`Server running on port ${env_js_1.env.PORT}`);
});
