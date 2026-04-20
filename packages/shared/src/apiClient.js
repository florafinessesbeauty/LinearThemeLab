"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
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
