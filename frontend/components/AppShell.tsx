"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  KeyRound,
  LayoutDashboard,
  FolderArchive,
  UploadCloud,
  MessageSquareQuote,
  Clock,
  Layers,
  Sparkles,
  Settings,
  BookOpen,
  Menu,
  X,
  Plus,
  Cpu,
  Database,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { fetchSystemStatus } from "@/lib/api";
import { SystemStatus } from "@/lib/types";
import { Logo } from "./Logo";

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export function AppShell({ children, pageTitle, pageDescription }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    fetchSystemStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [pathname]);

  const navigation = [
    { name: "Archive Overview", href: "/app", icon: LayoutDashboard },
    { name: "Memory Library", href: "/app/memories", icon: FolderArchive },
    { name: "Import & Index", href: "/app/import", icon: UploadCloud },
    { name: "Conversational Search", href: "/app/ask", icon: MessageSquareQuote },
    { name: "Chronological Timeline", href: "/app/timeline", icon: Clock },
    { name: "Collections", href: "/app/collections", icon: Layers },
    { name: "Remembrance Room", href: "/app/remembrance", icon: Sparkles },
    { name: "Vault Settings", href: "/app/settings", icon: Settings },
    { name: "Documentation", href: "/docs", icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-vault-950 text-ivory-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-vault-900 border-r border-vault-800/80">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-vault-800/80">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>

        {/* Quick Action */}
        <div className="p-4">
          <Link
            href="/app/import"
            className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-medium text-sm transition-all shadow-sm hover:shadow-goldGlow"
          >
            <Plus className="w-4 h-4" />
            <span>Import Memory</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-gold-500/10 text-gold-300 font-medium border-l-2 border-gold-500"
                    : "text-ivory-300 hover:bg-vault-850 hover:text-ivory-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-ivory-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* System & Model Status Footer */}
        <div className="p-4 border-t border-vault-800 bg-vault-950/50 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-ivory-400 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-gold-500" />
              <span>Inference:</span>
            </span>
            <span className="font-mono text-gold-300 truncate max-w-30">
              {status?.active_model || "Ollama/Local"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ivory-400 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Indexed:</span>
            </span>
            <span className="font-mono text-ivory-200">
              {status ? `${status.total_memories} records` : "Connecting..."}
            </span>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-400/90 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Air-Gapped & Local</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-vault-800/80 bg-vault-900/60 backdrop-blur-md">
          {/* Mobile Menu Trigger & Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded text-ivory-300 hover:text-ivory-100 hover:bg-vault-850"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumb Header */}
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-ivory-400">
                <Link href="/app" className="hover:text-gold-300 transition-colors">EchoVault</Link>
                <ChevronRight className="w-3 h-3 text-vault-600" />
                <span className="text-gold-400 font-medium">{pageTitle || "Vault"}</span>
              </div>
              {pageDescription && (
                <p className="text-xs text-ivory-400 hidden sm:block truncate max-w-md">
                  {pageDescription}
                </p>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/app/ask"
              className="hidden sm:inline-flex items-center space-x-2 text-xs py-1.5 px-3 rounded border border-vault-700 bg-vault-850 text-ivory-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors"
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-gold-400" />
              <span>Ask Archive...</span>
            </Link>

            <Link
              href="/demo"
              className="text-xs px-2.5 py-1 rounded bg-vault-800 hover:bg-vault-700 text-ivory-300 border border-vault-700"
            >
              Demo Data
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-vault-900 border-b border-vault-800 px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-sm ${
                  pathname === item.href ? "text-gold-400 font-medium" : "text-ivory-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Page Body Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
