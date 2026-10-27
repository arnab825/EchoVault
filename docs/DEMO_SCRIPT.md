# Hacktoberfest 2026 Video Demo Script: EchoVault

> **Tagline**: Keep the stories. Preserve the echoes.  
> **Target Duration**: 3 to 4 minutes

---

## Act 1: The Problem (0:00 – 0:45)
- **Scene**: Open browser on `http://localhost:3000`. Show the cinematic landing page.
- **Narration**: *"Personal histories are fragmented across letters, photographs, audio cassettes, and old diaries. Cloud AI tools promise to make search easy, but uploading private family secrets to commercial foundation models creates unacceptable privacy and data harvesting risks. EchoVault solves this: an air-gapped, local-first AI memory archive built for Hacktoberfest 2026 'Ghost in the Machine'."*
- **Action**: Scroll past the hero section, highlight "Some stories deserve to outlive the moment," and click **"Open your archive"** (`/app`).

---

## Act 2: Ingestion & Verification (0:45 – 1:30)
- **Scene**: In Archive Overview (`/app`). Click **"Load Sample Demonstration Data"** or go to `/app/import`.
- **Narration**: *"EchoVault ingests multi-format records—letters, oral histories, photographs with context, and recipes. Every upload is cryptographically validated via SHA-256 to prevent duplicate pollution, partitioned into bounded passages, and indexed locally into dense vector embeddings."*
- **Action**: Open the Memory Library (`/app/memories`), filter by "letter", and open **"Letter from Florence to Arthur"** (`/app/memories/mem-sample-02`). Show the extracted text and indexed passage chunks.

---

## Act 3: Evidence-Grounded Conversational Search (1:30 – 2:30)
- **Scene**: Navigate to `/app/ask`.
- **Action 1**: Ask: *"When was the river lantern walk and what did Aunt Clara bring?"*
- **Narration**: *"Notice the answer: It directly identifies October 15, 1952 and the spiced apple buns, providing clickable citations [1] that link straight back to Grandfather Julian's story."*
- **Action 2**: Ask: *"Did great-grandfather own a red motorcycle or fly a spaceship?"*
- **Narration**: *"Crucially, EchoVault refuses to hallucinate missing relatives or imaginary vehicles. It explicitly states that the archival records contain no evidence for this claim."*
- **Action 3**: Ask: *"What year was the village clocktower bell installed?"*
- **Narration**: *"When historical records disagree, EchoVault flags the discrepancy between the parish council ledger (1923) and Uncle Thomas's journal (1925)."*

---

## Act 4: Timeline, Remembrance & Sovereign Export (2:30 – 3:30)
- **Scene**: Navigate to `/app/timeline`.
- **Narration**: *"Events are chronologically mapped with exact dates, seasonal approximations, and dispute markers. In the Remembrance Room, families preserve ancestral wisdom and favorite melodies with dignity."*
- **Action**: Navigate to `/app/settings`, click **"Export Archive (.ZIP)"**, and show the downloaded ZIP containing all raw assets and database dumps.
- **Conclusion**: *"100% local, air-gapped, and open-source. EchoVault: Keep the stories. Preserve the echoes."*
