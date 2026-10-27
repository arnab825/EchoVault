"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { fetchTimeline } from "@/lib/api";
import { TimelineEvent, DatePrecision } from "@/lib/types";

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPrecision, setFilterPrecision] = useState<string>("all");

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    setLoading(true);
    try {
      const data = await fetchTimeline();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents = events.filter((e) => {
    if (filterPrecision === "all") return true;
    if (filterPrecision === "conflicts") return e.has_conflict;
    return e.date_precision === filterPrecision;
  });

  return (
    <AppShell
      pageTitle="Chronological Timeline"
      pageDescription="Explore the flow of personal history with explicit date precision and historical dispute tracking."
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-vault-900 p-4 rounded-lg border border-vault-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-ivory-300">
            <Filter className="w-4 h-4 text-gold-400" />
            <span>Filter by Precision:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["all", "exact", "approximate", "year", "conflicts"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterPrecision(f)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  filterPrecision === f
                    ? "bg-gold-500 text-vault-950 font-semibold"
                    : "bg-vault-800 text-ivory-300 hover:bg-vault-750"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE VIEW */}
        {loading ? (
          <div className="py-20 text-center font-mono text-sm text-ivory-400">
            Constructing chronological sequence...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-vault-800 bg-vault-900/60 space-y-3">
            <Clock className="w-10 h-10 mx-auto text-vault-600" />
            <h3 className="font-serif text-lg text-ivory-100 font-medium">No timeline events match filter</h3>
            <p className="text-xs text-ivory-400 max-w-sm mx-auto">
              Add dates to imported memories in the Library to map them chronologically.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-gold-500/30 space-y-8 my-6">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Timeline Node Point */}
                <span
                  className={`absolute -left-7.75 sm:-left-9.75 top-1.5 w-4 h-4 rounded-full border-2 border-vault-950 transition-all ${
                    evt.has_conflict
                      ? "bg-amber-400 ring-2 ring-amber-500/40"
                      : "bg-gold-500 group-hover:scale-110"
                  }`}
                />

                {/* Event Card */}
                <div className="p-5 rounded-lg bg-vault-900 border border-vault-800 hover:border-gold-500/40 transition-all archival-paper-card space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Date & Precision Tag */}
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-semibold text-gold-400">
                        {evt.event_date || "Undated Period"}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-vault-850 text-ivory-400 border border-vault-700">
                        {evt.date_precision}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-vault-800 text-gold-400 border border-gold-500/20">
                      {evt.source_type}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-serif text-lg font-medium text-ivory-100 leading-snug">
                    {evt.title}
                  </h4>

                  {evt.description && (
                    <p className="text-xs text-ivory-300 leading-relaxed font-light">
                      {evt.description}
                    </p>
                  )}

                  {/* Historical Conflict Alert */}
                  {evt.has_conflict && (
                    <div className="p-3 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                      <div className="flex items-center space-x-1.5 font-semibold text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Historical Date Discrepancy</span>
                      </div>
                      <p className="text-[11px] font-light leading-relaxed">
                        {evt.conflict_notes || "Records within the vault document conflicting accounts regarding this event timeframe."}
                      </p>
                    </div>
                  )}

                  {/* Source Link */}
                  <div className="pt-2 border-t border-vault-800/80 flex items-center justify-between text-xs">
                    <span className="text-ivory-500 font-mono text-[11px]">
                      Memory Record ID: {evt.memory_id}
                    </span>
                    <Link
                      href={`/app/memories/${evt.memory_id}`}
                      className="text-gold-400 hover:text-gold-300 inline-flex items-center space-x-1 font-mono text-[11px]"
                    >
                      <span>Inspect Source Evidence</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
