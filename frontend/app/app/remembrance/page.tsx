"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Sparkles,
  Heart,
  Calendar,
  Music,
  Plus,
  Quote,
  X
} from "lucide-react";
import { fetchRemembrance, createRemembrance } from "@/lib/api";
import { RemembranceItem } from "@/lib/types";

export default function RemembranceRoomPage() {
  const [items, setItems] = useState<RemembranceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [passingDate, setPassingDate] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState("");
  const [favoriteFoodOrMusic, setFavoriteFoodOrMusic] = useState("");
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTributes();
  }, []);

  async function loadTributes() {
    setLoading(true);
    try {
      const data = await fetchRemembrance();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !reflection.trim()) return;

    setSubmitting(true);
    try {
      await createRemembrance({
        name,
        relationship: relationship || null,
        birth_date: birthDate || null,
        passing_date: passingDate || null,
        favorite_quote: favoriteQuote || null,
        favorite_food_or_music: favoriteFoodOrMusic || null,
        reflection,
        associated_memory_ids: [],
        photo_url: null,
      });

      setName("");
      setRelationship("");
      setBirthDate("");
      setPassingDate("");
      setFavoriteQuote("");
      setFavoriteFoodOrMusic("");
      setReflection("");
      setShowModal(false);
      await loadTributes();
    } catch (e) {
      alert("Failed to create tribute: " + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      pageTitle="Remembrance Room"
      pageDescription="A quiet, dignified space for honoring ancestors through authentic recollections, cherished songs, and wisdom."
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* ROOM BANNER */}
        <div className="p-6 rounded-lg bg-vault-900 border border-gold-500/20 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-up">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-medium text-ivory-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gold-400" />
              <span>Sanctuary of Memory</span>
            </h3>
            <p className="text-xs text-ivory-300 max-w-xl leading-relaxed font-light">
              EchoVault respects the sanctity of human legacy. We do not simulate voices or generate artificial dialogue with deceased loved ones. This room is dedicated to truth, personal reflection, and gratitude.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-xs inline-flex items-center space-x-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tribute</span>
          </button>
        </div>

        {/* TRIBUTES LIST */}
        {loading ? (
          <div className="py-20 text-center font-mono text-sm text-ivory-400">
            Gathering remembrance tributes...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-vault-800 bg-vault-900/60 space-y-3">
            <Heart className="w-8 h-8 mx-auto text-vault-600" />
            <h4 className="font-serif text-lg text-ivory-100 font-medium">No tributes recorded yet</h4>
            <p className="text-xs text-ivory-400 max-w-sm mx-auto">
              Preserve the memory, wisdom, and life story of someone meaningful to you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up animate-delay-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg bg-vault-900 border border-gold-500/15 hover:border-gold-500/40 transition-all archival-paper-card space-y-4"
              >
                <div className="flex items-start justify-between border-b border-vault-800 pb-3">
                  <div className="flex items-center space-x-3.5">
                    {(item.photo_url || item.name.toLowerCase().includes("maya")) && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/40 shrink-0 shadow-md">
                        <img
                          src={item.photo_url || "/remembrance_grandma.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover filter sepia-[0.25]"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-xl font-medium text-ivory-100">
                        {item.name}
                      </h4>
                      {item.relationship && (
                        <span className="text-xs text-gold-400 font-mono">
                          {item.relationship}
                        </span>
                      )}
                    </div>
                  </div>
                  {(item.birth_date || item.passing_date) && (
                    <div className="text-[11px] font-mono text-ivory-400 flex items-center space-x-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-vault-500" />
                      <span>
                        {item.birth_date ? item.birth_date.slice(0, 4) : "—"} –{" "}
                        {item.passing_date ? item.passing_date.slice(0, 4) : "Present"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Favorite Quote */}
                {item.favorite_quote && (
                  <div className="bg-vault-950 p-3 rounded border border-vault-800 flex items-start space-x-2.5">
                    <Quote className="w-4 h-4 text-gold-500/70 shrink-0 mt-0.5" />
                    <p className="font-serif text-xs italic text-ivory-200 leading-relaxed">
                      &ldquo;{item.favorite_quote}&rdquo;
                    </p>
                  </div>
                )}

                {/* Favorite Food or Music */}
                {item.favorite_food_or_music && (
                  <div className="flex items-center space-x-2 text-xs text-ivory-300 font-mono">
                    <Music className="w-3.5 h-3.5 text-gold-500" />
                    <span>Cherished: {item.favorite_food_or_music}</span>
                  </div>
                )}

                {/* Personal Reflection */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-ivory-500">Reflection</span>
                  <p className="text-xs text-ivory-300 leading-relaxed font-light font-serif">
                    {item.reflection}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-lg bg-vault-900 border border-vault-750 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-vault-800 pb-3">
                <h3 className="font-serif text-lg font-medium text-ivory-100 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gold-400" />
                  <span>Record a Remembrance Tribute</span>
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-ivory-400 hover:text-ivory-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono uppercase text-gold-400">Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Rosewood"
                      className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono uppercase text-ivory-400">Relationship</label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Maternal Grandmother"
                      className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono uppercase text-ivory-400">Birth Date</label>
                    <input
                      type="text"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="YYYY-MM-DD or YYYY"
                      className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono uppercase text-ivory-400">Passing Date</label>
                    <input
                      type="text"
                      value={passingDate}
                      onChange={(e) => setPassingDate(e.target.value)}
                      placeholder="YYYY-MM-DD or YYYY"
                      className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-ivory-400">Favorite Quote or Saying</label>
                  <input
                    type="text"
                    value={favoriteQuote}
                    onChange={(e) => setFavoriteQuote(e.target.value)}
                    placeholder="e.g. Patience in baking is patience with life."
                    className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-ivory-400">Favorite Food or Melody</label>
                  <input
                    type="text"
                    value={favoriteFoodOrMusic}
                    onChange={(e) => setFavoriteFoodOrMusic(e.target.value)}
                    placeholder="e.g. Cardamom bread & Vivaldi's Four Seasons"
                    className="w-full bg-vault-950 border border-vault-750 rounded px-3 py-2 text-ivory-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono uppercase text-gold-400">Personal Reflection *</label>
                  <textarea
                    rows={4}
                    required
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write a heartfelt memory, lesson, or tribute..."
                    className="w-full bg-vault-950 border border-vault-750 rounded p-3 text-ivory-100 leading-relaxed font-serif focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="pt-2 border-t border-vault-800 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-ivory-400 hover:text-ivory-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold"
                  >
                    {submitting ? "Saving..." : "Save Tribute"}
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
