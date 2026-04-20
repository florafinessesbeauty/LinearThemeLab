"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold neon-text">Login</h1>

      <button
        onClick={() => signIn("google")}
        className="mt-6 px-6 py-3 border neon-border rounded-lg hover:bg-[#1a1a1d]"
      >
        Continue with Google
      </button>

      <a href="/auth/register" className="mt-4 text-gray-400 underline">
        Create an account
      </a>
    </div>
  );
}
