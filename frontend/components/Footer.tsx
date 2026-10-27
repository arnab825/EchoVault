import Link from "next/link";
import { KeyRound, Shield, Terminal, Heart } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-vault-800 bg-vault-950 text-ivory-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="sm" />
            <p className="text-xs text-ivory-400 leading-relaxed">
              Keep the stories. Preserve the echoes. A private, local-first AI archive built for the Hacktoberfest 2026 Ghost in the Machine challenge.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero-cloud telemetry guarantee</span>
            </div>
          </div>

          {/* Archive Routes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 font-mono mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/app" className="hover:text-ivory-100 transition-colors">Archive Dashboard</Link></li>
              <li><Link href="/app/memories" className="hover:text-ivory-100 transition-colors">Memory Library</Link></li>
              <li><Link href="/app/ask" className="hover:text-ivory-100 transition-colors">Conversational Search</Link></li>
              <li><Link href="/app/timeline" className="hover:text-ivory-100 transition-colors">Chronological Timeline</Link></li>
              <li><Link href="/app/remembrance" className="hover:text-ivory-100 transition-colors">Remembrance Room</Link></li>
            </ul>
          </div>

          {/* Architecture & Engineering */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 font-mono mb-3">
              Open-Source AI
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="hover:text-ivory-100 transition-colors">System Architecture</Link></li>
              <li><Link href="/docs" className="hover:text-ivory-100 transition-colors">Podman Desktop Setup</Link></li>
              <li><Link href="/docs" className="hover:text-ivory-100 transition-colors">Model Cards & Weights</Link></li>
              <li><Link href="/privacy" className="hover:text-ivory-100 transition-colors">Privacy Threat Model</Link></li>
              <li><Link href="/demo" className="hover:text-ivory-100 transition-colors">Synthetic Demo Mode</Link></li>
            </ul>
          </div>

          {/* Challenge Meta */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 font-mono mb-3">
              Challenge Specs
            </h4>
            <div className="bg-vault-900 border border-vault-800 rounded p-3 text-xs space-y-1.5">
              <div className="text-ivory-200 font-medium">Hacktoberfest 2026</div>
              <div className="text-gold-400">“Ghost in the Machine” Track</div>
              <p className="text-ivory-400 text-[11px] leading-normal pt-1">
                Built with FastAPI, Next.js, SQLite, and Ollama. Certified reproducible on Podman Desktop.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-vault-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-500">
          <div>
            &copy; 2026 EchoVault Open-Source Contributors. Released under Apache License 2.0.
          </div>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0 font-mono text-[11px]">
            <span>Local Inference Only</span>
            <span>&bull;</span>
            <span>No SaaS Dependencies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
