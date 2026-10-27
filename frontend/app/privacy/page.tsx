import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  Cpu,
  Database,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  KeyRound
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-vault-950 text-ivory-100">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {/* PRIVACY HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Air-Gapped & Sovereign Architecture</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-ivory-100">
            Privacy by Design: What Stays Local
          </h1>
          <p className="text-sm text-ivory-300 font-light max-w-2xl mx-auto leading-relaxed">
            EchoVault was conceived as an ethical antidote to corporate data harvesting. We believe personal family archives should never be fed into commercial foundation models or stored on third-party servers.
          </p>
        </div>

        {/* VERIFICATION MATRIX */}
        <div className="rounded-lg border border-vault-800 bg-vault-900 divide-y divide-vault-800 overflow-hidden shadow-lg">
          <div className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-base">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif">100% Local Processing Guarantee</h3>
            </div>
            <p className="text-xs text-ivory-300 leading-relaxed font-light pl-7">
              All memory text extraction (PDFs, text notes, image annotations), passage chunking, vector embedding generation, and LLM question answering run completely on your local workstation through your local Ollama runtime and Python backend.
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-base">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif">Zero Telemetry & Zero External Analytics</h3>
            </div>
            <p className="text-xs text-ivory-300 leading-relaxed font-light pl-7">
              The application contains zero tracking pixels, no Google Analytics, no third-party CDNs, and no external API calls. You can disconnect your machine from the internet entirely, and EchoVault will continue functioning normally.
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-base">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif">Sanitized Logging Policy</h3>
            </div>
            <p className="text-xs text-ivory-300 leading-relaxed font-light pl-7">
              Application server logs deliberately omit full memory bodies, raw prompt contents, and conversation transcripts. Only sanitized operational metadata (such as HTTP status codes and processing durations) is recorded.
            </p>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-medium text-base">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-serif">Self-Contained Data Portability</h3>
            </div>
            <p className="text-xs text-ivory-300 leading-relaxed font-light pl-7">
              You are never locked into EchoVault. At any time, you can generate a portable ZIP export containing your original files, raw database JSON dumps, and vector index, or permanently purge all traces of your data.
            </p>
          </div>
        </div>

        {/* HONEST LIMITATIONS NOTICE */}
        <div className="p-6 rounded-lg bg-vault-900/60 border border-amber-500/30 text-amber-200 text-xs space-y-3">
          <div className="flex items-center space-x-2 font-semibold text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Honest Security Disclosures</span>
          </div>
          <p className="leading-relaxed font-light">
            Local inference guarantees that your data is not sent over the network to external AI providers. However, local privacy depends on host security:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-[11px] text-ivory-300">
            <li>Other users with administrator access to your physical machine can read local SQLite database files.</li>
            <li>We recommend running EchoVault on full-disk encrypted workstations (e.g. BitLocker or LUKS).</li>
            <li>If running on public Wi-Fi, ensure your container ports are bound only to <code className="text-gold-400">127.0.0.1</code> and not public interfaces.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/app"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold text-sm shadow transition-all"
          >
            <span>Enter Your Private Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
