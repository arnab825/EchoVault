# EchoVault 🗝️ — Preserving Living Memories with Air-Gapped, Grounded Open-Source AI

![EchoVault Cover Banner](frontend/public/cover.jpg)

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

---

## What I Built

Every family has a drawer, a shoebox, or an old hard drive holding the physical and digital remnants of lives that came before: handwritten letters from wartime, grandmother's stained recipe for elderberry cordial, cassette oral histories, and fading sepia portraits. 

Today, these memories face a silent crisis. When families attempt to digitize and search them with modern cloud AI, they face an unacceptable tradeoff:
1. **Cloud Privacy Leaks:** Handing deeply private family heirlooms to corporate servers that train commercial models on private history.
2. **AI Hallucination & Fabrication:** Cloud chatbots that confidently invent dates, scramble ancestors' names, and weave false genealogies.
3. **Generative "Necromancy":** Deceptive deepfake avatars and synthetic voice clones that simulate conversations with deceased loved ones instead of honoring their real words.

**EchoVault** is my answer to this crisis: an **air-gapped, local-first artificial intelligence memory archive** built from the ground up to protect personal history with cryptographic provenance and zero hallucinations.

### How I Interpreted "Ghost in the Machine"
In popular culture, the "ghost in the machine" often evokes a fear of synthetic consciousness. But in EchoVault, that concept is turned on its head:
- **The "Ghost"** is the authentic human soul embedded in historical artifacts—the real words, handwritten recipes, and spoken cadence of those who came before us.
- **The "Machine"** is local, open-weight artificial intelligence (Llama 3.2, Qwen 2.5, Ollama) acting not as a synthetic impersonator, but as a faithful, incorruptible librarian. 
- EchoVault strictly avoids generative impersonation. It uses AI to index, cross-reference, and illuminate **real human truth**, standing guard over memories so they outlive the moment.

---

## Demo

- 🌐 **Live Repository:** [github.com/arnab825/EchoVault](https://github.com/arnab825/EchoVault)
- 🧪 **Interactive Synthetic Demo Sandbox:** EchoVault includes a built-in sandbox at `/demo` loaded with realistic fictional historical records (a 1952 lantern walk, a 1944 wartime letter, and conflicting 1923/1925 clocktower bell repair logs) so anyone can test the RAG grounding and uncertainty engine without uploading personal files.
- 📚 **In-App Interactive Documentation:** A full architectural manual and live REST API explorer built right into `/docs`.

### Visual Walkthrough of EchoVault

| Editorial Hero & Challenge Track | The Preservation Crisis Analysis |
| :---: | :---: |
| ![EchoVault Editorial Hero](frontend/public/screenshot/1.png) | ![The Preservation Crisis](frontend/public/screenshot/2.png) |
| *Editorial landing page built for the Hacktoberfest Ghost in the Machine challenge.* | *Systematic analysis of privacy threats, AI hallucinations, and format drift.* |

| Archive Overview & System Diagnostics | Grounded Conversational RAG |
| :---: | :---: |
| ![Archive Overview Dashboard](frontend/public/screenshot/4.png) | ![Conversational AI Search](frontend/public/screenshot/7.png) |
| *Air-gapped dashboard tracking 6 indexed memories, active local LLM (`llama3.2:3b`), and SQLite storage.* | *Conversational retrieval strictly citing exact source passages with confidence metrics.* |

| Chronological Timeline & Historical Conflict Engine | Remembrance Room Sanctuary |
| :---: | :---: |
| ![Chronological Timeline](frontend/public/screenshot/8.png) | ![Remembrance Room](frontend/public/screenshot/10.png) |
| *Visual timeline flagging historical discrepancies (Parish ledger vs Uncle Thomas's journal).* | *Sanctuary honoring departed ancestors with authentic reflections, rejecting voice deepfakes.* |

| Open-Weight Model Sizing & Settings | Synthetic Archival Demo Sandbox |
| :---: | :---: |
| ![Vault Settings](frontend/public/screenshot/11.png) | ![Synthetic Demo Sandbox](frontend/public/screenshot/12.png) |
| *Direct control over local Ollama inference URL, model selection, and one-click ZIP export.* | *Guided 3-step sandbox allowing instant evaluation with zero private data upload.* |

---

## Code

EchoVault is 100% open-source under the **Apache License 2.0**:

{% github arnab825/EchoVault %}

The codebase is organized into clean, containerized modules:
- `backend/`: FastAPI application server running Python 3.12, Pydantic v2, and SQLite 3 in WAL mode.
- `frontend/`: Next.js 14 App Router presentation layer with Tailwind CSS, accessible dark-mode glassmorphism, and responsive micro-animations.
- `compose.yaml`: Certified rootless Podman Desktop / Docker Compose orchestration.
- `docs/`: 24 technical documentation specifications (PRD, TRD, Architecture, Threat Model, Privacy by Design, and API Reference).

---

## How I Built It

EchoVault is architected around an **air-gapped three-tier local architecture** with zero external network dependencies:

```
[ Next.js 14 App Router UI (Port 3000) ]
                   ↕ REST / JSON
[ FastAPI Application Server (Port 8000) ]
   ├── SQLite 3 (WAL Mode Metadata & Timeline)
   ├── Local High-Dimensional Vector Store
   └── Upload Vault (SHA-256 Deduplication)
                   ↕ HTTP Local Bridge
[ Ollama Daemon on Host (Port 11434) ]
   ├── Llama 3.2 3B (Primary Reasoning & Nuance)
   ├── Qwen 2.5 1.5B (Multilingual Historical Documents)
   └── Nomic Embed Text (8,192-Token Dense Passage Vectors)
```

### 1. Open-Weight Models & Local Inference
- **Llama 3.2 3B (`llama3.2:3b`):** Selected as the default inference engine for its exceptional factual adherence, balance of literary tone, and compact hardware profile (~2.5 GB RAM/VRAM).
- **Qwen 2.5 1.5B (`qwen2.5:1.5b`):** Provided for multi-lingual archives containing family letters in European, Asian, or regional dialects.
- **Nomic Embed Text (`nomic-embed-text`):** Generates 768-dimensional dense passage vectors across an 8,192 token window.
- **Offline Deterministic Fallback:** An internal zero-dependency vectorizer and template synthesizer guarantees the entire test suite and UI run smoothly even on machines without GPU acceleration or pre-downloaded model weights.

### 2. The Deterministic RAG Pipeline & Hallucination Containment
To guarantee that the machine never fabricates history:
1. Ingested documents (PDFs, TXT, scanned letters, audio transcripts) are decomposed into **350-character windows** with a **50-character boundary overlap**.
2. Each chunk receives a permanent, deterministic passage identifier (e.g. `mem-sample-01-p1`).
3. During conversational search (`/api/chat`), candidate passages are retrieved via cosine similarity.
4. **Keyword Overlap Verification:** Before invoking the LLM, the backend strips 80+ stopwords and evaluates the lexical overlap ratio. If relevance is `< 0.35`, the system short-circuits synthesis and returns:  
   `"I do not find evidence for that in your archive."`
5. When evidence is sufficient, the context is wrapped in strict `<ARCHIVAL_EVIDENCE>` XML boundaries, instructing the model to synthesize answers strictly citing `[1]`, `[2]` with zero speculation.

### 3. Historical Conflict Engine
Real history is messy: an official parish ledger might record a bell re-cast in 1923, while an uncle's diary claims installation was delayed until 1925. Rather than forcing a false consensus or arbitrarily picking a winner, EchoVault introduces a **Date Precision Spectrum** (*Exact, Month, Year, Decade, Unknown*) and visually surfaces discrepancy badges directly in the timeline with links to the original evidence.

### 4. Containerization with Podman Desktop
EchoVault was built and certified for **Podman Desktop**:
- Rootless multi-stage containers with automated health probes.
- Named volume persistence (`echovault_data:/app/data`) preserving SQLite databases and vector indexes across container updates.
- Transparent host networking bridge (`host.containers.internal:11434`) allowing containers to access the host's GPU-accelerated Ollama models.

---

## Why Does Open Innovation Matter?

Personal memories are the most intimate data human beings possess. They hold our love letters, our grief, our family recipes, and our private confessions.

Entrusting these treasures to proprietary closed-source AI APIs creates grave vulnerabilities:
- **Terms of Service Change:** Commercial providers routinely alter data retention, privacy policies, and training consent clauses.
- **API Sunset Risk:** If an AI startup pivots or shuts down, proprietary archives become inaccessible black boxes.
- **Data Mining & Centralization:** Intimate family narratives should never become training fodder for targeted advertising or corporate LLMs.

**Open innovation makes digital sovereignty possible.** With open-weight models (Llama 3.2, Qwen 2.5) running on open runtimes (Ollama, Podman, SQLite), an EchoVault archive created today can be booted up and queried **20, 50, or 100 years from now** completely offline on local silicon—even if the internet is down and every commercial cloud company has vanished.

Open innovation ensures that the memories of our ancestors belong to us, not to a subscription service.

---

## My Agent Session

This project was developed with deep architectural rigor using pair-programming AI agents. Session logs and transcripts documenting the architecture decision records, API design, and Podman containerization are preserved.

<!-- If sharing on DEV with the DevRelay session tag: -->
<!-- {% agent_session a51e1d04-cd07-4671-aacd-eec7632efd26 %} -->

---

## The Spirit of It

The moment EchoVault truly landed for me was during a test of our synthetic test archive.

I had ingested a fictional letter from an elder named Maya describing an autumn lantern walk along a river in 1952. I asked the vault:  
*"When was the river lantern festival and what did Aunt Clara bring?"*

In less than a second, running entirely on my laptop's local CPU, EchoVault returned:  
> *"According to The Autumn Lantern Walk along the River (1952-10-15), the river lantern walk took place on the evening of October 15, 1952 [1]. Aunt Clara brought warm spiced apple buns wrapped in linen to share with the family [1]."*  
> **Source Citation [1]:** *Relevance Score: 88% — Record `mem-sample-01`*

Then, I deliberately tested the boundaries:  
*"Did great-grandfather own a red motorcycle or fly a spaceship?"*

A standard commercial chatbot might humorously embellish or try to please the user. EchoVault gave the answer a real archivist would give:  
> *"I do not find evidence for that in your archive. None of the preserved letters, memoirs, or oral histories mention a red motorcycle or a spaceship."*

That was the moment the ghost entered the machine: not as an illusion or an imitation, but as a guardian of genuine human memory.

---

## Prize Categories

- **Main Track:** Hacktoberfest 2026 Week 4: "Ghost in the Machine"
- **Open-Source Local AI Track:** Highlighting offline, edge-deployable open-weight models (Llama 3.2 & Qwen 2.5 via Ollama) and rootless Podman Desktop container orchestration.

---

*Keep the stories. Preserve the echoes.* 🗝️
