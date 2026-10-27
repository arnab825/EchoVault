"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  Layers,
  Plus,
  FolderArchive,
  ArrowRight,
  Trash2,
  Calendar,
  X
} from "lucide-react";
import { fetchCollections, createCollection, deleteCollection } from "@/lib/api";
import { Collection } from "@/lib/types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    setLoading(true);
    try {
      const data = await fetchCollections();
      setCollections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await createCollection(newTitle, newDesc);
      setNewTitle("");
      setNewDesc("");
      setShowCreateModal(false);
      await loadCollections();
    } catch (e) {
      alert("Failed to create collection: " + (e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(colId: string, title: string) {
    if (!confirm(`Delete collection "${title}"? Memories will remain in the library.`)) return;
    try {
      await deleteCollection(colId);
      await loadCollections();
    } catch (e) {
      alert("Failed to delete collection: " + (e as Error).message);
    }
  }

  return (
    <AppShell
      pageTitle="Thematic Collections"
      pageDescription="Organize letters, oral histories, and family photographs into curated remembrance binders."
    >
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between pb-4 border-b border-vault-800">
          <div>
            <h3 className="font-serif text-xl font-medium text-ivory-100">
              Curated Collections ({collections.length})
            </h3>
            <p className="text-xs text-ivory-400">
              Thematic groupings preserving interconnected family narratives.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-sm text-ivory-400">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-vault-800 bg-vault-900/60 space-y-3">
            <Layers className="w-10 h-10 mx-auto text-vault-600" />
            <h3 className="font-serif text-lg text-ivory-100 font-medium">No collections created yet</h3>
            <p className="text-xs text-ivory-400 max-w-sm mx-auto">
              Group memories into binders like &ldquo;Wartime Correspondence&rdquo; or &ldquo;Culinary Traditions&rdquo;.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs"
            >
              Create First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collections.map((col) => (
              <div
                key={col.id}
                className="p-5 rounded-lg bg-vault-900 border border-vault-800 hover:border-gold-500/40 transition-all flex flex-col justify-between archival-paper-card"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gold-400 bg-gold-500/15 px-2 py-0.5 rounded border border-gold-500/30">
                      {col.memory_count} {col.memory_count === 1 ? "Record" : "Records"}
                    </span>
                    <button
                      onClick={() => handleDelete(col.id, col.title)}
                      className="p-1 text-vault-600 hover:text-red-400 rounded transition-colors"
                      title="Delete collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link href={`/app/collections/${col.id}`}>
                    <h4 className="font-serif text-lg font-medium text-ivory-100 hover:text-gold-300 transition-colors">
                      {col.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-ivory-300 leading-relaxed font-light line-clamp-3">
                    {col.description || "No description provided for this collection."}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-vault-800/80 flex items-center justify-between text-xs text-ivory-400 font-mono">
                  <span>ID: {col.id}</span>
                  <Link
                    href={`/app/collections/${col.id}`}
                    className="text-gold-400 hover:text-gold-300 flex items-center space-x-1 font-medium text-[11px]"
                  >
                    <span>View Binder</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-vault-900 border border-vault-750 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-vault-800 pb-3">
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  Create Thematic Collection
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-ivory-400 hover:text-ivory-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-gold-400">
                    Collection Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Wartime Letters (1939-1945)"
                    className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-sm text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-ivory-400">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Recollections and letters written during military service..."
                    className="w-full bg-vault-950 border border-vault-750 rounded p-3 text-xs text-ivory-200 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs text-ivory-400 hover:text-ivory-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs"
                  >
                    {creating ? "Creating..." : "Save Collection"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
