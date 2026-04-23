export type AiGoal = "fix" | "explain" | "refactor" | "section" | "improve";
export declare function getAiSuggestion(opts: {
    code: string;
    language: string;
    goal: AiGoal;
}): Promise<string>;
//# sourceMappingURL=aiService.d.ts.map