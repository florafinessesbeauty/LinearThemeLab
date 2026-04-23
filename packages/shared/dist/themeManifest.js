export function createThemeManifest(input) {
    return {
        id: input.id,
        name: `${input.niche} – ${input.platform} theme`,
        platform: input.platform,
        niche: input.niche,
        goal: input.goal,
        version: "1.0.0",
        createdAt: new Date().toISOString()
    };
}
