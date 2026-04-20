export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold neon-text">LinearThemeLab</h1>
      <p className="mt-4 text-gray-400">
        Generate fully‑coded Shopify & WooCommerce themes with AI.
      </p>
      <a
        href="/auth/login"
        className="mt-8 px-6 py-3 border neon-border rounded-lg hover:bg-[#1a1a1d] transition"
      >
        Sign In
      </a>
    </main>
  );
}
