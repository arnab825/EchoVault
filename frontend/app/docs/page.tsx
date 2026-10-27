"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BookOpen,
  Cpu,
  ShieldCheck,
  Terminal,
  FileCode,
  Layers,
  ArrowRight,
  Search,
  Copy,
  Check,
  Play,
  Sparkles,
  Clock,
  Heart,
  RefreshCw,
  Code2
} from "lucide-react";

interface DocTopic {
  id: string;
  category: "architecture" | "deployment" | "ai" | "security" | "api" | "features";
  title: string;
  badge: string;
  icon: any;
  summary: string;
  content: {
    description: string;
    highlights?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    codeSnippets?: {
      title: string;
      language: string;
      code: string;
    }[];
    deepDive?: {
      title: string;
      body: string;
    }[];
  };
}

const DOCS_DATA: DocTopic[] = [
  {
    id: "architecture",
    category: "architecture",
    title: "System Architecture & Pipeline",
    badge: "Core Engine",
    icon: Layers,
    summary: "Air-gapped three-tier local architecture, persistent storage decomposition, and deterministic evidence retrieval.",
    content: {
      description: `EchoVault is engineered as an air-gapped, zero-cloud digital archival repository. It enforces deterministic provenance where every answer produced by local AI language models is anchored to cryptographically verified source passage IDs.`,
      highlights: [
        "Air-Gapped by Default: Zero telemetry sinks, zero remote API calls, runs entirely offline on local hardware.",
        "Deterministic Provenance: Passages are mapped to immutable source IDs; unsupported assertions trigger strict uncertainty fallbacks.",
        "Decoupled Inference Layer: Swap between Ollama (Llama 3.2, Qwen 2.5, Mistral) and the zero-dependency deterministic vectorizer.",
        "Polyglot Ingestion: Jointly preserves raw artifacts, normalized OCR/transcription text, and multi-dimensional vector embeddings."
      ],
      table: {
        headers: ["Component", "Technology", "Role & Execution Boundary"],
        rows: [
          ["Frontend", "Next.js 14 App Router, React 18, Tailwind CSS v4", "Editorial archival UI, dynamic section themes, WCAG 2.1 AA"],
          ["Application Server", "FastAPI (Python 3.12), Pydantic v2, Uvicorn", "Restricted REST API, SHA-256 validation, passage chunking"],
          ["Relational Storage", "SQLite 3 in WAL mode (foreign keys enabled)", "Structured metadata, timeline events, remembrance tributes"],
          ["Vector Search", "Local Dense Cosine Vector Index (JSON / Numpy)", "Cosine similarity search over 8,192-dim passage embeddings"],
          ["Local LLM Engine", "Ollama daemon (Llama 3.2 3B / Qwen 2.5 1.5B)", "Local CPU/GPU inference with strict XML prompt boundaries"]
        ]
      },
      codeSnippets: [
        {
          title: "System Structural Layout",
          language: "tree",
          code: `EchoVault/
├── frontend/                     # Next.js 14 Presentation Layer (Port 3000)
│   ├── app/                      # App Router: /app, /ask, /timeline, /remembrance
│   ├── components/               # Dynamic Logo, ArchivalHeroMedia, AppShell
│   └── lib/                      # Type-safe API client & domain models
│
├── backend/                      # FastAPI REST Backend (Port 8000)
│   ├── app/
│   │   ├── main.py               # Lifespan handlers, CORS, logging sanitizers
│   │   ├── database.py           # SQLite WAL schema & connection pooling
│   │   ├── routes/               # Memories, Chat/RAG, Timeline, Remembrance
│   │   └── services/             # Extractor, VectorStore, OllamaClient, RAG
│   └── tests/                    # Pytest verification suite (11/11 automated tests)
│
├── data/                         # Persistent Storage Directory
│   ├── echovault.db              # Relational SQLite database
│   ├── vector_index.json         # High-dimensional embeddings
│   ├── uploads/                  # Cryptographically named artifact files
│   └── exports/                  # Generated self-contained ZIP backups
│
└── compose.yaml                  # Podman / Docker container orchestration`
        }
      ],
      deepDive: [
        {
          title: "Ingestion & Passage Decomposition",
          body: "When an archival document or letter is uploaded, EchoVault calculates its SHA-256 fingerprint to reject duplicate submissions. The text is parsed, sanitized, and sliced into overlapping windows of 350 characters with a 50-character boundary overlap. Each chunk receives a deterministic passage key (e.g., mem-01-p1) that serves as the permanent citation target during semantic queries."
        },
        {
          title: "Evidence-Bounded Generation",
          body: "During conversational search (/api/chat), the backend retrieves the top-5 cosine-ranked passages. Before synthesizing an answer, EchoVault evaluates keyword overlap and semantic relevance. If evidence is insufficient, the system gracefully refrains from speculation. When evidence exists, the prompt wraps passages in strict <ARCHIVAL_EVIDENCE> XML barriers, commanding the local LLM to cite [1], [2] only from enclosed text."
        }
      ]
    }
  },
  {
    id: "podman",
    category: "deployment",
    title: "Podman Desktop & Container Orchestration",
    badge: "Container Certified",
    icon: Terminal,
    summary: "Production-ready Podman Containerfiles, compose.yaml orchestration, WSL2 tuning, and health checks.",
    content: {
      description: `EchoVault is engineered specifically for Podman Desktop and rootless container engines. All containers run as non-root users and communicate across an isolated internal bridge network with automated health checks.`,
      highlights: [
        "100% Rootless: Multi-stage alpine containers build and run with minimal attack surfaces.",
        "Host Ollama Bridge: Containers access your GPU-accelerated local Ollama instance via host.containers.internal:11434.",
        "Zero Cloud Dependency: Once images are pulled or built locally, no internet access is required.",
        "Persistent Volume Mounts: All SQLite files and uploads reside on host mounts for durability."
      ],
      table: {
        headers: ["Service", "Port", "Container Name", "Health Check Command"],
        rows: [
          ["echovault-frontend", "3000:3000", "echovault_frontend", "wget --spider http://localhost:3000/ || exit 1"],
          ["echovault-backend", "8000:8000", "echovault_backend", "python -c 'import urllib.request; urllib.request.urlopen(\"http://localhost:8000/api/health\")'"]
        ]
      },
      codeSnippets: [
        {
          title: "1. Podman Compose Deployment",
          language: "bash",
          code: `# Validate the container composition
podman compose config

# Build and launch all services in detached mode
podman compose up --build -d

# Inspect container status and health probes
podman compose ps

# Follow container server logs
podman compose logs -f backend`
        },
        {
          title: "2. WSL2 / Podman Machine Memory Tuning",
          language: "ini",
          code: `# If running Podman Machine on Windows WSL2, configure %USERPROFILE%\\.wslconfig
[wsl2]
memory=8GB
processors=4
swap=4GB
localhostForwarding=true`
        }
      ],
      deepDive: [
        {
          title: "Networking with Host Ollama",
          body: "By default, Ollama binds to 127.0.0.1 on the host machine. To allow the containerized backend to communicate with your host's GPU-accelerated Ollama, set OLLAMA_HOST=0.0.0.0 in your host environment and launch Ollama. Inside compose.yaml, the backend references http://host.containers.internal:11434."
        }
      ]
    }
  },
  {
    id: "rag-engine",
    category: "features",
    title: "Vector Embeddings & RAG Retrieval",
    badge: "Deterministic RAG",
    icon: Search,
    summary: "Mathematical cosine similarity retrieval, passage re-ranking, and strict hallucination prevention.",
    content: {
      description: `The EchoVault RAG engine solves the critical preservation problem of AI hallucinations. Instead of allowing the model to fabricate recollections, EchoVault guarantees that every synthesized phrase points back to a verifiable historical passage.`,
      highlights: [
        "Hybrid Search Pipeline: Combines dense vector similarity with lexical content-word overlap ratio verification.",
        "Graceful Uncertainty: Explicitly responds with 'No verified historical evidence found' when asked unsupported questions.",
        "Confidence Statements: Computes exact percentage relevance metrics for each retrieved archival quote.",
        "Offline Deterministic Vectorizer: Provides hash-based dense indexing without requiring any external model downloads."
      ],
      table: {
        headers: ["Metric", "Threshold / Value", "Preservation Purpose"],
        rows: [
          ["Passage Chunk Size", "350 characters", "Optimal granularity for matching specific sentences and dates"],
          ["Boundary Overlap", "50 characters", "Preserves context across sentence boundaries"],
          ["Top-K Retrieved", "5 passages", "Provides balanced multi-source context without context bloat"],
          ["Overlap Ratio Threshold", "0.35 (35%)", "Rejects spurious lexical matches and forces honest uncertainty"],
          ["Embedding Dimensions", "768 / 8192 dims", "Dense semantic clustering of memories and dates"]
        ]
      },
      codeSnippets: [
        {
          title: "RAG Verification Flow & Boundary Prompt",
          language: "python",
          code: `SYSTEM_PROMPT = """You are EchoVault, a private archival memory assistant.
Answer the user's question using ONLY the evidence passages below.
Do not speculate or extrapolate beyond what is stated.
Cite your sources with [1], [2] corresponding to the evidence index.
If the evidence does not contain the answer, reply:
'I do not find evidence for that in your archive.'

<ARCHIVAL_EVIDENCE>
[1] Title: The Autumn Lantern Walk
    Date: 1952-10-15
    Passage: "Aunt Clara brought warm spiced apple buns..."
</ARCHIVAL_EVIDENCE>"""`
        }
      ],
      deepDive: [
        {
          title: "Hallucination Containment Mechanism",
          body: "When the user asks about an unknown topic (e.g. 'What color was the sports car in 1999?'), the vector search retrieves candidate passages. Before prompting the LLM, the RAG service extracts query keywords (filtering out 80+ common English stopwords) and computes the overlap ratio against candidate passages. If overlap < 0.35, synthesis is short-circuited and the response returns evidence_status='insufficient' with zero citations."
        }
      ]
    }
  },
  {
    id: "ai-models",
    category: "ai",
    title: "AI Model Cards & Hardware Sizing",
    badge: "Open-Weights",
    icon: Cpu,
    summary: "Evaluated open-weight models, licenses, memory footprints, and CPU/GPU inference requirements.",
    content: {
      description: `EchoVault is strictly model-independent. It does not lock users into a single provider and operates cleanly with any open-weight LLM supported by Ollama.`,
      highlights: [
        "Llama 3.2 (Meta Community License): 1B and 3B parameter models tuned for edge devices and CPU laptops.",
        "Qwen 2.5 (Apache 2.0): Premier multilingual reasoning for European, Asian, and historical regional dialects.",
        "Nomic Embed Text (Apache 2.0): Long-context (8,192 token) dense embedding model for whole documents.",
        "Deterministic Vectorizer (Built-in): Zero-memory, instant offline embedding fallback for low-spec systems."
      ],
      table: {
        headers: ["Model", "Parameters", "Min RAM", "VRAM (GPU)", "Inference Speed (CPU)", "License"],
        rows: [
          ["Llama 3.2 1B", "1.23 Billion", "3.0 GB", "1.5 GB", "24-35 tokens/sec", "Llama 3.2 Community"],
          ["Llama 3.2 3B (Recommended)", "3.21 Billion", "4.5 GB", "2.8 GB", "12-20 tokens/sec", "Llama 3.2 Community"],
          ["Qwen 2.5 1.5B", "1.54 Billion", "3.2 GB", "1.8 GB", "20-28 tokens/sec", "Apache 2.0"],
          ["Mistral 7B Instruct", "7.24 Billion", "8.0 GB", "5.5 GB", "4-8 tokens/sec", "Apache 2.0"],
          ["Nomic Embed Text", "137 Million", "1.0 GB", "0.5 GB", "Instantaneous (<15ms)", "Apache 2.0"]
        ]
      },
      codeSnippets: [
        {
          title: "Pulling Verified Models via Ollama",
          language: "bash",
          code: `# Recommended standard setup
ollama pull llama3.2:3b
ollama pull nomic-embed-text

# Lightweight laptop setup (under 4GB RAM)
ollama pull llama3.2:1b

# Verify models are loaded
ollama list`
        }
      ]
    }
  },
  {
    id: "security",
    category: "security",
    title: "Threat Model & Privacy Safeguards",
    badge: "Air-Gapped",
    icon: ShieldCheck,
    summary: "Defense-in-depth security model: path traversal defense, SHA-256 deduplication, and zero-telemetry guarantee.",
    content: {
      description: `Family archives contain the most intimate human artifacts: birth certificates, love letters, oral recordings, and personal reflections. EchoVault's security model assumes the host network could be hostile and enforces strict isolation.`,
      highlights: [
        "Cryptographic Filename Hashing: Uploaded files are stripped of user-controlled names and keyed by SHA-256.",
        "Path Traversal Prevention: File operations validate canonical path resolution within data/uploads/ only.",
        "Sanitized Logging: Sensitive memory text, questions, and private reflections are explicitly masked from logs.",
        "Prompt Injection Containment: Ingested letters cannot break out of their XML evidence containment boundaries."
      ],
      table: {
        headers: ["Threat Vector", "Risk Level", "Architectural Defense Mechanism"],
        rows: [
          ["Path Traversal (e.g. ../../etc/passwd)", "Critical", "os.path.realpath validation; reject any path outside data/uploads"],
          ["Prompt Injection via Uploaded Letters", "High", "Passages wrapped in immutable <ARCHIVAL_EVIDENCE> delimiters"],
          ["Cloud Data Leakage", "Critical", "Zero outbound network dependencies; strict air-gapped container design"],
          ["Accidental Vault Deletion", "High", "DELETE /api/data/reset requires exact confirmation phrase 'DELETE_ALL_MEMORIES'"],
          ["Storage DoS via Bomb Uploads", "Medium", "Enforces 50MB max file size and SHA-256 content deduplication"]
        ]
      },
      codeSnippets: [
        {
          title: "Path Traversal Defense Implementation",
          language: "python",
          code: `def get_safe_file_path(base_dir: Path, filename: str) -> Path:
    # Resolve canonical absolute path
    resolved_path = (base_dir / filename).resolve()
    base_resolved = base_dir.resolve()
    
    # Assert path strictly resides inside base_dir
    if not str(resolved_path).startswith(str(base_resolved)):
        raise SecurityError("Directory traversal attack detected.")
    return resolved_path`
        }
      ]
    }
  },
  {
    id: "timeline-engine",
    category: "features",
    title: "Chronological Timeline & Conflict Engine",
    badge: "Historical Truth",
    icon: Clock,
    summary: "Exact date handling, seasonal approximations, and automated historical conflict detection.",
    content: {
      description: `Historical records frequently disagree: family letters may claim a wedding occurred in 1923, while an official ledger places it in 1925. Rather than forcing a false consensus, EchoVault documents and highlights historical discrepancies.`,
      highlights: [
        "Date Precision Spectrum: Supports exact dates (1944-06-06), months (1952-10), decades (1920s), and unknown eras.",
        "Discrepancy Highlighting: Visual conflict flags alert the archivist when conflicting dates or accounts exist.",
        "Sortable Chronology: Automatic chronological sequencing across heterogeneous sources (stories, letters, audio).",
        "Source Backlinks: Every timeline event links directly back to the original archival document."
      ],
      table: {
        headers: ["Date Precision", "Stored Representation", "Display Example", "Sorting Key"],
        rows: [
          ["exact", "1952-10-15", "October 15, 1952", "1952-10-15T00:00:00"],
          ["month", "1944-06", "June 1944", "1944-06-01T00:00:00"],
          ["year", "1923", "Circa 1923", "1923-01-01T00:00:00"],
          ["decade", "1920s", "The 1920s", "1920-01-01T00:00:00"],
          ["unknown", "unknown", "Undated Historical Era", "9999-12-31T23:59:59"]
        ]
      }
    }
  },
  {
    id: "remembrance-sanctuary",
    category: "features",
    title: "Remembrance Room Sanctuary",
    badge: "Ethical AI",
    icon: Heart,
    summary: "Respectful ancestral tributes, authentic recordings, and rejection of deceptive conversational simulations.",
    content: {
      description: `The Remembrance Room provides a serene, dignified space to celebrate the life of deceased ancestors through authentic recollections, cherished recipes, and handwriting without deceptive generative simulations.`,
      highlights: [
        "Non-Generative Ethics: Explicit refusal to simulate artificial voices or generate fake conversational personas.",
        "Sensory Keepsakes: Preserves favorite melodies, traditional recipes, and handwritten sayings.",
        "Deckled Vintage Imagery: Portrait framing with warm sepia tones honoring ancestral dignity.",
        "Permanent Sovereignty: Remembrance tributes are bundled into portable ZIP archive backups."
      ]
    }
  },
  {
    id: "api-reference",
    category: "api",
    title: "REST API Playground & Endpoint Reference",
    badge: "Interactive",
    icon: FileCode,
    summary: "Interactive REST endpoint explorer, copyable curl commands, and response schema definitions.",
    content: {
      description: `The EchoVault REST API provides a complete programmatic interface for managing memory artifacts, conversational search, timeline sequencing, and sovereign data export.`,
      highlights: [
        "Standardized RESTful Endpoints: Communicates via JSON payloads with predictable HTTP status codes.",
        "Interactive Testing: Test live endpoints against your running local backend directly from this documentation page.",
        "Cryptographic Integrity: Enforces SHA-256 fingerprint checks on all memory creation endpoints."
      ],
      table: {
        headers: ["Method", "Endpoint", "Summary", "Response Codes"],
        rows: [
          ["GET", "/api/health", "Liveness probe for orchestration", "200 OK"],
          ["GET", "/api/status", "System readiness, memory count, storage, and Ollama status", "200 OK"],
          ["GET", "/api/memories", "List memories with search, type filters, and pagination", "200 OK"],
          ["POST", "/api/memories", "Multipart upload and passage indexing", "201 Created, 409 Conflict"],
          ["POST", "/api/search", "Dense cosine vector similarity search across passages", "200 OK"],
          ["POST", "/api/chat", "Evidence-grounded conversational search with citations", "200 OK"],
          ["GET", "/api/timeline", "Chronological events with precision and conflict notes", "200 OK"],
          ["GET", "/api/remembrance", "List ancestral remembrance sanctuary tributes", "200 OK"],
          ["GET", "/api/export", "Generate standalone portable archive ZIP file", "200 OK"],
          ["DELETE", "/api/data/reset", "Purge all records (requires confirmation phrase)", "200 OK, 400 Bad Request"]
        ]
      },
      codeSnippets: [
        {
          title: "Query Conversational Search (cURL)",
          language: "bash",
          code: `curl -X POST http://localhost:8000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"query": "When was the river lantern walk and what did Aunt Clara bring?"}'`
        },
        {
          title: "Inspect System & Inference Status (cURL)",
          language: "bash",
          code: `curl http://localhost:8000/api/status`
        }
      ]
    }
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("architecture");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Live API Explorer state
  const [apiEndpoint, setApiEndpoint] = useState("/api/status");
  const [apiMethod, setApiMethod] = useState<"GET" | "POST">("GET");
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Filter topics based on search and category
  const filteredTopics = useMemo(() => {
    return DOCS_DATA.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const activeDoc = useMemo(() => {
    return (
      DOCS_DATA.find((d) => d.id === activeTab) ||
      filteredTopics[0] ||
      DOCS_DATA[0]
    );
  }, [activeTab, filteredTopics]);

  function copyCode(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  }

  async function testLiveApi() {
    setApiLoading(true);
    setApiResult(null);
    try {
      const res = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: { "Content-Type": "application/json" },
        body: apiMethod === "POST" ? JSON.stringify({ query: "harvest lantern" }) : undefined
      });
      const data = await res.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setApiResult(
        JSON.stringify(
          {
            error: "Failed to connect to backend",
            hint: "Make sure backend server is running on http://localhost:8000",
            details: (e as Error).message
          },
          null,
          2
        )
      );
    } finally {
      setApiLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-vault-950 text-ivory-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* HEADER HERO */}
        <div className="border-b border-vault-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-gold-400 uppercase tracking-widest px-3 py-1 rounded-full bg-vault-900 border border-gold-500/20">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span>Architectural Specification & Technical Manual</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium text-ivory-100 tracking-tight">
              System Specifications & Architecture
            </h1>
            <p className="text-sm text-ivory-300 max-w-2xl font-light leading-relaxed">
              Comprehensive architectural guides, container orchestration blueprints, deterministic RAG retrieval algorithms, threat models, and live REST specifications for Hacktoberfest 2026.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/app"
              className="px-4 py-2.5 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 text-xs font-semibold inline-flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="px-4 py-2.5 rounded bg-vault-900 border border-vault-700 hover:border-gold-500/40 text-ivory-200 text-xs font-medium inline-flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Interactive Sandbox</span>
            </Link>
          </div>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-lg bg-vault-900/80 border border-vault-800 backdrop-blur animate-fade-up animate-delay-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ivory-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search architecture, algorithms, Podman commands, endpoints, security..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-vault-950 border border-vault-750 rounded-md pl-9 pr-4 py-2 text-xs text-ivory-100 placeholder:text-ivory-500 focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
            {[
              { id: "all", label: "All Docs" },
              { id: "architecture", label: "Architecture" },
              { id: "deployment", label: "Podman" },
              { id: "features", label: "RAG & Engine" },
              { id: "ai", label: "Models" },
              { id: "security", label: "Security" },
              { id: "api", label: "API Reference" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-gold-500 text-vault-950 font-semibold shadow-sm"
                    : "bg-vault-850 hover:bg-vault-800 text-ivory-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN DOCUMENTATION WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up animate-delay-2">
          {/* NAVIGATION SIDEBAR (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between px-3 pb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ivory-400">
                Documentation Modules ({filteredTopics.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {filteredTopics.map((topic) => {
                const Icon = topic.icon;
                const isActive = activeDoc.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTab(topic.id)}
                    className={`w-full p-3.5 rounded-lg border text-left transition-all flex items-start space-x-3 ${
                      isActive
                        ? "bg-vault-900 border-gold-500/60 shadow-md ring-1 ring-gold-500/30"
                        : "bg-vault-900/40 border-vault-800/70 hover:bg-vault-900 hover:border-vault-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded mt-0.5 shrink-0 ${
                        isActive
                          ? "bg-gold-500/15 text-gold-400 border border-gold-500/30"
                          : "bg-vault-850 text-ivory-400 border border-vault-750"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-serif text-sm font-medium truncate ${
                            isActive ? "text-gold-300" : "text-ivory-100"
                          }`}
                        >
                          {topic.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-vault-950 border border-vault-750 text-gold-400/90 shrink-0 ml-1">
                          {topic.badge}
                        </span>
                      </div>
                      <p className="text-xs text-ivory-400 line-clamp-2 leading-relaxed font-light">
                        {topic.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Specs Callout */}
            <div className="mt-6 p-4 rounded-lg bg-vault-900/60 border border-vault-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Telemetry Guarantee</span>
              </div>
              <p className="text-[11px] text-ivory-400 font-light leading-relaxed">
                EchoVault does not emit metrics, crash logs, or analytics to any cloud endpoints. All LLM queries and memory chunks stay strictly inside your workstation.
              </p>
            </div>
          </div>

          {/* ACTIVE DOCUMENT VIEWPORT (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-6 sm:p-8 rounded-xl bg-vault-900 border border-vault-750 shadow-xl space-y-8">
              {/* Document Header */}
              <div className="border-b border-vault-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                    Category: {activeDoc.category}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ivory-100">
                    {activeDoc.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
                    {activeDoc.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono">
                    Verified
                  </span>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-ivory-200 leading-relaxed font-light font-serif">
                  {activeDoc.content.description}
                </p>

                {/* Key Highlights */}
                {activeDoc.content.highlights && (
                  <div className="p-4 rounded-lg bg-vault-950 border border-vault-800 space-y-2.5">
                    <span className="text-xs font-mono uppercase text-gold-400 tracking-wider">
                      Architectural Guarantees
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-ivory-300 font-light">
                      {activeDoc.content.highlights.map((h, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Data Table View */}
              {activeDoc.content.table && (
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-gold-400 tracking-wider">
                    Specification Matrix
                  </span>
                  <div className="overflow-x-auto rounded-lg border border-vault-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-vault-950 border-b border-vault-800 text-ivory-300 font-mono">
                          {activeDoc.content.table.headers.map((h, i) => (
                            <th key={i} className="p-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-vault-800/60 font-sans">
                        {activeDoc.content.table.rows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-vault-850/50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-3 ${
                                  cIdx === 0
                                    ? "font-mono font-medium text-gold-300"
                                    : "text-ivory-300 font-light"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Code Snippets with Copy Functionality */}
              {activeDoc.content.codeSnippets && (
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase text-gold-400 tracking-wider">
                    Code Blueprints & Orchestration
                  </span>
                  {activeDoc.content.codeSnippets.map((snip, idx) => {
                    const snippetKey = `${activeDoc.id}-${idx}`;
                    const isCopied = copiedSnippet === snippetKey;
                    return (
                      <div
                        key={idx}
                        className="rounded-lg border border-vault-800 bg-vault-950 overflow-hidden shadow-inner"
                      >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-vault-800 bg-vault-900/60 text-xs">
                          <span className="font-mono text-ivory-300 flex items-center space-x-2">
                            <Code2 className="w-3.5 h-3.5 text-gold-400" />
                            <span>{snip.title}</span>
                          </span>
                          <button
                            onClick={() => copyCode(snip.code, snippetKey)}
                            className="flex items-center space-x-1 text-ivory-400 hover:text-gold-300 font-mono text-[11px] transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-ivory-200 overflow-x-auto leading-relaxed">
                          <code>{snip.code}</code>
                        </pre>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Deep Dive Engineering Analyses */}
              {activeDoc.content.deepDive && (
                <div className="space-y-4 border-t border-vault-800 pt-6">
                  <span className="text-xs font-mono uppercase text-gold-400 tracking-wider">
                    Engineering Deep Dive
                  </span>
                  <div className="grid grid-cols-1 gap-4">
                    {activeDoc.content.deepDive.map((d, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-vault-850/70 border border-vault-800 space-y-2"
                      >
                        <h4 className="font-serif text-base font-medium text-ivory-100">
                          {d.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-ivory-300 leading-relaxed font-light">
                          {d.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INTERACTIVE REST API EXPLORER (for api-reference) */}
              {activeDoc.id === "api-reference" && (
                <div className="p-5 rounded-lg bg-vault-950 border border-gold-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-gold-400 flex items-center space-x-1.5 font-bold">
                      <Terminal className="w-4 h-4 text-gold-400" />
                      <span>Live REST API Tester</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Direct Local In-Browser Query
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select
                      value={apiMethod}
                      onChange={(e) => setApiMethod(e.target.value as any)}
                      className="bg-vault-900 border border-vault-700 rounded px-3 py-2 text-xs font-mono text-ivory-100 focus:outline-none focus:border-gold-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>

                    <input
                      type="text"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      placeholder="/api/status"
                      className="flex-1 bg-vault-900 border border-vault-700 rounded px-3 py-2 text-xs font-mono text-ivory-100 focus:outline-none focus:border-gold-500 w-full"
                    />

                    <button
                      onClick={testLiveApi}
                      disabled={apiLoading}
                      className="w-full sm:w-auto px-4 py-2 rounded bg-gold-500 hover:bg-gold-600 text-vault-950 text-xs font-semibold font-mono flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                    >
                      {apiLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>Execute Query</span>
                    </button>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                    <span className="text-ivory-500">Presets:</span>
                    {[
                      { method: "GET", path: "/api/health" },
                      { method: "GET", path: "/api/status" },
                      { method: "GET", path: "/api/memories" },
                      { method: "GET", path: "/api/timeline" },
                      { method: "GET", path: "/api/remembrance" }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setApiMethod(p.method as any);
                          setApiEndpoint(p.path);
                        }}
                        className="px-2 py-1 rounded bg-vault-900 border border-vault-750 text-ivory-300 hover:text-gold-300 transition-colors"
                      >
                        {p.method} {p.path}
                      </button>
                    ))}
                  </div>

                  {apiResult && (
                    <div className="mt-3 space-y-1">
                      <span className="text-[11px] font-mono text-ivory-400">
                        Response Payload:
                      </span>
                      <pre className="p-3.5 rounded bg-vault-900 border border-vault-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-60 leading-relaxed">
                        {apiResult}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* View Source in Git repository */}
              <div className="pt-6 border-t border-vault-800 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-400 font-mono gap-3">
                <span className="truncate">
                  Source: docs/{activeDoc.id.replace(/-/g, "_").toUpperCase()}.md
                </span>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/demo"
                    className="text-gold-400 hover:text-gold-300 inline-flex items-center space-x-1"
                  >
                    <span>Test in Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
