"use client";

import { useEffect, useState } from "react";
import ThemeCard from "../components/ThemeCard";

export default function ThemesPage() {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/themes/list");
      const data = await res.json();
      setThemes(data.themes || []);
    }
    load();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold neon-text mb-6">Your Themes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme: any) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}
