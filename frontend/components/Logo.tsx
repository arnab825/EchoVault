"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

export function Logo({ className = "", size = "md", showWordmark = true }: LogoProps) {
  const pathname = usePathname();

  // Dynamically determine logo aura, accent colors, and subtitle based on current route
  const theme = useMemo(() => {
    if (pathname.startsWith("/app/ask")) {
      return {
        accent: "#38bdf8", // Sky blue for AI Inquiry
        glow: "rgba(56, 189, 248, 0.4)",
        badge: "Grounded AI",
        ringColor: "#0284c7",
        glyph: "spark",
      };
    }
    if (pathname.startsWith("/app/timeline")) {
      return {
        accent: "#fbbf24", // Amber for Chronological Time
        glow: "rgba(251, 191, 36, 0.4)",
        badge: "Timeline",
        ringColor: "#d97706",
        glyph: "clock",
      };
    }
    if (pathname.startsWith("/app/remembrance")) {
      return {
        accent: "#f472b6", // Rose gold for Remembrance
        glow: "rgba(244, 114, 182, 0.4)",
        badge: "Sanctuary",
        ringColor: "#db2777",
        glyph: "heart",
      };
    }
    if (pathname.startsWith("/privacy")) {
      return {
        accent: "#34d399", // Emerald for Air-gap & Privacy
        glow: "rgba(52, 211, 153, 0.4)",
        badge: "Air-Gapped",
        ringColor: "#059669",
        glyph: "shield",
      };
    }
    if (pathname.startsWith("/app/settings")) {
      return {
        accent: "#a78bfa", // Purple for Cryptographic Vault
        glow: "rgba(167, 139, 250, 0.4)",
        badge: "Vault Seal",
        ringColor: "#7c3aed",
        glyph: "gear",
      };
    }
    if (pathname.startsWith("/app/import")) {
      return {
        accent: "#22d3ee", // Cyan for Import
        glow: "rgba(34, 211, 238, 0.4)",
        badge: "Ingestion",
        ringColor: "#0891b2",
        glyph: "upload",
      };
    }
    if (pathname.startsWith("/app/memories")) {
      return {
        accent: "#a3e635", // Lime/Olive for Archive Records
        glow: "rgba(163, 230, 53, 0.4)",
        badge: "Living Library",
        ringColor: "#65a30d",
        glyph: "archive",
      };
    }
    if (pathname.startsWith("/app/collections")) {
      return {
        accent: "#c084fc", // Orchid for Collections
        glow: "rgba(192, 132, 252, 0.4)",
        badge: "Curated Tomes",
        ringColor: "#9333ea",
        glyph: "layers",
      };
    }
    if (pathname.startsWith("/docs")) {
      return {
        accent: "#f59e0b", // Gold-amber for documentation
        glow: "rgba(245, 158, 11, 0.4)",
        badge: "Architecture",
        ringColor: "#b45309",
        glyph: "book",
      };
    }
    if (pathname.startsWith("/demo")) {
      return {
        accent: "#e879f9", // Fuchsia for interactive demo
        glow: "rgba(232, 121, 249, 0.4)",
        badge: "Sandbox",
        ringColor: "#c026d3",
        glyph: "spark",
      };
    }
    // Default / Landing
    return {
      accent: "#d4af37", // Antique Gold
      glow: "rgba(212, 175, 55, 0.35)",
      badge: "Archival AI",
      ringColor: "#b89528",
      glyph: "key",
    };
  }, [pathname]);

  const dimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  }[size];

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Dynamic Vault Key Icon */}
      <div
        className={`${dimensions} relative rounded-lg bg-vault-900 border flex items-center justify-center transition-all duration-300 group-hover:scale-105`}
        style={{
          borderColor: theme.accent,
          boxShadow: `0 0 15px -3px ${theme.glow}`,
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 transition-transform duration-500 group-hover:rotate-12"
        >
          {/* Outer Archival Vault Octagon */}
          <path
            d="M10 3 H22 L29 10 V22 L22 29 H10 L3 22 V10 Z"
            stroke={theme.ringColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 3"
            className="opacity-70 animate-[spin_60s_linear_infinite]"
          />

          {/* Key Bow */}
          <circle
            cx="13"
            cy="13"
            r="5"
            stroke={theme.accent}
            strokeWidth="1.8"
          />

          {/* Dynamic Route-Specific Emblem inside Key Bow */}
          {theme.glyph === "heart" ? (
            <path
              d="M13 15.5 C11.8 14.5 10.5 13.5 10.5 12.2 C10.5 11.2 11.3 10.5 12.2 10.5 C12.7 10.5 13.1 10.8 13 11.2 C12.9 10.8 13.3 10.5 13.8 10.5 C14.7 10.5 15.5 11.2 15.5 12.2 C15.5 13.5 14.2 14.5 13 15.5 Z"
              fill={theme.accent}
            />
          ) : theme.glyph === "shield" ? (
            <path
              d="M13 10.5 L15 11.5 V13.5 C15 15 13 16 13 16 C13 16 11 15 11 13.5 V11.5 Z"
              fill={theme.accent}
            />
          ) : theme.glyph === "clock" ? (
            <>
              <circle cx="13" cy="13" r="1.5" fill={theme.accent} />
              <path d="M13 11.5 V13 H14.5" stroke={theme.accent} strokeWidth="1.2" strokeLinecap="round" />
            </>
          ) : theme.glyph === "spark" ? (
            <path
              d="M13 10.5 L13.5 12.5 L15.5 13 L13.5 13.5 L13 15.5 L12.5 13.5 L10.5 13 L12.5 12.5 Z"
              fill={theme.accent}
            />
          ) : theme.glyph === "upload" ? (
            <>
              <path d="M13 15 V11 M11.5 12.5 L13 11 L14.5 12.5" stroke={theme.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : theme.glyph === "gear" ? (
            <>
              <circle cx="13" cy="13" r="1.8" fill={theme.accent} />
              <circle cx="13" cy="13" r="3.2" stroke={theme.accent} strokeWidth="1" strokeDasharray="1.5 1.5" />
            </>
          ) : (
            <circle
              cx="13"
              cy="13"
              r="2"
              fill={theme.accent}
            />
          )}

          {/* Key Shaft & Bit */}
          <path
            d="M16.5 16.5 L24 24"
            stroke={theme.accent}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Key Teeth */}
          <path
            d="M21 21 L23 19 M23.5 23.5 L25.5 21.5"
            stroke={theme.accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Dynamic Status Indicator Gem */}
        <span
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-vault-950 transition-colors duration-300"
          style={{ backgroundColor: theme.accent }}
        />
      </div>

      {/* Brand Wordmark & Dynamic Section Tag */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <span className="font-serif text-lg tracking-wide font-medium text-ivory-100 group-hover:text-gold-300 transition-colors">
            EchoVault
          </span>
          <span
            className="text-[9px] tracking-widest uppercase font-mono -mt-1 font-semibold transition-colors duration-300"
            style={{ color: theme.accent }}
          >
            {theme.badge}
          </span>
        </div>
      )}
    </div>
  );
}
