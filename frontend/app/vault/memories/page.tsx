"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  FolderArchive,
  Search,
  Grid,
  List as ListIcon,
  Trash2,
  Calendar,
  ArrowRight,
  Plus,
  FileText,
  AlertTriangle
} from "lucide-react";
import { fetchMemories, deleteMemory } from "@/lib/api";
import { Memory, SourceType } from "@/lib/types";

export default function MemoriesLibraryPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<SourceType | "">("");
  const [sortBy, setSortBy] = useState<"created_at" | "event_date" | "title">("created_at");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteTarget, setDeleteTarget] = useState<Memory | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMemories();
  }, [searchQuery, selectedType, sortBy]);

  async function loadMemories() {
    setLoading(true);
    try {
      const data = await fetchMemories({
        q: searchQuery || undefined,
        source_type: selectedType ? (selectedType as SourceType) : undefined,
        sort_by: sortBy,
        sort_order: sortBy === "title" ? "asc" : "desc",
      });
      setMemories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMemory(deleteTarget.id);
      setDeleteTarget(null);
      await loadMemories();
    } catch (e) {
      alert("Delete failed: " + (e as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  const sourceTypes: SourceType[] = [
    "letter",
    "story",
    "document",
    "photograph",
    "recording",
    "note",
  ];

  return (
    <AppShell
      pageTitle="Memory Library"
      pageDescription="Search, inspect, and organize indexed letters, photographs, and oral histories."
    >
      <div className="space-y-6">
        {/* HEADER CONTROLS BAR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-vault-900 p-4 rounded-lg border border-vault-800 animate-fade-up">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ivory-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across title, text, and descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-vault-950 border border-vault-750 rounded pl-9 pr-4 py-2 text-sm text-ivory-100 placeholder:text-ivory-500 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Filters & View Controls */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 md:pb-0">
            {/* Source Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as SourceType | "")}
              className="bg-vault-950 border border-vault-750 text-xs text-ivory-200 rounded px-3 py-2 focus:outline-none focus:border-gold-500"
            >
              <option value="">All Formats</option>
              {sourceTypes.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-vault-950 border border-vault-750 text-xs text-ivory-200 rounded px-3 py-2 focus:outline-none focus:border-gold-500"
            >
              <option value="created_at">Recently Added</option>
              <option value="event_date">Historical Date</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded border border-vault-750 bg-vault-950 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-vault-800 text-gold-400" : "text-ivory-400"}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-vault-800 text-gold-400" : "text-ivory-400"}`}
                aria-label="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Add CTA */}
            <Link
              href="/app/import"
              className="px-3.5 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 text-xs font-semibold inline-flex items-center space-x-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import</span>
            </Link>
          </div>
        </div>

        {/* MEMORY ITEMS CONTENT */}
        {loading ? (
          <div className="py-20 text-center text-ivory-400 font-mono text-sm">
            Searching archive index...
          </div>
        ) : memories.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-vault-800 bg-vault-900/60 space-y-3">
            <FolderArchive className="w-10 h-10 mx-auto text-vault-600" />
            <h3 className="font-serif text-lg text-ivory-100 font-medium">No matching memories found</h3>
            <p className="text-xs text-ivory-400 max-w-sm mx-auto">
              Try adjusting your search terms or filters, or import a new letter or photograph.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-up animate-delay-1">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="group relative flex flex-col justify-between p-5 rounded-lg bg-vault-900 border border-vault-800 hover:border-gold-500/40 transition-all archival-paper-card"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-vault-850 text-gold-400 border border-gold-500/20">
                      {mem.source_type}
                    </span>
                    <button
                      onClick={() => setDeleteTarget(mem)}
                      className="text-vault-600 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/app/memories/${mem.id}`} className="block group-hover:text-gold-300 transition-colors">
                    <h4 className="font-serif text-lg font-medium text-ivory-100 leading-snug">
                      {mem.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-ivory-300 line-clamp-3 leading-relaxed font-light">
                    {mem.description || mem.extracted_text}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-vault-800/80 flex items-center justify-between text-xs text-ivory-400 font-mono">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>{mem.event_date || "Undated"}</span>
                  </div>
                  <Link
                    href={`/app/memories/${mem.id}`}
                    className="text-gold-400 hover:text-gold-300 flex items-center space-x-1 font-medium text-[11px]"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="rounded-lg border border-vault-800 bg-vault-900 divide-y divide-vault-800/80 overflow-hidden animate-fade-up animate-delay-1">
            {memories.map((mem) => (
              <div key={mem.id} className="p-4 flex items-center justify-between hover:bg-vault-850/60 transition-colors">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded bg-vault-800 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/app/memories/${mem.id}`}
                      className="font-serif text-base font-medium text-ivory-100 hover:text-gold-300 transition-colors truncate block"
                    >
                      {mem.title}
                    </Link>
                    <div className="flex items-center space-x-3 text-xs text-ivory-400 mt-0.5">
                      <span className="font-mono text-gold-400 capitalize">{mem.source_type}</span>
                      <span>&bull;</span>
                      <span className="font-mono">{mem.event_date || "Undated"}</span>
                      {mem.tags && mem.tags.length > 0 && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate max-w-xs">{mem.tags.join(", ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 ml-4">
                  <Link
                    href={`/app/memories/${mem.id}`}
                    className="text-xs text-gold-400 hover:text-gold-300 px-3 py-1.5 rounded border border-vault-700 bg-vault-850"
                  >
                    View Record
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(mem)}
                    className="p-1.5 text-vault-600 hover:text-red-400 rounded transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-vault-900 border border-red-500/30 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  Confirm Memory Deletion
                </h3>
              </div>
              <p className="text-xs text-ivory-300 leading-relaxed">
                Are you sure you want to permanently delete <strong>&ldquo;{deleteTarget.title}&rdquo;</strong>?
                This will purge the memory, its vector embeddings, and original file from your local storage.
              </p>
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded text-xs text-ivory-300 hover:bg-vault-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
