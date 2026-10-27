"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  ArrowLeft,
  FileText,
  ArrowRight
} from "lucide-react";
import { fetchCollections, fetchMemories } from "@/lib/api";
import { Collection, Memory } from "@/lib/types";

export default function CollectionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCollectionData();
    }
  }, [id]);

  async function loadCollectionData() {
    setLoading(true);
    try {
      const allCols = await fetchCollections();
      const matched = allCols.find((c) => c.id === id);
      setCollection(matched || null);

      if (matched && matched.memory_ids.length > 0) {
        const allMems = await fetchMemories();
        const included = allMems.filter((m) => matched.memory_ids.includes(m.id));
        setMemories(included);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppShell pageTitle="Loading Collection...">
        <div className="py-20 text-center font-mono text-sm text-ivory-400">
          Loading binder contents...
        </div>
      </AppShell>
    );
  }

  if (!collection) {
    return (
      <AppShell pageTitle="Collection Not Found">
        <div className="py-12 text-center space-y-3">
          <p className="text-ivory-300">The requested collection does not exist.</p>
          <Link href="/app/collections" className="text-gold-400 underline font-mono text-xs">
            Return to Collections
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      pageTitle={collection.title}
      pageDescription={collection.description || "Curated memory collection"}
    >
      <div className="space-y-6 max-w-5xl">
        <div className="pb-4 border-b border-vault-800 space-y-2">
          <Link
            href="/app/collections"
            className="text-xs text-ivory-400 hover:text-gold-300 inline-flex items-center space-x-1.5 transition-colors font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collections</span>
          </Link>

          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-medium text-ivory-100">
              {collection.title}
            </h3>
            <span className="font-mono text-xs text-gold-400 bg-gold-500/10 px-2 py-1 rounded border border-gold-500/30">
              {collection.memory_count} {collection.memory_count === 1 ? "Record" : "Records"}
            </span>
          </div>

          {collection.description && (
            <p className="text-xs text-ivory-300 font-light leading-relaxed max-w-2xl">
              {collection.description}
            </p>
          )}
        </div>

        {memories.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-vault-800 bg-vault-900/60 space-y-3">
            <FileText className="w-8 h-8 mx-auto text-vault-600" />
            <h4 className="font-serif text-base text-ivory-100 font-medium">No records in this collection yet</h4>
            <p className="text-xs text-ivory-400 max-w-sm mx-auto">
              You can assign memories to this collection when importing or editing memory details.
            </p>
            <Link
              href="/app/memories"
              className="px-3.5 py-1.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-block"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="p-5 rounded-lg bg-vault-900 border border-vault-800 hover:border-gold-500/40 transition-all flex flex-col justify-between archival-paper-card"
              >
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-vault-850 text-gold-400 border border-gold-500/20 inline-block">
                    {mem.source_type}
                  </span>
                  <Link href={`/app/memories/${mem.id}`}>
                    <h4 className="font-serif text-base font-medium text-ivory-100 hover:text-gold-300 transition-colors">
                      {mem.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-ivory-300 leading-relaxed font-light line-clamp-3">
                    {mem.description || mem.extracted_text}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-vault-800 flex items-center justify-between text-xs text-ivory-400 font-mono">
                  <span>{mem.event_date || "Undated"}</span>
                  <Link
                    href={`/app/memories/${mem.id}`}
                    className="text-gold-400 hover:text-gold-300 flex items-center space-x-1 font-medium text-[11px]"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
