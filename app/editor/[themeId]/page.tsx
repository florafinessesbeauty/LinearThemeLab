"use client";

import { useEffect, useState, useCallback } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";

type VersionEntry = {
  path: string;
  old: string;
  new: string;
  timestamp: number;
};

type FileEntry = {
  path: string;
  size?: number;
};

type OpenTab = {
  path: string;
  contents: string;
  dirty: boolean;
};

export default function ThemeEditor({
  params,
}: Readonly<{ params: { themeId: string } }>) {

  const { themeId } = params;

  const [files, setFiles] = useState<FileEntry[]>([]);
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activePath, setActivePath] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);

  const [tabView, setTabView] = useState<"editor" | "versions" | "settings">("editor");
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionEntry | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [showQuickOpen, setShowQuickOpen] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ path: string; line: number; snippet: string }[]>([]);

  const settingsFile = "config/settings_schema.json";

  // ---------- Helpers ----------

  const getActiveTab = useCallback(() => tabs.find((t) => t.path === activePath) || null, [tabs, activePath]);

  const updateTabContents = (path: string, contents: string, dirty = true) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.path === path ? { ...t, contents, dirty } : t
      )
    );
  };

  const openOrFocusTab = (path: string, contents: string) => {
    setTabs((prev) => {
      const existing = prev.find((t) => t.path === path);
      if (existing) return prev;
      return [...prev, { path, contents, dirty: false }];
    });
    setActivePath(path);
  };

  // ---------- Load file tree ----------

  useEffect(() => {
    async function loadFiles() {
      const res = await fetch(`/api/themes/files?themeId=${themeId}`);
      const data = await res.json();
      setFiles(data.files ?? []);
    }
    loadFiles();
  }, [themeId]);

  // ---------- Open file ----------

  async function openFile(path: string) {
    setTabView("editor");
    setActivePath(path);

    const existing = tabs.find((t) => t.path === path);
    if (existing) return;

    const res = await fetch(`/api/themes/file?themeId=${themeId}&path=${encodeURIComponent(path)}`);
    const data = await res.json();
    openOrFocusTab(path, data.contents ?? "");
  }

  // ---------- Versions ----------

  const loadVersions = useCallback(async () => {
    const res = await fetch(`/api/themes/versions?themeId=${themeId}`);
    const data = await res.json();
    setVersions(data.versions ?? []);
  }, [themeId]);

  // ---------- Save file (manual + autosave) ----------

  const saveFile = useCallback(async () => {
    const active = getActiveTab();
    if (!active?.path) return;

    await fetch(`/api/themes/save`, {
      method: "POST",
      body: JSON.stringify({ themeId, path: active.path, contents: active.contents }),
    });

    setTabs((prev) =>
      prev.map((t) =>
        t.path === active.path ? { ...t, dirty: false } : t
      )
    );

    setPreviewKey((k) => k + 1);
    await loadVersions();
  }, [themeId, getActiveTab, loadVersions]);

  // Autosave every 2s if dirty
  useEffect(() => {
    const interval = setInterval(() => {
      const active = getActiveTab();
      if (active?.dirty) {
        saveFile();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [saveFile, getActiveTab]);

  // ---------- Keyboard shortcuts ----------

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMac = globalThis.navigator?.userAgent?.toLowerCase().includes("mac") ?? false;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      // Save: Ctrl+S / Cmd+S
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveFile();
      }

      // Quick open: Ctrl+P
      if (mod && e.key.toLowerCase() === "p") {
        e.preventDefault();
        setShowQuickOpen(true);
      }

      // Search in files: Ctrl+Shift+F
      if (mod && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setShowSearchPanel((v) => !v);
      }
    }

    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [saveFile]);

  // ---------- Versions ----------

  async function restoreVersion(timestamp: number) {
    await fetch(`/api/themes/versions/restore`, {
      method: "POST",
      body: JSON.stringify({ themeId, timestamp }),
    });

    if (activePath) {
      await openFile(activePath);
    }
    await loadVersions();
    setPreviewKey((k) => k + 1);
  }

  // ---------- AI helpers ----------

  async function runAiSuggestion(mode: "improve" | "refactor" | "section" | "fix" | "explain") {
    const active = getActiveTab();
    if (!active?.contents) return;

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/code-suggest", {
        method: "POST",
        body: JSON.stringify({
          code: active.contents,
          language: active.path.endsWith(".php") ? "php" : "liquid",
          goal: mode
        })
      });
      const data = await res.json();
      updateTabContents(active.path, data.suggestion ?? active.contents, true);
    } finally {
      setAiLoading(false);
    }
  }

  // ---------- Settings editor ----------

  async function openSettings() {
    setTabView("settings");
    setActivePath(settingsFile);

    const existing = tabs.find((t) => t.path === settingsFile);
    if (existing) return;

    const res = await fetch(`/api/themes/file?themeId=${themeId}&path=${encodeURIComponent(settingsFile)}`);
    if (res.ok) {
      const data = await res.json();
      openOrFocusTab(settingsFile, data.contents ?? "[]");
    } else {
      openOrFocusTab(settingsFile, "[]");
    }
  }

  // ---------- Search in files ----------

  async function runSearch() {
    if (!searchQuery.trim()) return;
    const res = await fetch(`/api/themes/search?themeId=${themeId}&q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    setSearchResults(data.results ?? []);
  }

  // ---------- Error diagnostics (simple) ----------

  const validateCurrent = useCallback(() => {
    const active = getActiveTab();
    if (!active) return;

    const errs: string[] = [];

    if (active.path.endsWith(".json")) {
      try {
        JSON.parse(active.contents);
      } catch (e: unknown) {
        errs.push(`JSON error: ${(e as Error).message}`);
      }
    }

    // (You can later plug real Liquid/PHP linters here)
    setErrors(errs);
  }, [getActiveTab]);

  useEffect(() => {
    validateCurrent();
  }, [activePath, tabs, validateCurrent]);

  const activeTab = getActiveTab();

  return (
    <div className="flex h-screen bg-[#050509] text-gray-100">
      {/* FILE TREE */}
      <div className="w-64 border-r border-gray-800 p-4 overflow-y-auto bg-[#0b0b10]">
        <h2 className="font-semibold mb-4 text-sm tracking-wide text-gray-300">
          Files
        </h2>
        {files.map((f) => (
          <button
            type="button"
            key={f.path}
            className={`flex items-center gap-2 p-2 text-sm cursor-pointer rounded-md transition-colors w-full text-left ${
              activePath === f.path
                ? "bg-blue-600 text-white"
                : "hover:bg-[#15151f]"
            }`}
            onClick={() => openFile(f.path)}
          >
            <span className="text-xs text-gray-400">
              {f.path.includes("/") ? "📄" : "📁"}
            </span>
            <span className="truncate">{f.path}</span>
          </button>
        ))}

        <div className="mt-6 space-y-2 text-xs text-gray-400">
          <button
            type="button"
            onClick={openSettings}
            className="w-full px-3 py-2 text-xs bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors"
          >
            Theme Settings (Shopify‑style)
          </button>
          <div className="mt-4">
            <div className="font-mono text-[10px] text-gray-500">
              Shortcuts:
            </div>
            <div>Ctrl+S — Save</div>
            <div>Ctrl+P — Quick Open</div>
            <div>Ctrl+Shift+F — Search</div>
          </div>
        </div>
      </div>

      {/* CENTER: TABS + EDITOR / VERSIONS / SETTINGS */}
      <div className="flex-1 flex flex-col">
        {/* Top bar: breadcrumbs + actions */}
        <div className="border-b border-gray-800 bg-[#05050b] px-4 py-2 flex items-center gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="text-gray-500">Theme</span>
            <span>/</span>
            <span className="text-gray-300">{themeId}</span>
            {activePath && (
              <>
                <span>/</span>
                <span className="text-gray-200">{activePath}</span>
              </>
            )}
          </div>

          <div className="ml-auto flex gap-2 items-center">
            <button
              type="button"
              onClick={() => runAiSuggestion("improve")}
              disabled={aiLoading}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {aiLoading ? "AI…" : "AI: Improve"}
            </button>
            <button
              type="button"
              onClick={() => runAiSuggestion("refactor")}
              disabled={aiLoading}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {aiLoading ? "AI…" : "AI: Refactor"}
            </button>
            <button
              type="button"
              onClick={() => runAiSuggestion("section")}
              disabled={aiLoading}
              className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {aiLoading ? "AI…" : "AI: Section"}
            </button>
            <button
              type="button"
              onClick={() => runAiSuggestion("fix")}
              disabled={aiLoading}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {aiLoading ? "AI…" : "AI: Fix"}
            </button>
            <button
              type="button"
              onClick={() => runAiSuggestion("explain")}
              disabled={aiLoading}
              className="px-3 py-1 text-xs bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              {aiLoading ? "AI…" : "AI: Explain"}
            </button>
            <button
              type="button"
              onClick={saveFile}
              className="ml-4 px-4 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Editor tabs */}
        <div className="flex border-b border-gray-800 bg-[#080812] px-2">
          {tabs.map((t) => (
            <button
              type="button"
              key={t.path}
              className={`flex items-center gap-2 px-3 py-1 text-xs rounded-t-md border-b-2 transition-colors ${
                t.path === activePath
                  ? "border-blue-500 text-white bg-[#101020]"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#11111a]"
              }`}
              onClick={() => {
                setActivePath(t.path);
                setTabView(t.path === settingsFile ? "settings" : "editor");
              }}
            >
              <span className="truncate max-w-[140px]">{t.path}</span>
              {t.dirty && <span className="text-blue-400">●</span>}
            </button>
          ))}
        </div>

        {/* Error panel */}
        {errors.length > 0 && (
          <div className="border-b border-red-900 bg-[#1a0505] px-4 py-2 text-xs text-red-300">
            {errors.map((e, i) => (
              <div key={`${e}-${i}`}>{e}</div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {tabView === "editor" && activeTab && (
            <Editor
              height="100%"
              theme="vs-dark"
              language={activeTab.path.endsWith(".php") ? "php" : "liquid"}
              value={activeTab.contents}
              onChange={(v) => updateTabContents(activeTab.path, v ?? "", true)}
              options={{
                minimap: { enabled: false },
                smoothScrolling: true,
                fontLigatures: true,
                fontSize: 13,
              }}
            />
          )}

          {tabView === "settings" && activeTab && (
            <Editor
              height="100%"
              theme="vs-dark"
              language="json"
              value={activeTab.contents}
              onChange={(v) => updateTabContents(activeTab.path, v ?? "", true)}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
              }}
            />
          )}

          {tabView === "versions" && (
            <div className="flex h-full">
              <div className="w-72 border-r border-gray-800 p-3 overflow-y-auto bg-[#080812]">
                {versions.map((v) => (
                  <div
                    key={v.timestamp}
                    className="mb-3 p-2 border border-gray-700 rounded-md text-xs bg-[#0c0c16]"
                  >
                    <div className="font-mono text-[10px] text-gray-400">
                      {new Date(v.timestamp).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-gray-300 truncate">
                      {v.path}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        className="px-2 py-1 text-[11px] bg-gray-700 rounded-md hover:bg-gray-600"
                        onClick={() => setSelectedVersion(v)}
                      >
                        View Diff
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-[11px] bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => restoreVersion(v.timestamp)}
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-1">
                {selectedVersion ? (
                  <DiffEditor
                    height="100%"
                    theme="vs-dark"
                    language={selectedVersion.path.endsWith(".php") ? "php" : "liquid"}
                    original={selectedVersion.old}
                    modified={selectedVersion.new}
                    options={{
                      renderSideBySide: true,
                      fontSize: 13,
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    Select a version to view diff
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar: search panel */}
        {showSearchPanel && (
          <div className="border-t border-gray-800 bg-[#05050b] px-4 py-2 text-xs flex items-center gap-3">
            <input
              className="flex-1 bg-[#10101a] border border-gray-700 rounded-md px-2 py-1 text-xs outline-none focus:border-blue-500"
              placeholder="Search in theme files…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
            />
            <button
              type="button"
              onClick={runSearch}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowSearchPanel(false)}
              className="px-2 py-1 text-gray-400 hover:text-gray-200"
            >
              Close
            </button>
          </div>
        )}

        {showSearchPanel && searchResults.length > 0 && (
          <div className="border-t border-gray-800 bg-[#080812] px-4 py-2 text-xs max-h-40 overflow-y-auto">
            {searchResults.map((r) => (
              <button
                type="button"
                key={r.path}
                className="py-1 cursor-pointer hover:bg-[#11111c] rounded-md px-2 w-full text-left"
                onClick={() => {
                  openFile(r.path);
                  setShowSearchPanel(false);
                }}
              >
                <div className="text-gray-300">{r.path}</div>
                <div className="text-[11px] text-gray-500">
                  Line {r.line}: {r.snippet}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PREVIEW */}
      <div className="w-[40%] border-l border-gray-800 bg-[#05050b]">
        <iframe
          key={previewKey}
          src={`/api/themes/preview?id=${themeId}`}
          title={`Preview of theme ${themeId}`}
          className="w-full h-full transition-opacity duration-300"
        />
      </div>

      {/* Quick Open Modal */}
      {showQuickOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center pt-24 z-50">
          <div className="w-[480px] bg-[#05050b] border border-gray-800 rounded-lg shadow-xl">
            <div className="border-b border-gray-800 px-3 py-2 text-xs text-gray-400">
              Quick Open (type to filter, Enter to open, Esc to close)
            </div>
            <QuickOpenInner
              files={files}
              onClose={() => setShowQuickOpen(false)}
              onOpen={(path) => {
                openFile(path);
                setShowQuickOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickOpenInner({
  files,
  onClose,
  onOpen
}: Readonly<{
  files: FileEntry[];
  onClose: () => void;
  onOpen: (path: string) => void;
}>) {
  const [query, setQuery] = useState("");
  const filtered = files.filter((f) =>
    f.path.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="flex flex-col">
      <input
        autoFocus
        className="w-full bg-[#10101a] border-b border-gray-800 px-3 py-2 text-sm outline-none text-gray-100"
        placeholder="Search files…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filtered[0]) {
            onOpen(filtered[0].path);
          }
        }}
      />
      <div className="max-h-64 overflow-y-auto text-sm">
        {filtered.map((f) => (
          <button
            type="button"
            key={f.path}
            className="px-3 py-1 cursor-pointer hover:bg-[#151520] w-full text-left"
            onClick={() => onOpen(f.path)}
          >
            {f.path}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-2 text-xs text-gray-500">
            No matches
          </div>
        )}
      </div>
    </div>
  );
}
