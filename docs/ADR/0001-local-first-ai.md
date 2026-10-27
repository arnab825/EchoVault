# ADR 0001: Local-First AI via Ollama and Deterministic Fallback

## Status
Accepted

## Context
EchoVault is designed for preserving private personal and family histories (letters, medical accounts, intimate reflections). Commercial cloud LLMs (OpenAI, Anthropic, Google Cloud) require transmitting sensitive documents over the internet and paying ongoing API subscription fees, creating privacy vulnerabilities and vendor lock-in.

## Decision
We adopted a local-first AI architecture centered on **Ollama** as the primary open-weight inference runtime, paired with an **offline deterministic grounded synthesizer** fallback.

1. **Ollama Integration**: Connects via HTTP REST to a local Ollama daemon supporting open-weight models (Llama 3.2, Qwen 2.5, Mistral, Gemma 2).
2. **Deterministic Fallback**: If Ollama is offline or model weights are not downloaded, the system uses a dense bag-of-words/n-gram vectorizer and grounded template synthesizer that cites actual passage excerpts.

## Alternatives Considered
- **Cloud AI (OpenAI/Anthropic)**: Rejected due to violation of personal privacy, potential training on user memories, and reliance on commercial credit cards.
- **Embedded Python LLM (llama-cpp-python)**: Rejected due to complex C++ compiler dependencies across diverse developer machines.

## Consequences
- **Positive**: 100% privacy, zero cloud costs, air-gapped execution, model independence.
- **Negative**: Users must have adequate RAM (4GB–8GB) to run local open-weight models with high inference speed.
