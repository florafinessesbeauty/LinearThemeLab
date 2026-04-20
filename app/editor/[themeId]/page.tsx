export default function ThemeEditor({ params }: any) {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold neon-text">Theme Editor</h1>
      <p className="mt-4 text-gray-400">Editing theme: {params.themeId}</p>

      <iframe
        src={`/api/themes/preview?id=${params.themeId}`}
        className="w-full h-[80vh] mt-6 border neon-border rounded"
      />
    </div>
  );
}
