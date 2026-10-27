"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  MessageSquareQuote,
  Send,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { chatWithArchive } from "@/lib/api";
import { ChatResponse } from "@/lib/types";

interface MessageItem {
  id: string;
  sender: "user" | "archive";
  text: string;
  responseMeta?: ChatResponse;
}

export default function ConversationalSearchPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState<number | null>(null);

  const sampleQuestions = [
    "When was the river lantern festival and what did Aunt Clara bring?",
    "What did Grandmother Maya say about learning to bake in her kitchen?",
    "What year was the village clocktower bell installed?",
    "Did great-grandfather own a red motorcycle or fly a spaceship?",
  ];

  async function handleSend(questionText?: string) {
    const q = questionText || query;
    if (!q.trim() || loading) return;

    const userMsg: MessageItem = {
      id: "u-" + Date.now(),
      sender: "user",
      text: q.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const resp = await chatWithArchive(q.trim());
      const botMsg: MessageItem = {
        id: "a-" + Date.now(),
        sender: "archive",
        text: resp.answer,
        responseMeta: resp,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: MessageItem = {
        id: "err-" + Date.now(),
        sender: "archive",
        text: "Archival search error: " + (e as Error).message,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      pageTitle="Conversational AI Search"
      pageDescription="Ask questions about your memories with verifiable source citations and zero hallucination."
    >
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
        {/* MESSAGES DISPLAY SCROLL AREA */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
          {messages.length === 0 ? (
            <div className="py-12 text-center space-y-6 animate-fade-up">
              <div className="w-12 h-12 mx-auto rounded-full bg-vault-900 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-sm">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-xl font-medium text-ivory-100">
                  Inquire into your vault
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed font-light">
                  EchoVault cross-references every answer with stored letters, memoirs, and audio transcripts. If a fact cannot be verified, it will state so honestly.
                </p>
              </div>

              {/* Suggested Questions */}
              <div className="pt-2">
                <p className="text-xs font-mono uppercase text-gold-400 mb-3">
                  Suggested Evidence Inquiries:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                  {sampleQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sq)}
                      className="text-left text-xs px-3.5 py-2 rounded-full border border-vault-750 bg-vault-900 hover:border-gold-500/50 hover:bg-vault-850 text-ivory-300 transition-colors"
                    >
                      &ldquo;{sq}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Message Header */}
                <span className="text-[10px] font-mono uppercase text-ivory-500 mb-1 px-1">
                  {m.sender === "user" ? "You" : "EchoVault Archival Retrieval"}
                </span>

                {/* Message Body */}
                <div
                  className={`p-5 rounded-lg max-w-2xl text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gold-500/15 border border-gold-500/30 text-ivory-100"
                      : "bg-vault-900 border border-vault-800 text-ivory-100 font-serif"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Evidence Status Badge & Conflict Alert */}
                  {m.responseMeta && (
                    <div className="mt-4 pt-3 border-t border-vault-800 font-sans space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-gold-400 text-[11px] flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Model: {m.responseMeta.model_name}</span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${
                            m.responseMeta.has_sufficient_evidence
                              ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                              : "bg-amber-950 text-amber-300 border-amber-800"
                          }`}
                        >
                          {m.responseMeta.evidence_status}
                        </span>
                      </div>

                      {/* Conflict Notification */}
                      {m.responseMeta.detected_conflicts?.length > 0 && (
                        <div className="p-3 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                          <div className="flex items-center space-x-1.5 font-semibold text-amber-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Contradictory Historical Records Detected</span>
                          </div>
                          {m.responseMeta.detected_conflicts.map((c, idx) => (
                            <p key={idx} className="text-[11px] font-light leading-relaxed">
                              {c}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Cited Evidence Sources */}
                      {m.responseMeta.citations?.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[11px] font-mono uppercase text-gold-400 block">
                            Evidence Citations:
                          </span>
                          <div className="space-y-1.5">
                            {m.responseMeta.citations.map((cite) => {
                              const isExpanded = expandedCitation === cite.citation_index;
                              return (
                                <div
                                  key={cite.citation_index}
                                  className="rounded border border-vault-750 bg-vault-950 p-2.5 text-xs space-y-1.5"
                                >
                                  <div
                                    onClick={() =>
                                      setExpandedCitation(isExpanded ? null : cite.citation_index)
                                    }
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono text-gold-400 bg-gold-500/20 px-1 rounded text-[10px]">
                                        [{cite.citation_index}]
                                      </span>
                                      <span className="font-medium text-ivory-200">
                                        {cite.memory_title}
                                      </span>
                                      {cite.event_date && (
                                        <span className="text-ivory-500 font-mono text-[10px]">
                                          ({cite.event_date})
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-[10px] text-emerald-400 font-mono">
                                        {cite.confidence_statement}
                                      </span>
                                      {isExpanded ? (
                                        <ChevronUp className="w-3.5 h-3.5 text-ivory-400" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5 text-ivory-400" />
                                      )}
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className="pt-2 border-t border-vault-800 text-ivory-300 font-serif leading-relaxed text-[11px]">
                                      <p className="italic bg-vault-900 p-2 rounded border border-vault-800">
                                        &ldquo;{cite.passage_excerpt}&rdquo;
                                      </p>
                                      <div className="mt-2 text-right">
                                        <Link
                                          href={`/app/memories/${cite.memory_id}`}
                                          className="text-gold-400 hover:text-gold-300 text-[11px] inline-flex items-center space-x-1 font-mono"
                                        >
                                          <span>Open Source Document</span>
                                          <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-gold-400 p-4 bg-vault-900 rounded-lg border border-vault-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <span>Retrieving relevant archival passages & grounding evidence...</span>
            </div>
          )}
        </div>

        {/* INPUT BOX */}
        <div className="border-t border-vault-800 pt-4 bg-vault-950 animate-fade-up animate-delay-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask a question about letters, dates, family members, or traditions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-vault-900 border border-vault-750 rounded-lg px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-500 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-3 rounded-lg bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-vault-950 font-semibold text-sm inline-flex items-center space-x-2 shadow-sm transition-all"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {messages.length > 0 && (
            <div className="mt-2 flex items-center justify-between text-[11px] text-ivory-500 font-mono">
              <span className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Air-gapped verification active</span>
              </span>
              <button
                onClick={() => setMessages([])}
                className="hover:text-gold-400 transition-colors"
              >
                Clear Conversation History
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
