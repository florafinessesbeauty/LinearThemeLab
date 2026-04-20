export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
      <p className="mt-4 text-gray-400">Your generated themes will appear here.</p>

      <a
        href="/themes"
        className="mt-6 inline-block px-6 py-3 border neon-border rounded hover:bg-[#1a1a1d]"
      >
        Generate New Theme
      </a>
    </div>
  );
}
