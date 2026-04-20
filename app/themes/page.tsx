"use client";

import { useState } from "react";

export default function ThemeGenerator() {
  const [niche, setNiche] = useState("");
  const [goal, setGoal] = useState("");

  async function generate() {
    await fetch("/api/themes/generate", {
      method: "POST",
      body: JSON.stringify({ niche, goal }),
    });
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold neon-text">Generate Theme</h1>

      <div className="mt-6 flex flex-col gap-4 w-96">
        <input
          className="p-3 bg-[#1a1a1d] rounded"
          placeholder="Niche (e.g., Fashion Boutique)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />

        <input
          className="p-3 bg-[#1a1a1d] rounded"
          placeholder="Conversion Goal (e.g., High AOV)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <button
          onClick={generate}
          className="p-3 border neon-border rounded hover:bg-[#1a1a1d]"
        >
          Generate Theme
        </button>
      </div>
    </div>
  );
}
