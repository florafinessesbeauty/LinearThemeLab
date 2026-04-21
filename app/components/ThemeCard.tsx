"use client";

import Link from "next/link";

export default function ThemeCard({ theme }: { theme: any }) {
  return (
    <div className="border border-gray-700 p-5 rounded-lg bg-[#111]">
      <h2 className="text-xl font-bold">{theme.niche}</h2>
      <p className="text-gray-400">{theme.platform}</p>
      <p className="text-gray-500 text-sm mt-2">{theme.goal}</p>

      <Link
        href={`/themes/${theme.id}`}
        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View Theme
      </Link>
    </div>
  );
}
