"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  FolderArchive,
  MessageSquareQuote,
  Clock,
  Layers,
  UploadCloud,
  Cpu,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  Tag,
  AlertTriangle,
  FileText
} from "lucide-react";
import { fetchSystemStatus, fetchMemories, fetchTimeline, seedSampleData } from "@/lib/api";
import { SystemStatus, Memory, TimelineEvent } from "@/lib/types";

export default function DashboardPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statusData, memoriesData, timelineData] = await Promise.all([
        fetchSystemStatus(),
        fetchMemories({ sort_by: "created_at", sort_order: "desc" }),
        fetchTimeline(),
      ]);
      setStatus(statusData);
      setMemories(memoriesData);
      setTimeline(timelineData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedDemo() {
    setSeeding(true);
    try {
      await seedSampleData();
      await loadData();
    } catch (e) {
      alert("Failed to seed sample memories: " + (e as Error).message);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <AppShell pageTitle="Archive Overview" pageDescription="Preserve your private records and rediscover connected memories.">
      <div className="space-y-8">
        {/* TOP STATUS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Memories */}
          <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-ivory-400">Total Memories</p>
              <h3 className="text-2xl font-serif font-bold text-ivory-100 mt-1">
                {loading ? "..." : status?.total_memories ?? 0}
              </h3>
              <p className="text-[11px] text-gold-400/90 font-mono mt-1">
                {status ? `${status.total_passages} indexed passages` : "Connecting..."}
              </p>
            </div>
            <div className="w-10 h-10 rounded bg-vault-850 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <FolderArchive className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Timeline Events */}
          <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-ivory-400">Timeline Events</p>
              <h3 className="text-2xl font-serif font-bold text-ivory-100 mt-1">
                {loading ? "..." : status?.total_timeline_events ?? 0}
              </h3>
              <p className="text-[11px] text-ivory-400 font-mono mt-1">
                Chronologically mapped
              </p>
            </div>
            <div className="w-10 h-10 rounded bg-vault-850 border border-vault-700 flex items-center justify-center text-ivory-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Inference Model */}
          <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-ivory-400">Active AI Model</p>
              <h3 className="text-base font-mono font-medium text-gold-300 mt-1 truncate max-w-35">
                {loading ? "..." : status?.active_model || "Local Llama 3.2"}
              </h3>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-mono mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{status?.ollama_connected ? "Ollama Engine Ready" : "Offline Grounded Engine"}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded bg-vault-850 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Local Storage */}
          <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-ivory-400">Local Storage</p>
              <h3 className="text-2xl font-serif font-bold text-ivory-100 mt-1">
                {loading ? "..." : `${((status?.total_storage_bytes ?? 0) / 1024).toFixed(1)} KB`}
              </h3>
              <p className="text-[11px] text-ivory-400 font-mono mt-1">
                SQLite &bull; Air-gapped
              </p>
            </div>
            <div className="w-10 h-10 rounded bg-vault-850 border border-vault-700 flex items-center justify-center text-ivory-300">
              <Database className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* QUICK SHORTCUTS & ACTION BANNER */}
        <div className="p-6 rounded-lg bg-linear-to-r from-vault-900 to-vault-850 border border-gold-500/20 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-medium text-ivory-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Ask questions about your memories</span>
            </h2>
            <p className="text-xs text-ivory-300 max-w-xl">
              EchoVault’s conversational search verifies claims against actual letters and oral accounts, providing clickable citations without making up dates or missing ancestors.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/app/ask"
              className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 text-sm font-semibold inline-flex items-center space-x-2 shadow-sm transition-all"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Ask the Archive</span>
            </Link>
            <Link
              href="/app/import"
              className="px-3.5 py-2 rounded border border-vault-700 hover:border-vault-600 text-ivory-200 text-sm font-medium transition-colors"
            >
              Upload Record
            </Link>
          </div>
        </div>

        {/* EMPTY ARCHIVE CALLOUT OR RECENT RECORDS */}
        {memories.length === 0 && !loading ? (
          <div className="p-12 text-center rounded-lg border border-dashed border-vault-700 bg-vault-900/50 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-vault-850 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <FolderArchive className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-ivory-100">
              Your archive vault is currently empty
            </h3>
            <p className="text-xs text-ivory-400 max-w-md mx-auto leading-relaxed">
              Start by importing an old letter, photograph, or memoir transcript. You can also explore the synthetic sample data set to verify how evidence-grounded search functions.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/app/import"
                className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs"
              >
                Import First Memory
              </Link>
              <button
                onClick={handleSeedDemo}
                disabled={seeding}
                className="px-4 py-2 rounded border border-vault-700 bg-vault-850 text-ivory-200 text-xs hover:border-gold-500/40"
              >
                {seeding ? "Seeding Records..." : "Load Sample Demonstration Data"}
              </button>
            </div>
          </div>
        ) : (
          /* TWO COLUMN LAYOUT: RECENT MEMORIES & TIMELINE SNIPPET */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Recent Additions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium text-ivory-100 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gold-400" />
                  <span>Recent Archive Additions</span>
                </h3>
                <Link href="/app/memories" className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center space-x-1">
                  <span>View all ({memories.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {memories.slice(0, 5).map((mem) => (
                  <Link
                    key={mem.id}
                    href={`/app/memories/${mem.id}`}
                    className="block p-4 rounded-lg bg-vault-900 border border-vault-800 hover:border-gold-500/40 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-vault-800 text-gold-400 border border-gold-500/20">
                            {mem.source_type}
                          </span>
                          {mem.event_date && (
                            <span className="text-xs text-ivory-400 font-mono flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-vault-500" />
                              <span>{mem.event_date}</span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-base font-medium text-ivory-100">
                          {mem.title}
                        </h4>
                        <p className="text-xs text-ivory-400 line-clamp-2 leading-relaxed">
                          {mem.description || mem.extracted_text}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-vault-600 mt-2 shrink-0" />
                    </div>

                    {mem.tags && mem.tags.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-vault-800/60 flex flex-wrap gap-1.5">
                        {mem.tags.map((t) => (
                          <span key={t} className="text-[10px] text-ivory-400 font-mono bg-vault-850 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Col: Timeline & System Integrity */}
            <div className="space-y-6">
              {/* Timeline Snapshot */}
              <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-medium text-ivory-100 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span>Timeline Preview</span>
                  </h3>
                  <Link href="/app/timeline" className="text-xs text-gold-400 hover:text-gold-300">
                    Full Timeline
                  </Link>
                </div>

                <div className="space-y-3 relative pl-4 border-l border-vault-700">
                  {timeline.slice(0, 4).map((event) => (
                    <div key={event.id} className="relative space-y-0.5">
                      <span className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-gold-500/80 border-2 border-vault-950" />
                      <div className="text-[11px] font-mono text-gold-400">
                        {event.event_date || "Undated"}
                      </div>
                      <h5 className="text-xs font-medium text-ivory-200">
                        {event.title}
                      </h5>
                      {event.has_conflict && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>Historical Conflict</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Verification Callout */}
              <div className="p-5 rounded-lg bg-vault-900/60 border border-emerald-500/20 space-y-3 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy Verification</span>
                </div>
                <p className="text-ivory-400 leading-relaxed">
                  Every extraction, vector embedding, and chat inference is executed locally on this computer. No memories are sent to third-party AI companies.
                </p>
                <Link href="/privacy" className="text-gold-400 hover:underline block font-mono text-[11px]">
                  Inspect Security & Architecture &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
