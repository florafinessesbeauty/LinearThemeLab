"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ⭐ If user is already logged in → redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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
