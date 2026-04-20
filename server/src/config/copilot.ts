export const copilotClient = {
  async get() {
    const { CopilotClient } = await import("@github/copilot-sdk");
    return new CopilotClient();
  }
};
