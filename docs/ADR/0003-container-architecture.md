# ADR 0003: Podman Desktop & Container Compose Architecture

## Status
Accepted

## Context
Hacktoberfest 2026 requires verified local containerization using Podman Desktop. The application must run cleanly across Windows, Linux, and macOS.

## Decision
We authored standardized root container configurations:
1. `backend.Containerfile`: Multi-stage Python 3.12 slim image with system dependencies, healthcheck probe, and Uvicorn entry point.
2. `frontend.Containerfile`: Multi-stage Node.js 20 Alpine image running Next.js in production standalone mode.
3. `compose.yaml`: Standardized compose file declaring shared network `echovault_network`, named volume `echovault_data`, and host-gateway bridge for reaching Ollama on the host.

## Alternatives Considered
- **Single Monolithic Container**: Rejected because frontend and backend have distinct runtimes (Node.js vs Python) and scaling characteristics.
- **Docker-Only Directives**: Rejected to maintain full compatibility with rootless Podman Desktop and Linux container engines.

## Consequences
- **Positive**: Clean service isolation, reproducible across development and production, native Podman Desktop support.
- **Negative**: Requires container engine setup on the host machine.
