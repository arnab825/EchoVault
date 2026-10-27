# Contributing to EchoVault

Thank you for your interest in contributing to EchoVault! We welcome issues, bug reports, feature discussions, and pull requests.

## Development Workflow

1. Fork the repository and clone your fork.
2. Create a topic branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Set up the local environment:
   - Backend: Python 3.10+, FastAPI, Pytest (`cd backend && pip install -r requirements.txt`)
   - Frontend: Node.js 18+, Next.js (`cd frontend && npm install`)
4. Ensure all tests pass:
   ```bash
   cd backend && pytest tests/ -v
   cd frontend && npm run build
   ```
5. Follow our coding guidelines:
   - Keep privacy and security central to every design decision.
   - Never commit private personal histories or real credentials.
   - Keep AI prompts evidence-grounded and prevent hallucination.
   - Maintain accessibility standards (WCAG 2.1 AA).
6. Submit a descriptive Pull Request referencing any associated issues.

## Reporting Issues

- Use the GitHub Issue Tracker to report bugs or request features.
- If reporting a security vulnerability, please follow our [Security Policy](SECURITY.md).
