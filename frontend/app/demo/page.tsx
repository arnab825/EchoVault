"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  ArrowRight,
  Database,
  MessageSquareQuote,
  Clock,
  Download,
  CheckCircle,
  FileText,
  AlertTriangle,
  Search
} from "lucide-react";
import { seedSampleData, chatWithArchive, getExportArchiveUrl } from "@/lib/api";
import { ChatResponse } from "@/lib/types";

export default function DemoPage() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // Live inquiry test
  const [testQuery, setTestQuery] = useState("When was the river lantern festival and what did Aunt Clara bring?");
  const [chatResp, setChatResp] = useState<ChatResponse | null>(null);
  const [asking, setAsking] = useState(false);

  async function handleSeed() {
    setSeeding(true);
    try {
      await seedSampleData();
      setSeeded(true);
    } catch (e) {
      alert("Failed to seed sample data: " + (e as Error).message);
    } finally {
      setSeeding(false);
    }
  }

  async function handleAskTest(queryOverride?: string) {
    const q = queryOverride || testQuery;
    setTestQuery(q);
    setAsking(true);
    try {
      const resp = await chatWithArchive(q);
      setChatResp(resp);
    } catch (e) {
      alert("Search failed: " + (e as Error).message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-vault-950 text-ivory-100">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-vault-900 text-gold-400 text-xs font-mono uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guided Demonstration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-ivory-100">
            Synthetic Archival Demo
          </h1>
          <p className="text-xs text-ivory-300 font-light leading-relaxed">
            Verify EchoVault’s complete workflow using realistic, fictional historical records without uploading private family materials.
          </p>
        </div>

        {/* STEP 1: SEED SYNTHETIC DATA */}
        <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-4">
          <div className="flex items-center justify-between border-b border-vault-800 pb-3">
            <div className="flex items-center space-x-3">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-vault-950 font-bold font-mono text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-serif text-lg font-medium text-ivory-100">
                Populate Archive with Synthetic Test Records
              </h3>
            </div>
            {seeded && (
              <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Synthetic Records Loaded</span>
              </span>
            )}
          </div>

          <p className="text-xs text-ivory-300 leading-relaxed font-light">
            Seeds six fictional historical records into SQLite and the vector store:
            an autumn festival story (1952), a wartime letter (1944), an oral history interview (1988), a Venice photograph note (1961), an elderberry cordial recipe (circa 1938), and conflicting clocktower bell repair accounts (1923 vs 1925).
          </p>

          <div className="pt-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-5 py-2.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-flex items-center space-x-2 shadow-sm transition-all"
            >
              <Database className="w-4 h-4" />
              <span>{seeding ? "Ingesting Sample Records..." : "Load Synthetic Memories"}</span>
            </button>
          </div>
        </div>

        {/* STEP 2: TEST EVIDENCE-GROUNDED RETRIEVAL */}
        <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-4">
          <div className="flex items-center space-x-3 border-b border-vault-800 pb-3">
            <span className="w-6 h-6 rounded-full bg-gold-500 text-vault-950 font-bold font-mono text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-serif text-lg font-medium text-ivory-100">
              Test Conversational Search & Evidence Grounding
            </h3>
          </div>

          <p className="text-xs text-ivory-300 font-light leading-relaxed">
            Select an inquiry to see how EchoVault synthesizes an answer directly from cited evidence without fabricating claims:
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleAskTest("When was the river lantern festival and what did Aunt Clara bring?")}
              className="px-3 py-1.5 rounded border border-vault-700 bg-vault-850 hover:border-gold-500/40 text-ivory-200"
            >
              River Lantern Walk (Supported Fact)
            </button>
            <button
              onClick={() => handleAskTest("What year was the village clocktower bell installed?")}
              className="px-3 py-1.5 rounded border border-vault-700 bg-vault-850 hover:border-gold-500/40 text-ivory-200"
            >
              Clocktower Bell (Conflicting Discrepancy)
            </button>
            <button
              onClick={() => handleAskTest("Did great-grandfather own a red motorcycle or fly a spaceship?")}
              className="px-3 py-1.5 rounded border border-vault-700 bg-vault-850 hover:border-gold-500/40 text-ivory-200"
            >
              Spaceship / Motorcycle (Graceful Uncertainty)
            </button>
          </div>

          {asking && (
            <div className="p-4 rounded bg-vault-950 text-xs font-mono text-gold-400 animate-pulse border border-vault-800">
              Retrieving grounded passages from local vector store...
            </div>
          )}

          {chatResp && (
            <div className="mt-4 p-5 rounded-lg bg-vault-950 border border-gold-500/30 space-y-3 font-serif">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-mono text-gold-400 text-[11px]">
                  Model: {chatResp.model_name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                    chatResp.has_sufficient_evidence
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : "bg-amber-950 text-amber-300 border-amber-800"
                  }`}
                >
                  {chatResp.evidence_status}
                </span>
              </div>

              <p className="text-sm text-ivory-100 leading-relaxed whitespace-pre-line">
                {chatResp.answer}
              </p>

              {chatResp.citations.length > 0 && (
                <div className="pt-3 border-t border-vault-800/80 font-sans text-xs space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-gold-400">
                    Citations in Record:
                  </span>
                  {chatResp.citations.map((c) => (
                    <div key={c.citation_index} className="flex items-center justify-between text-[11px] text-ivory-300 bg-vault-900 p-2 rounded border border-vault-800">
                      <span>[{c.citation_index}] {c.memory_title} ({c.event_date || "Undated"})</span>
                      <Link href={`/app/memories/${c.memory_id}`} className="text-gold-400 hover:underline font-mono">
                        Inspect
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 3: EXPLORE FULL APPLICATION */}
        <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-4">
          <div className="flex items-center space-x-3 border-b border-vault-800 pb-3">
            <span className="w-6 h-6 rounded-full bg-gold-500 text-vault-950 font-bold font-mono text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-serif text-lg font-medium text-ivory-100">
              Inspect Timeline, Remembrance, & Portable Export
            </h3>
          </div>

          <p className="text-xs text-ivory-300 leading-relaxed font-light">
            With synthetic records loaded, you can now explore the entire archive ecosystem:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <Link
              href="/app/timeline"
              className="p-3 rounded bg-vault-850 border border-vault-750 hover:border-gold-500/40 text-xs font-mono text-gold-300 flex items-center justify-between"
            >
              <span>View Timeline View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/app/remembrance"
              className="p-3 rounded bg-vault-850 border border-vault-750 hover:border-gold-500/40 text-xs font-mono text-gold-300 flex items-center justify-between"
            >
              <span>Visit Remembrance Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={getExportArchiveUrl()}
              download
              className="p-3 rounded bg-vault-850 border border-vault-750 hover:border-gold-500/40 text-xs font-mono text-gold-300 flex items-center justify-between"
            >
              <span>Download Archive (.ZIP)</span>
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
