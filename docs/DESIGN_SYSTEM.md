# Design System: EchoVault Tokens & Primitives

## Color Palette

### 1. Surfaces & Backgrounds
- `vault-950` (`#090b0e`): Deep charcoal background, evoking dark archival paper.
- `vault-900` (`#101319`): Elevated surface card and navigation background.
- `vault-850` (`#161a23`): Interactive card hover and input background.
- `vault-800` (`#1e232f`): Structural borders and divider lines.

### 2. Typography & Contrast
- `ivory-100` (`#f6f4ee`): Warm primary heading and text color.
- `ivory-300` (`#dcd6c8`): Secondary body text.
- `ivory-400` / `vault-500`: Muted captions, metadata labels, and timestamps.

### 3. Accents
- `gold-500` (`#d4af37`): Antique gold primary CTA accent.
- `gold-400` (`#e5c55c`): Hover state and badge highlights.
- `emerald-400` (`#34d399`): Air-gapped privacy verification indicators.
- `amber-400` (`#fbbf24`): Historical discrepancy warnings.
- `red-500` (`#ef4444`): Destructive purge confirmations.

## Typography Hierarchy
- **Editorial Headings**: `font-serif` (Georgia, Cambria, Times, serif) for high literary gravity and archival warmth.
- **Functional UI**: `font-sans` (-apple-system, Segoe UI, Roboto, sans-serif) for readable labels, controls, and tables.
- **Metadata & Citations**: `font-mono` for dates, passage indices, and hashes.

## Tailwind CSS v4 Setup
The frontend uses **Tailwind CSS v4** with the official `@tailwindcss/postcss` plugin and CSS-first configuration.

### CSS Entry Point (`app/globals.css`)
```css
@import "tailwindcss";

@theme {
  --color-vault-950: #090b0e;
  --color-vault-900: #101319;
  --color-vault-850: #161a23;
  --color-vault-800: #1e232f;
  --color-vault-750: #252b37;
  --color-vault-700: #2d3546;
  --color-vault-600: #444e66;
  --color-vault-500: #626e8a;

  --color-ivory-50: #fdfcf9;
  --color-ivory-100: #f6f4ee;
  --color-ivory-200: #eae6dc;
  --color-ivory-300: #dcd6c8;
  --color-ivory-400: #b5ad9b;
  --color-ivory-500: #8f8674;

  --color-gold-300: #f2da84;
  --color-gold-400: #e5c55c;
  --color-gold-500: #d4af37;
  --color-gold-600: #b89528;
  --color-gold-700: #8e721a;

  --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  --shadow-archival: 0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(212, 175, 55, 0.15);
  --shadow-goldGlow: 0 0 15px -3px rgba(212, 175, 55, 0.3);
}
```
