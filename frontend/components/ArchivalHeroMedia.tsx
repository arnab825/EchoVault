"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  Search,
  Film
} from "lucide-react";

export function ArchivalHeroMedia() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<"video" | "evidence">("video");
  const [mobilePhoto, setMobilePhoto] = useState<"/hero_archive.jpg" | "/remembrance_grandma.jpg">("/hero_archive.jpg");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Film Reel Canvas for the Cinematic Desktop Video Player
  useEffect(() => {
    if (activeTab !== "video") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const particles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.5 + 0.15,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atmospheric projector dust / grain particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
        ctx.fillStyle = `rgba(246, 244, 238, ${p.opacity * (0.7 + Math.sin(time * 4 + p.x) * 0.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle projector flicker scanlines
      ctx.fillStyle = `rgba(212, 175, 55, ${0.015 + Math.random() * 0.02})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, activeTab]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border border-vault-750 bg-vault-900/90 shadow-2xl overflow-hidden backdrop-blur">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-vault-800 bg-vault-950/80">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-ivory-400 ml-2">echovault://preservation-reel</span>
        </div>

        {/* View Switcher: Cinematic Video vs Grounded Search */}
        <div className="flex items-center rounded-md border border-vault-700 bg-vault-900 p-0.5 text-xs">
          <button
            onClick={() => setActiveTab("video")}
            className={`px-3 py-1 rounded flex items-center space-x-1.5 transition-colors ${
              activeTab === "video" ? "bg-gold-500 text-vault-950 font-semibold" : "text-ivory-400 hover:text-ivory-200"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Cinematic Film</span>
          </button>
          <button
            onClick={() => setActiveTab("evidence")}
            className={`px-3 py-1 rounded flex items-center space-x-1.5 transition-colors ${
              activeTab === "evidence" ? "bg-gold-500 text-vault-950 font-semibold" : "text-ivory-400 hover:text-ivory-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Evidence RAG</span>
          </button>
        </div>
      </div>

      {/* MEDIA BODY: DESKTOP VIDEO / MOBILE IMAGERY */}
      {/* MEDIA BODY: CINEMATIC REEL (PERMANENTLY MOUNTED) */}
      <div className={activeTab === "video" ? "relative aspect-video w-full bg-vault-950 overflow-hidden group" : "hidden"}>
        {/* BASE HIGH-RES ARCHIVAL PHOTOGRAPH */}
        <div className="relative w-full h-full">
          <img
            src={mobilePhoto}
            alt={mobilePhoto === "/hero_archive.jpg" ? "Archival keepsakes: wartime letters, brass key, and family photographs" : "Vintage portrait of grandmother Maya Rosewood"}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* DESKTOP ANIMATED 35MM FILM GRAIN & PROJECTOR DUST OVERLAY */}
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen"
          />

          {/* CINEMATIC SEPIA VIGNETTE */}
          <div className="absolute inset-0 bg-linear-to-t from-vault-950 via-vault-950/20 to-transparent pointer-events-none" />

          {/* Photo Switcher Pill (Desktop & Mobile) */}
          <div className="absolute top-3 right-3 flex items-center space-x-1.5 p-1 rounded-md bg-vault-950/90 border border-vault-700 backdrop-blur z-20">
            <button
              onClick={() => setMobilePhoto("/hero_archive.jpg")}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                mobilePhoto === "/hero_archive.jpg" ? "bg-gold-500 text-vault-950 font-bold" : "text-ivory-300 hover:text-ivory-100"
              }`}
            >
              Keepsakes
            </button>
            <button
              onClick={() => setMobilePhoto("/remembrance_grandma.jpg")}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                mobilePhoto === "/remembrance_grandma.jpg" ? "bg-gold-500 text-vault-950 font-bold" : "text-ivory-300 hover:text-ivory-100"
              }`}
            >
              Portrait
            </button>
          </div>
        </div>

        {/* OVERLAY BADGE */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center space-x-2 z-20">
          <span className="px-2.5 py-1 rounded-full bg-vault-950/85 border border-gold-500/40 text-gold-300 font-mono text-[10px] sm:text-[11px] backdrop-blur flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <span className="hidden sm:inline">Living Memory Reel &bull; </span>
              {mobilePhoto === "/hero_archive.jpg" ? "Keepsake Vault 1942" : "Sanctuary 1948"}
            </span>
          </span>
        </div>

        {/* CONTROLS OVERLAY */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-lg bg-vault-950/85 border border-vault-800 backdrop-blur text-xs z-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-gold-500 hover:bg-gold-400 text-vault-950 flex items-center justify-center transition-transform hover:scale-105"
              aria-label={isPlaying ? "Pause cinematic reel" : "Play cinematic reel"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <div className="space-y-0.5">
              <p className="text-ivory-100 font-serif font-medium text-xs sm:text-sm">
                The Oakhaven Heritage Reel
              </p>
              <p className="text-[11px] text-ivory-400 font-mono">
                {mobilePhoto === "/hero_archive.jpg"
                  ? "Arthur’s 1944 Sussex letters & wartime brass key"
                  : "Grandmother Maya Rosewood’s 1948 keepsake portrait"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center space-x-1 text-gold-400 hover:text-gold-300 font-mono text-xs"
            >
              <span>Explore Ingested Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* EVIDENCE RAG SEARCH VIEW (PERMANENTLY MOUNTED) */}
      <div className={activeTab === "evidence" ? "p-5 sm:p-6 space-y-4 bg-vault-950" : "hidden"}>
          <div className="bg-vault-850 p-3.5 rounded border border-vault-750 flex items-start space-x-3">
            <Search className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
            <div>
              <div className="text-xs text-gold-400 font-mono uppercase">Verified Archival Query</div>
              <p className="text-sm text-ivory-100 font-medium font-serif">
                “When was the river lantern walk, and what did Aunt Clara bring for the family?”
              </p>
            </div>
          </div>

          <div className="bg-vault-900 p-4 rounded border border-gold-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gold-400 font-mono uppercase flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Evidence-Grounded Archival Response</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                100% Verified Citations
              </span>
            </div>

            <p className="text-sm text-ivory-200 leading-relaxed font-serif">
              According to grandfather Julian’s written recollection, the harvest lantern festival took place on <strong className="text-gold-300">October 15, 1952</strong> along the Oakhaven riverbanks <span className="text-gold-400 font-mono text-xs cursor-pointer hover:underline">[1]</span>. Aunt Clara brought <strong className="text-gold-300">warm spiced apple buns</strong> wrapped in checkered linen, which they shared on the cobblestones while awaiting the nine o’clock brass band <span className="text-gold-400 font-mono text-xs cursor-pointer hover:underline">[1]</span>.
            </p>

            <div className="pt-3 border-t border-vault-800 text-xs flex items-center justify-between text-ivory-400">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-gold-400 bg-gold-500/10 px-1.5 py-0.5 rounded border border-gold-500/30">[1]</span>
                <span className="text-ivory-200 font-medium truncate max-w-xs sm:max-w-md">
                  The Autumn Lantern Walk along the River (Story, Oct 1952)
                </span>
              </div>
              <Link href="/app/memories/mem-sample-01" className="text-gold-400 hover:text-gold-300 font-medium flex items-center space-x-1 shrink-0">
                <span>Inspect Source</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
