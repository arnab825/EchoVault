"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ShieldCheck, Cpu, BookOpen } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-vault-950/80 border-b border-vault-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <Link href="/">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-ivory-300">
            <Link href="/#features" className="hover:text-gold-300 transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-gold-300 transition-colors">
              How it works
            </Link>
            <Link href="/#open-source-ai" className="hover:text-gold-300 transition-colors flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-gold-500" />
              <span>Open-source AI</span>
            </Link>
            <Link href="/privacy" className="hover:text-gold-300 transition-colors flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy</span>
            </Link>
            <Link href="/docs" className="hover:text-gold-300 transition-colors flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span>Docs</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/demo"
              className="text-sm px-3.5 py-1.5 rounded border border-vault-700 text-ivory-300 hover:text-ivory-100 hover:border-vault-600 transition-colors"
            >
              Explore Demo
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center space-x-2 text-sm px-4 py-1.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 font-semibold transition-all shadow-sm hover:shadow-goldGlow"
            >
              <span>Open your archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded text-ivory-300 hover:text-ivory-100 hover:bg-vault-850 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-vault-800 bg-vault-900 px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-ivory-200 hover:text-gold-300 py-1"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-ivory-200 hover:text-gold-300 py-1"
          >
            How it works
          </Link>
          <Link
            href="/#open-source-ai"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-ivory-200 hover:text-gold-300 py-1"
          >
            Open-source AI
          </Link>
          <Link
            href="/privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-ivory-200 hover:text-gold-300 py-1"
          >
            Privacy Guarantee
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-ivory-200 hover:text-gold-300 py-1"
          >
            Documentation
          </Link>
          <div className="pt-2 flex flex-col space-y-2">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded border border-vault-700 text-sm text-ivory-200"
            >
              Explore Sample Demo
            </Link>
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded bg-gold-500 text-vault-950 font-semibold text-sm shadow"
            >
              Open your archive
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
