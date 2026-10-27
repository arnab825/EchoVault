# UI/UX Specification: EchoVault

## 1. Design Direction & Persona
EchoVault embodies an editorial, archival aesthetic reminiscent of fine literary journals, museum cataloging systems, and modern research tools. It eschews generic neon-heavy AI dashboard tropes, overbearing glassmorphism, and hyperactive decorative animations.

## 2. Information Architecture & Route Hierarchy
- `/`: Public editorial landing page showcasing product philosophy, proof of local privacy, and interactive sample preview.
- `/app`: Main dashboard with live operational stats, recent additions, timeline previews, and quick shortcuts.
- `/app/memories`: Searchable, filterable library supporting grid and list view toggles.
- `/app/memories/[id]`: In-depth document inspector, metadata editor, and RAG passage viewer.
- `/app/import`: Keyboard-accessible, drag-and-drop file ingestion workflow with duplicate detection feedback.
- `/app/ask`: Grounded conversational search interface featuring expandable evidence citations and discrepancy alerts.
- `/app/timeline`: Chronological memory visualization with explicit precision badges and dispute tags.
- `/app/collections`: Binders grouping related memories into family narratives.
- `/app/remembrance`: Quiet, reverent remembrance room honoring loved ones.
- `/app/settings`: Diagnostics, model switching, ZIP archive export, index rebuild, and safe data purge.
- `/privacy`: Transparent air-gapped privacy verification guide.
- `/docs`: Technical specification reader.
- `/demo`: Guided synthetic-data exploration mode.

## 3. Interaction Acceptance Criteria
1. **Interactive Feedback**: Every button exhibits visible hover elevation, focus-visible outline, and brief press states.
2. **Double-Submit Prevention**: Ingestion and search buttons disable during execution with clear progress spinners.
3. **No Dead Links**: All links and CTAs navigate to real functional routes.
4. **Accessible Navigation**: Desktop and mobile menus support keyboard tabbing and Esc closure.
5. **Reduced Motion**: Respects `prefers-reduced-motion` media queries.
