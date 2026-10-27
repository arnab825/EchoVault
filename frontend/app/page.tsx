import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  KeyRound,
  ShieldCheck,
  Cpu,
  BookOpen,
  ArrowRight,
  Search,
  Lock,
  Layers,
  Sparkles,
  FileText,
  Clock,
  Download,
  AlertCircle,
  Database,
  Terminal,
  ExternalLink
} from "lucide-react";
import { ArchivalHeroMedia } from "@/components/ArchivalHeroMedia";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-vault-950 text-ivory-100 selection:bg-gold-500/20 selection:text-gold-300">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-28 md:pt-32 md:pb-36 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-gold-500/30 bg-vault-900/80 text-gold-400 text-xs tracking-wider uppercase font-mono mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span>Hacktoberfest 2026 &bull; Ghost in the Machine</span>
            </div>

            {/* Cinematic Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-ivory-100 max-w-4xl mx-auto leading-[1.15]">
              Some stories deserve to <span className="text-gold-gradient font-medium italic">outlive the moment</span>.
            </h1>

            {/* Supporting Copy */}
            <p className="mt-6 text-lg sm:text-xl text-ivory-300 max-w-2xl mx-auto font-light leading-relaxed">
              Preserve your photographs, letters, and family stories in a private AI archive that helps you rediscover the echoes and evidence behind them.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-base transition-all shadow-md hover:shadow-goldGlow"
              >
                <span>Explore EchoVault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/privacy"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded border border-vault-700 bg-vault-900/60 hover:bg-vault-850 text-ivory-200 text-base transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>See how local AI works</span>
              </Link>
            </div>

            {/* ARCHIVAL MEDIA SHOWCASE: CINEMATIC VIDEO (DESKTOP) / RESPONSIVE IMAGES (MOBILE) */}
            <div className="mt-14 sm:mt-18 max-w-5xl mx-auto">
              <ArchivalHeroMedia />
            </div>
          </div>
        </section>

        {/* THE PROBLEM SECTION */}
        <section className="py-20 bg-vault-900/60 border-y border-vault-800/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest text-gold-400 font-mono">
                The Preservation Crisis
              </h2>
              <p className="mt-2 font-serif text-3xl sm:text-4xl text-ivory-100">
                Personal histories are fragmented and vulnerable.
              </p>
              <p className="mt-4 text-ivory-300 text-base leading-relaxed">
                Letters decay in shoe boxes. Voice recordings are forgotten in digital folders. Sending intimate family heritage to commercial cloud AI vendors exposes private memories to corporate training sets and API obsolescence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 space-y-3">
                <div className="w-10 h-10 rounded bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  Cloud Privacy Risk
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Uploading handwritten letters or intimate diaries to proprietary cloud AI servers means your family legacy is stored on remote servers with opaque data retention policies.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 space-y-3">
                <div className="w-10 h-10 rounded bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  AI Hallucination
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Generic horror bots or unconstrained language models invent missing dates, make up false relatives, and hallucinate stories instead of preserving historical truth.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 space-y-3">
                <div className="w-10 h-10 rounded bg-gold-950/60 border border-gold-800/40 flex items-center justify-center text-gold-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-medium text-ivory-100">
                  Format Disconnection
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Photographs, audio recordings, and PDF documents exist in separate apps without unified semantic search, chronological alignment, or evidence links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest text-gold-400 font-mono">
                The EchoVault Method
              </h2>
              <p className="mt-2 font-serif text-3xl sm:text-4xl text-ivory-100">
                Four steps to sovereign digital preservation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-sm">
                  1
                </div>
                <h3 className="font-serif text-base font-medium text-ivory-100">
                  Import & Validate
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Upload letters, memoirs, oral histories, or photos. Cryptographic SHA-256 prevents duplicates and validates integrity.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-sm">
                  2
                </div>
                <h3 className="font-serif text-base font-medium text-ivory-100">
                  Local Vector Index
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Documents are chunked into bounded passages and indexed locally into cosine similarity embeddings.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-sm">
                  3
                </div>
                <h3 className="font-serif text-base font-medium text-ivory-100">
                  Evidence Inquiries
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  Ask questions in plain English. EchoVault retrieves source passages and synthesizes an answer with exact citations.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-vault-900 border border-vault-800 space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-mono font-bold text-sm">
                  4
                </div>
                <h3 className="font-serif text-base font-medium text-ivory-100">
                  Portable Sovereignty
                </h3>
                <p className="text-xs text-ivory-400 leading-relaxed">
                  One-click export produces a self-contained ZIP archive with all raw files and JSON metadata. You own your data forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES SHOWCASE */}
        <section id="features" className="py-20 bg-vault-900/40 border-t border-vault-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs uppercase tracking-widest text-gold-400 font-mono">
                Engineered for Integrity
              </h2>
              <p className="mt-2 font-serif text-3xl sm:text-4xl text-ivory-100">
                Archival capabilities built for real history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 flex items-start space-x-4">
                <div className="p-3 rounded bg-vault-900 border border-gold-500/30 text-gold-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-ivory-100 mb-1">
                    Chronological Timeline & Precision
                  </h3>
                  <p className="text-xs text-ivory-400 leading-relaxed">
                    Preserves exact dates, seasonal approximations, and unknown decades. Automatically highlights historical conflicts when two family records disagree.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 flex items-start space-x-4">
                <div className="p-3 rounded bg-vault-900 border border-gold-500/30 text-gold-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-ivory-100 mb-1">
                    Digital Remembrance Room
                  </h3>
                  <p className="text-xs text-ivory-400 leading-relaxed">
                    Respectful tributes honoring deceased ancestors. Record their favorite songs, treasured recipes, handwriting, and lifelong wisdom without deceptive simulation.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 flex items-start space-x-4">
                <div className="p-3 rounded bg-vault-900 border border-gold-500/30 text-gold-400 shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-ivory-100 mb-1">
                    Model Independence & Ollama
                  </h3>
                  <p className="text-xs text-ivory-400 leading-relaxed">
                    Compatible with Llama 3.2, Qwen 2.5, Mistral, and Gemma 2. Switch models seamlessly via Settings without losing memory indexation.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-vault-850 border border-vault-800 flex items-start space-x-4">
                <div className="p-3 rounded bg-vault-900 border border-gold-500/30 text-gold-400 shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-ivory-100 mb-1">
                    Self-Contained Export & Purge
                  </h3>
                  <p className="text-xs text-ivory-400 leading-relaxed">
                    Download full archive dumps with all uploaded images and letters in a single ZIP. Delete data irreversibly whenever you choose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPEN-SOURCE & PODMAN SECTION */}
        <section id="open-source-ai" className="py-20 bg-vault-950 border-t border-vault-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-gold-400 uppercase tracking-widest">
              <Terminal className="w-4 h-4" />
              <span>Podman Desktop & Local Containerization</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-ivory-100 font-normal">
              Built for reproducible, containerized local execution.
            </h2>

            <p className="text-sm text-ivory-300 leading-relaxed max-w-2xl mx-auto font-light">
              EchoVault ships with verified Containerfiles and compose orchestration for Podman Desktop. Run the backend, frontend, and local inference on your own workstation without external SaaS subscriptions.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs"
                className="px-5 py-2.5 rounded bg-vault-900 border border-vault-700 hover:border-gold-500/40 text-ivory-200 text-sm font-medium transition-colors inline-flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-gold-400" />
                <span>Read Architectural Specs</span>
              </Link>
              <Link
                href="/demo"
                className="px-5 py-2.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 text-sm font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
