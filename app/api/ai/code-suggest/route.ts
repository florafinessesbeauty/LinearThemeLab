import { NextResponse } from "next/server";
import { getAiSuggestion, AiGoal } from "@server/services/aiService";

export async function POST(req: Request) {
  const body = await req.json();

  const { code, language, goal } = body as {
    code: string;
    language: string;
    goal?: AiGoal;
  };

  const mode: AiGoal = goal || "improve";

  const suggestion = await getAiSuggestion({
    code,
    language,
    goal: mode
  });

  return NextResponse.json({ suggestion });
}
