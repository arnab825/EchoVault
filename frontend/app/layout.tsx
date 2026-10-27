import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoVault — Keep the stories. Preserve the echoes.",
  description: "A private, local-first AI memory archive for the Hacktoberfest 2026 Ghost in the Machine challenge. Preserve photographs, letters, oral histories, and family memories with verifiable local retrieval.",
  keywords: ["AI Memory Archive", "Local-First AI", "Digital Preservation", "Hacktoberfest 2026", "Ollama", "Podman"],
  authors: [{ name: "EchoVault Contributors" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="archival-bg min-h-screen text-ivory-100 antialiased selection:bg-gold-500/20 selection:text-gold-300">
        {children}
      </body>
    </html>
  );
}
