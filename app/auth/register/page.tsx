"use client";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold neon-text">Register</h1>

      <form className="mt-6 flex flex-col gap-4 w-80">
        <input className="p-3 bg-[#1a1a1d] rounded" placeholder="Email" />
        <input className="p-3 bg-[#1a1a1d] rounded" placeholder="Password" type="password" />
        <button className="p-3 border neon-border rounded hover:bg-[#1a1a1d]">
          Create Account
        </button>
      </form>
    </div>
  );
}
