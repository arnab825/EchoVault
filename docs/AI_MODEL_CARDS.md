# AI Model Cards & Licensing: EchoVault

EchoVault is strictly model-independent. The application communicates with any compatible model runtime via Ollama REST protocols.

---

### 1. Llama 3.2 (Meta)
- **Model Sizes**: 1B (`llama3.2:1b`), 3B (`llama3.2:3b`)
- **License**: Meta Llama 3.2 Community License
- **Architecture**: Dense Transformer decoder with Grouped-Query Attention (GQA)
- **Context Length**: 128,000 tokens
- **Hardware Profile**:
  - `llama3.2:1b`: ~1.3 GB VRAM / System RAM; fast CPU execution.
  - `llama3.2:3b`: ~2.5 GB VRAM / System RAM; ideal balance of literary nuance and factual adherence.
- **Role in EchoVault**: Primary recommendation for consumer laptops and local desktop use.

---

### 2. Qwen 2.5 (Alibaba Cloud)
- **Model Sizes**: 1.5B (`qwen2.5:1.5b`), 7B (`qwen2.5:7b`)
- **License**: Apache 2.0
- **Context Length**: 32,768 tokens
- **Hardware Profile**:
  - `qwen2.5:1.5b`: ~1.8 GB RAM; runs on virtually all 64-bit systems.
- **Role in EchoVault**: Recommended for multi-lingual memory archives (letters in European, Asian, or Middle Eastern languages).

---

### 3. Nomic Embed Text (Nomic AI)
- **Model**: `nomic-embed-text`
- **License**: Apache 2.0
- **Embedding Dimensions**: 768
- **Context Window**: 8,192 tokens
- **Role in EchoVault**: Dense passage embedding for semantic vector search across long historical letters and transcripts.

---

### 4. EchoVault Offline Deterministic Synthesizer
- **Model**: Internal zero-dependency vectorizer & template synthesizer
- **License**: Apache 2.0
- **Role in EchoVault**: Built-in fallback ensuring the application and automated test suites operate reliably even without downloading multi-gigabyte neural weights.
