import { env } from "../config/env.js";

export type AiGoal =
  | "fix"
  | "explain"
  | "refactor"
  | "section"
  | "improve";

export async function getAiSuggestion(opts: {
  code: string;
  language: string;
  goal: AiGoal;
}): Promise<string> {
  const { code, language, goal } = opts;

  if (!env.COPILOT_API_KEY) {
    // Fallback: keep behavior safe if key is missing
    return `/* AI disabled — missing COPILOT_API_KEY */\n` + code;
  }

  // You can shape this payload to match your actual Copilot backend
  const payload = {
    code,
    language,
    goal,
    // You can add more metadata here (file path, themeId, etc.)
  };

  const res = await fetch(env.COPILOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.COPILOT_API_KEY}`,
      "X-Copilot-Org": env.COPILOT_ORG_ID || ""
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return `/* AI error: ${res.status} ${res.statusText}\n${text} */\n` + code;
  }

  const data = await res.json().catch(() => ({} as any));

  // Adjust this depending on your backend’s response shape
  const suggestion: string =
    data.suggestion ||
    data.code ||
    data.result ||
    `/* AI returned no suggestion */\n` + code;

  return suggestion;
}
