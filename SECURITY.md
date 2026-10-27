# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

EchoVault is designed for private, sensitive family histories and personal archives. We take security vulnerabilities seriously.

If you believe you have discovered a vulnerability in EchoVault (including path traversal, prompt injection bypasses, SSRF in local AI proxy, or insecure storage):

1. **Do not open a public issue.**
2. Send a report via email to `security@echovault.local` or submit a private security advisory on GitHub.
3. Include:
   - Type of vulnerability.
   - Exact steps or proof-of-concept script.
   - Any suggested mitigations.
4. We will acknowledge receipt within 48 hours and work with you on a coordinated remediation release.

For complete architectural threat modeling and security mitigations, please refer to [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) and [docs/SECURITY.md](docs/SECURITY.md).
