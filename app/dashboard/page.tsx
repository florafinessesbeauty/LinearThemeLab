"use client";

import { useState } from "react";
import GenerateThemeModal from "../components/GenerateThemeModal";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
      <p className="mt-4 text-gray-400">Your generated themes will appear here.</p>

      <button
        onClick={() => setOpen(true)}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Generate New Theme
      </button>

      {open && <GenerateThemeModal onClose={() => setOpen(false)} />}
    </div>
  );
}
