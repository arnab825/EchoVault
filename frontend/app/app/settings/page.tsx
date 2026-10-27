"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Cpu,
  Database,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import {
  fetchSystemStatus,
  fetchSettings,
  updateSettings,
  rebuildVectorIndex,
  resetVaultData,
  getExportArchiveUrl
} from "@/lib/api";
import { SystemStatus } from "@/lib/types";

export default function SettingsPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState("");
  const [ollamaModel, setOllamaModel] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuildResult, setRebuildResult] = useState<string | null>(null);

  // Reset dialog state
  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const [statusRes, settingsRes] = await Promise.all([
        fetchSystemStatus(),
        fetchSettings(),
      ]);
      setStatus(statusRes);
      setOllamaBaseUrl(settingsRes.ollama_base_url || "");
      setOllamaModel(settingsRes.ollama_model || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettings({
        ollama_base_url: ollamaBaseUrl,
        ollama_model: ollamaModel,
      });
      await loadSettings();
      alert("Settings updated successfully.");
    } catch (e) {
      alert("Failed to update settings: " + (e as Error).message);
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleRebuildIndex() {
    if (!confirm("Rebuild vector index for all stored passages?")) return;
    setRebuilding(true);
    setRebuildResult(null);
    try {
      const res = await rebuildVectorIndex();
      setRebuildResult(`Index rebuilt: ${res.indexed_passages} passages indexed.`);
      await loadSettings();
    } catch (e) {
      alert("Rebuild failed: " + (e as Error).message);
    } finally {
      setRebuilding(false);
    }
  }

  async function handleResetData() {
    if (confirmPhrase !== "DELETE_ALL_MEMORIES") {
      alert("Confirmation phrase must be exactly 'DELETE_ALL_MEMORIES'.");
      return;
    }
    setResetting(true);
    try {
      await resetVaultData(confirmPhrase);
      setShowResetModal(false);
      setConfirmPhrase("");
      await loadSettings();
      alert("All vault archives and records have been permanently erased.");
    } catch (e) {
      alert("Reset failed: " + (e as Error).message);
    } finally {
      setResetting(false);
    }
  }

  return (
    <AppShell
      pageTitle="Vault Settings & Diagnostics"
      pageDescription="Configure local model inference, inspect storage, export archives, or rebuild search indices."
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* RUNTIME INTEGRITY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
          <div className="p-4 rounded-lg bg-vault-900 border border-vault-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-ivory-400">Database Engine</span>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  status?.database_connected ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span className="font-mono text-sm font-semibold text-ivory-100">
                {status?.database_connected ? "SQLite 3 (Operational)" : "Disconnected"}
              </span>
            </div>
            <p className="text-[11px] text-ivory-400 font-mono">
              {status?.total_memories ?? 0} memories &bull; WAL Mode
            </p>
          </div>

          <div className="p-4 rounded-lg bg-vault-900 border border-vault-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-ivory-400">AI Model Runtime</span>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  status?.ollama_connected ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span className="font-mono text-sm font-semibold text-ivory-100">
                {status?.ollama_connected ? "Ollama Connected" : "Offline Fallback"}
              </span>
            </div>
            <p className="text-[11px] text-ivory-400 font-mono truncate">
              {status?.active_model}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-vault-900 border border-vault-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-ivory-400">Archive Storage</span>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gold-400" />
              <span className="font-mono text-sm font-semibold text-ivory-100">
                {((status?.total_storage_bytes ?? 0) / 1024).toFixed(1)} KB
              </span>
            </div>
            <p className="text-[11px] text-ivory-400 font-mono">
              Local filesystem only
            </p>
          </div>
        </div>

        {/* MODEL CONFIGURATION */}
        <form onSubmit={handleSaveSettings} className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-5 animate-fade-up animate-delay-1">
          <div className="flex items-center justify-between border-b border-vault-800 pb-3">
            <div>
              <h3 className="font-serif text-lg font-medium text-ivory-100 flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-gold-400" />
                <span>Open-Weight AI Model Settings</span>
              </h3>
              <p className="text-xs text-ivory-400 font-light">
                Configure your local Ollama instance or container network address.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono uppercase text-gold-400">Ollama Base URL</label>
              <input
                type="text"
                value={ollamaBaseUrl}
                onChange={(e) => setOllamaBaseUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 font-mono focus:outline-none focus:border-gold-500"
              />
              <span className="text-[11px] text-ivory-500">
                For Podman on Linux/WSL: http://host.containers.internal:11434
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase text-gold-400">Active Instruction Model</label>
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="llama3.2:3b, qwen2.5:1.5b, mistral, etc."
                className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 font-mono focus:outline-none focus:border-gold-500"
              />
              <span className="text-[11px] text-ivory-500">
                Any open-weight model pulled into your local Ollama library.
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={savingSettings || loading}
              className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs transition-all shadow-sm"
            >
              {savingSettings ? "Updating..." : "Save Model Settings"}
            </button>
          </div>
        </form>

        {/* ARCHIVE EXPORT & DATA LIFECYCLE */}
        <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-5">
          <div className="border-b border-vault-800 pb-3">
            <h3 className="font-serif text-lg font-medium text-ivory-100 flex items-center space-x-2">
              <Download className="w-4 h-4 text-gold-400" />
              <span>Archive Export & Portability</span>
            </h3>
            <p className="text-xs text-ivory-400 font-light">
              EchoVault guarantees full data sovereignty. You can download or purge your records at any time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded bg-vault-950 border border-vault-800">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-ivory-100">
                Download Self-Contained ZIP Bundle
              </h4>
              <p className="text-xs text-ivory-400 max-w-md leading-relaxed">
                Produces a standalone ZIP file with raw documents, database JSON dump, timeline items, and vector index.
              </p>
            </div>
            <a
              href={getExportArchiveUrl()}
              download
              className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-flex items-center space-x-2 shrink-0 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Archive (.ZIP)</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded bg-vault-950 border border-vault-800">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-ivory-100">
                Rebuild Vector Search Index
              </h4>
              <p className="text-xs text-ivory-400 max-w-md leading-relaxed">
                Re-chunks all stored documents and updates semantic cosine similarity embeddings.
              </p>
              {rebuildResult && (
                <p className="text-xs text-emerald-400 font-mono">{rebuildResult}</p>
              )}
            </div>
            <button
              onClick={handleRebuildIndex}
              disabled={rebuilding}
              className="px-4 py-2 rounded border border-vault-700 bg-vault-850 hover:bg-vault-800 text-ivory-200 text-xs font-medium inline-flex items-center space-x-2 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rebuilding ? "animate-spin" : ""}`} />
              <span>{rebuilding ? "Rebuilding..." : "Rebuild Index"}</span>
            </button>
          </div>

          {/* DANGER ZONE: DATA RESET */}
          <div className="pt-4 border-t border-vault-800/80">
            <div className="p-4 rounded bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-red-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Irreversible Archive Purge</span>
                </h4>
                <p className="text-xs text-ivory-400 max-w-md leading-relaxed">
                  Permanently delete all memories, indexed vectors, uploaded files, and tributes.
                </p>
              </div>
              <button
                onClick={() => setShowResetModal(true)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-xs inline-flex items-center space-x-1.5 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>Erase All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* RESET CONFIRMATION MODAL */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-vault-900 border border-red-500/50 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  Critical Data Reset Warning
                </h3>
              </div>
              <p className="text-xs text-ivory-300 leading-relaxed">
                This action will permanently delete every stored memory, document, audio recording, and timeline entry.
                To confirm, type <strong>DELETE_ALL_MEMORIES</strong> in the box below:
              </p>
              <input
                type="text"
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                placeholder="DELETE_ALL_MEMORIES"
                className="w-full bg-vault-950 border border-red-500/40 rounded px-3 py-2 text-xs text-ivory-100 font-mono focus:outline-none focus:border-red-500"
              />
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setConfirmPhrase("");
                  }}
                  disabled={resetting}
                  className="px-4 py-2 rounded text-xs text-ivory-400 hover:bg-vault-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetData}
                  disabled={resetting || confirmPhrase !== "DELETE_ALL_MEMORIES"}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-semibold"
                >
                  {resetting ? "Erasing..." : "Permanently Purge All Data"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
