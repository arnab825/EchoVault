"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  Trash2,
  Save,
  CheckCircle,
  Download,
  AlertTriangle
} from "lucide-react";
import { fetchMemory, updateMemory, deleteMemory } from "@/lib/api";
import { Memory, DatePrecision } from "@/lib/types";

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [datePrecision, setDatePrecision] = useState<DatePrecision>("exact");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (id) {
      loadRecord();
    }
  }, [id]);

  async function loadRecord() {
    setLoading(true);
    try {
      const data = await fetchMemory(id);
      setMemory(data);
      setTitle(data.title);
      setDescription(data.description || "");
      setExtractedText(data.extracted_text || "");
      setEventDate(data.event_date || "");
      setDatePrecision(data.date_precision);
      setTagsInput(data.tags.join(", "));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updatedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const updated = await updateMemory(id, {
        title,
        description,
        extracted_text: extractedText,
        event_date: eventDate || null,
        date_precision: datePrecision,
        tags: updatedTags,
      });

      setMemory(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save changes: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMemory(id);
      router.push("/app/memories");
    } catch (e) {
      alert("Deletion failed: " + (e as Error).message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AppShell pageTitle="Loading Memory Record...">
        <div className="py-20 text-center font-mono text-sm text-ivory-400">
          Retrieving archival memory record...
        </div>
      </AppShell>
    );
  }

  if (!memory) {
    return (
      <AppShell pageTitle="Memory Not Found">
        <div className="py-12 text-center space-y-4">
          <p className="text-ivory-300">The requested memory could not be found or has been removed.</p>
          <Link href="/app/memories" className="text-gold-400 underline font-mono text-xs">
            Return to Memory Library
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle={memory.title} pageDescription="Inspect evidence, edit metadata, and view indexed RAG passages.">
      <div className="space-y-6 max-w-5xl">
        {/* TOP BAR NAVIGATION & ACTIONS */}
        <div className="flex items-center justify-between pb-4 border-b border-vault-800">
          <Link
            href="/app/memories"
            className="text-xs text-ivory-400 hover:text-gold-300 inline-flex items-center space-x-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Library</span>
          </Link>

          <div className="flex items-center space-x-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Changes Persisted</span>
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-1.5 rounded text-vault-500 hover:text-red-400 hover:bg-vault-850 transition-colors"
              title="Delete memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* METADATA & SOURCE DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: Content & Text Editor */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-gold-400">Record Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-vault-900 border border-vault-750 rounded px-3.5 py-2 text-base font-serif text-ivory-100 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-ivory-400">Contextual Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Where was this found? Who does it relate to?"
                className="w-full bg-vault-900 border border-vault-750 rounded p-3 text-xs text-ivory-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-gold-400">
                  Extracted Archival Text
                </label>
                <span className="text-[11px] font-mono text-ivory-500">
                  Method: {memory.extraction_method}
                </span>
              </div>
              <textarea
                rows={12}
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full font-serif bg-vault-950 border border-vault-800 rounded p-4 text-sm text-ivory-100 leading-relaxed focus:outline-none focus:border-gold-500 selection:bg-gold-500/30"
              />
              <p className="text-[11px] text-ivory-500 font-mono">
                Editing text triggers automatic passage re-chunking and vector re-indexing for semantic search.
              </p>
            </div>
          </div>

          {/* Right Col: Archival Metadata Card & Indexed Passages */}
          <div className="space-y-6">
            <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 space-y-4">
              <h4 className="text-xs font-mono uppercase text-gold-400 border-b border-vault-800 pb-2">
                Archival Provenance
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-ivory-400 mb-1">Source Format</label>
                  <span className="inline-block px-2.5 py-1 rounded bg-vault-800 border border-gold-500/20 text-gold-400 uppercase font-mono text-[11px]">
                    {memory.source_type}
                  </span>
                </div>

                <div>
                  <label className="block text-ivory-400 mb-1">Historical Date</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="YYYY-MM-DD or YYYY"
                    className="w-full bg-vault-950 border border-vault-750 rounded px-2.5 py-1.5 text-xs text-ivory-100 font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-ivory-400 mb-1">Date Precision</label>
                  <select
                    value={datePrecision}
                    onChange={(e) => setDatePrecision(e.target.value as DatePrecision)}
                    className="w-full bg-vault-950 border border-vault-750 rounded px-2.5 py-1.5 text-xs text-ivory-200 focus:outline-none focus:border-gold-500 capitalize"
                  >
                    <option value="exact">Exact Date</option>
                    <option value="month">Month & Year</option>
                    <option value="year">Year Only</option>
                    <option value="approximate">Approximate (Circa)</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ivory-400 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="letter, wartime, sussex"
                    className="w-full bg-vault-950 border border-vault-750 rounded px-2.5 py-1.5 text-xs text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                {memory.file_path && (
                  <div className="pt-2 border-t border-vault-800">
                    <label className="block text-ivory-400 mb-1">Stored Source Asset</label>
                    <a
                      href={`/${memory.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold-400 hover:text-gold-300 font-mono flex items-center space-x-1 underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{memory.original_filename || "Download File"}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Indexed Chunks / Passages */}
            <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 space-y-3">
              <h4 className="text-xs font-mono uppercase text-gold-400">
                Indexed Evidence Passages ({memory.passages?.length || 0})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {memory.passages?.map((p, idx) => (
                  <div key={p.id} className="p-2.5 rounded bg-vault-950 border border-vault-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-gold-400/80 font-mono">
                      <span>Passage [{idx + 1}]</span>
                      {p.page_number && <span>Page {p.page_number}</span>}
                    </div>
                    <p className="text-ivory-300 font-serif leading-relaxed line-clamp-3">
                      {p.passage_text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-vault-900 border border-red-500/30 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  Delete Memory Record
                </h3>
              </div>
              <p className="text-xs text-ivory-300 leading-relaxed">
                Permanently purge &ldquo;{memory.title}&rdquo;? All embeddings and local files will be erased.
              </p>
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded text-xs text-ivory-300 hover:bg-vault-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
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
