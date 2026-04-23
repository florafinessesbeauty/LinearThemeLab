"use client";

import { useEffect, useState } from "react";

interface ThemePreview {
  manifest: {
    name: string;
    platform: string;
    niche: string;
    goal: string;
  };
  downloadUrl: string;
}

export default function ThemeDetails({
  params,
}: Readonly<{ params: { themeId: string } }>) {
  const { themeId } = params;
  const [theme, setTheme] = useState<ThemePreview | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/themes/preview?id=${themeId}`);
      const data = await res.json();
      setTheme(data);
    }
    load();
  }, [themeId]);

  if (!theme) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{theme.manifest.name}</h1>

      <p className="text-gray-400 mt-2">
        Platform: {theme.manifest.platform}
      </p>
      <p className="text-gray-400">Niche: {theme.manifest.niche}</p>
      <p className="text-gray-400">Goal: {theme.manifest.goal}</p>

      <a
        href={theme.downloadUrl}
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Theme ZIP
      </a>

      <iframe
        title="Theme preview"
        src={`/api/themes/preview?id=${themeId}`}
        className="w-full h-[600px] mt-10 border border-gray-700 rounded"
      />
    </div>
  );
}
