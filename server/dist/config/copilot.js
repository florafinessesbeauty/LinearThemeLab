"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copilotClient = void 0;
exports.copilotClient = {
    async get() {
        const { CopilotClient } = await import("@github/copilot-sdk");
        return new CopilotClient();
    }
};
