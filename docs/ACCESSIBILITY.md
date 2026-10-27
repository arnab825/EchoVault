# Accessibility Guide: EchoVault

## Compliance Target: WCAG 2.1 AA

EchoVault is committed to making digital preservation accessible to people with diverse abilities.

### 1. Contrast Ratios & Visual System
- Primary text (`#f6f4ee` ivory) against dark surfaces (`#090b0e` / `#101319`) exceeds the **7:1** enhanced contrast ratio.
- Antique gold accents (`#d4af37`) against dark backgrounds exceed the **4.5:1** minimum contrast ratio for text and interactive controls.
- Information is never communicated by color alone: status badges include text labels and distinct geometric icons.

### 2. Keyboard Navigation & Focus Indicators
- All interactive controls (buttons, links, file selectors, inputs) have a dedicated `:focus-visible` styling (`outline: 2px solid #d4af37; outline-offset: 2px;`).
- Modal dialogs trap focus and can be dismissed using the <kbd>Escape</kbd> key.
- The drag-and-drop file upload area has an explicit keyboard-accessible `<button>` alternative.

### 3. Motion & Screen Readers
- Supports `prefers-reduced-motion`: reduces all CSS transitions and animations to 0.01ms.
- Semantic HTML5 structure with landmark elements (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`).
- Screen-reader labels (`aria-label`, `aria-expanded`) on hamburger menus and icon-only buttons.
