"use client";

import { useState } from "react";
import { NICHE_REGISTRY } from "@linearthemelab/shared";
import { useRouter } from "next/navigation";

type GenerateThemeModalProps = Readonly<{
  onClose: () => void;
}>;

export default function GenerateThemeModal({ onClose }: GenerateThemeModalProps) {
  const router = useRouter();

  const [platform, setPlatform] = useState<"shopify" | "woocommerce">("shopify");
  const [niche, setNiche] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    try {
      setLoading(true);

      const res = await fetch("/api/themes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, niche, goal })
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();

      router.push(`/themes/${data.id}`);
      onClose();
    } catch (err) {
      console.error("Theme generation failed:", err);
      alert("Theme generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#111] p-8 rounded-lg w-[450px] border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Generate New Theme</h2>

        {/* Platform */}
        <label htmlFor="platform" className="block text-sm mb-1">
          Platform
        </label>
        <select
          id="platform"
          className="w-full p-3 bg-[#1a1a1d] rounded mb-4"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as "shopify" | "woocommerce")}
        >
          <option value="shopify">Shopify</option>
          <option value="woocommerce">WooCommerce</option>
        </select>

        {/* Niche */}
        <label htmlFor="niche" className="block text-sm mb-1">
          Niche
        </label>
        <select
          id="niche"
          className="w-full p-3 bg-[#1a1a1d] rounded mb-4"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        >
          <option value="">Select niche</option>
          {NICHE_REGISTRY[platform].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* Goal */}
        <label htmlFor="goal" className="block text-sm mb-1">
          Conversion Goal
        </label>
        <input
          id="goal"
          className="w-full p-3 bg-[#1a1a1d] rounded mb-4"
          placeholder="High AOV, High CTR, etc."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={generate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
