"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
exports.generateThemeFrontend = generateThemeFrontend;
class ApiClient {
    constructor(opts) {
        this.opts = opts;
    }
    headers() {
        const headers = {
            "Content-Type": "application/json"
        };
        if (this.opts.token) {
            headers.Authorization = `Bearer ${this.opts.token}`;
        }
        return headers;
    }
    async health() {
        const res = await fetch(`${this.opts.baseUrl}/health`);
        return res.json();
    }
    async generateTheme(body) {
        const res = await fetch(`${this.opts.baseUrl}/themes/generate`, {
            method: "POST",
            headers: this.headers(),
            body: JSON.stringify(body)
        });
        if (!res.ok)
            throw new Error(`Generate failed: ${res.status}`);
        return res.json();
    }
}
exports.ApiClient = ApiClient;
async function generateThemeFrontend(data) {
    const res = await fetch("/api/themes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok)
        throw new Error("Theme generation failed");
    return res.json();
}
