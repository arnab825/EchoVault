"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
  Tag,
  ArrowRight,
  Info,
  X
} from "lucide-react";
import { createMemory } from "@/lib/api";
import { SourceType, DatePrecision } from "@/lib/types";

export default function ImportMemoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("letter");
  const [description, setDescription] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [datePrecision, setDatePrecision] = useState<DatePrecision>("exact");
  const [tagsInput, setTagsInput] = useState("");

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  function handleFileSelect(selected: File) {
    setErrorMsg(null);
    setFile(selected);

    // Auto-populate title if empty
    if (!title) {
      const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      setTitle(nameWithoutExt);
    }

    // Auto-detect source type from extension
    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || ext === "txt" || ext === "md") {
      setSourceType(selected.name.toLowerCase().includes("letter") ? "letter" : "document");
    } else if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
      setSourceType("photograph");
    } else if (["mp3", "wav", "m4a"].includes(ext || "")) {
      setSourceType("recording");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please provide a title for this memory.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("source_type", sourceType);
      if (description) formData.append("description", description);
      if (extractedText) formData.append("extracted_text", extractedText);
      if (eventDate) formData.append("event_date", eventDate);
      formData.append("date_precision", datePrecision);

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(parsedTags));

      if (file) {
        formData.append("file", file);
      }

      const created = await createMemory(formData);
      setSuccessId(created.id);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell
      pageTitle="Import & Ingest Memory"
      pageDescription="Upload letters, transcripts, photos, and memoirs for local indexing."
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* SUCCESS NOTIFICATION */}
        {successId && (
          <div className="p-6 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 font-medium">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Memory successfully indexed and added to the vault!</span>
            </div>
            <p className="text-xs text-emerald-300 leading-relaxed font-light">
              Your document has been cryptographically validated, divided into bounded passages, and indexed into the local vector store.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <Link
                href={`/app/memories/${successId}`}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-vault-950 font-semibold text-xs inline-flex items-center space-x-1.5 shadow"
              >
                <span>View Memory Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/app/ask"
                className="text-xs text-emerald-300 hover:text-white underline font-mono"
              >
                Ask a question about this memory
              </Link>
            </div>
          </div>
        )}

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="p-4 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Ingestion Notice</span>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* UPLOAD FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DRAG AND DROP ZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
              }
            }}
            className={`relative p-8 rounded-lg border-2 border-dashed transition-all text-center ${
              isDragging
                ? "border-gold-500 bg-vault-850"
                : file
                ? "border-emerald-500/50 bg-vault-900"
                : "border-vault-750 bg-vault-900/60 hover:border-gold-500/40"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
              accept=".txt,.md,.pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a"
            />

            {file ? (
              <div className="flex items-center justify-between p-3 rounded bg-vault-850 border border-vault-700 text-left">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gold-400 shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-ivory-100 truncate">{file.name}</p>
                    <p className="text-[11px] text-ivory-400 font-mono">
                      {(file.size / 1024).toFixed(1)} KB &bull; Ready for extraction
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1 rounded text-vault-500 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-vault-850 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gold-400 hover:text-gold-300 font-medium text-sm underline focus:outline-none"
                  >
                    Click to choose a file
                  </button>
                  <span className="text-ivory-400 text-sm"> or drag and drop here</span>
                </div>
                <p className="text-xs text-ivory-500 font-mono">
                  Supported formats: PDF, TXT, Markdown, Images (PNG, JPG), Audio (MP3, WAV) &bull; Max 50MB
                </p>
              </div>
            )}
          </div>

          {/* METADATA FIELDS */}
          <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-5">
            <h3 className="font-serif text-lg font-medium text-ivory-100 border-b border-vault-800 pb-3">
              Memory Metadata
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-gold-400">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Letter from Florence, Spring 1944"
                  className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-sm text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-ivory-400">Source Format</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as SourceType)}
                  className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-xs text-ivory-200 focus:outline-none focus:border-gold-500 capitalize"
                >
                  <option value="letter">Letter / Correspondence</option>
                  <option value="story">Family Story / Memoir</option>
                  <option value="document">Historical Document / PDF</option>
                  <option value="photograph">Photograph with Context</option>
                  <option value="recording">Oral History Audio</option>
                  <option value="note">Short Personal Note</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-ivory-400">Historical Date</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. 1944-03-14 or 1952"
                  className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-xs text-ivory-100 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-ivory-400">Date Precision</label>
                <select
                  value={datePrecision}
                  onChange={(e) => setDatePrecision(e.target.value as DatePrecision)}
                  className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-xs text-ivory-200 focus:outline-none focus:border-gold-500 capitalize"
                >
                  <option value="exact">Exact (Confirmed date)</option>
                  <option value="month">Month & Year only</option>
                  <option value="year">Year only</option>
                  <option value="approximate">Approximate (Circa / Estimated)</option>
                  <option value="unknown">Unknown timeframe</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-ivory-400">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="wwii, sussex, wedding, recipe"
                  className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-xs text-ivory-100 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-ivory-400">
                  Description / Archival Context
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Found in cedar chest; refers to grandfather's departure for the naval base..."
                  className="w-full bg-vault-950 border border-vault-750 rounded p-3 text-xs text-ivory-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase text-ivory-400">
                  Text Content / Transcript (Optional if uploading file)
                </label>
                <textarea
                  rows={6}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Paste letter text or oral history transcript directly here if you don't have a file..."
                  className="w-full bg-vault-950 border border-vault-750 rounded p-3 text-xs text-ivory-100 font-serif leading-relaxed focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-vault-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-xs text-ivory-400 hover:text-ivory-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-flex items-center space-x-2 shadow-sm transition-all"
              >
                {uploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-vault-950 border-t-transparent rounded-full animate-spin" />
                    <span>Extracting & Indexing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Index & Save Memory</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
