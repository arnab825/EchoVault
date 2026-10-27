# Known Limitations & Roadmap: EchoVault

## Current MVP Limitations

1. **OCR Dependencies**: Automatic OCR for handwriting and low-resolution scanned imagery relies on system Tesseract installations. When Tesseract is not installed on the host, users must provide transcription text alongside image uploads.
2. **Audio Transcription**: Automated speech-to-text requires `faster-whisper`. On machines without a GPU or whisper installed, audio files are indexed via user-provided metadata and manual transcript notes.
3. **Single-User Scope**: Current architecture is optimized for a single individual or family archivist on a local workstation. Multi-user concurrent editing requires session-based authentication.
4. **Context Window Bounds**: Bounded evidence context injects the top-5 most relevant passages into the model context window. Questions requiring synthesis across hundreds of disparate letters simultaneously may require progressive multi-stage summarization.

---

## Roadmap

- **v1.1**: Integrated WASM-based OCR and Whisper inference inside the browser client.
- **v1.2**: Genealogical family tree graph visualizer linking people, places, and letters.
- **v1.3**: P2P air-gapped archive synchronization between family members via local Wi-Fi or encrypted USB keys.
