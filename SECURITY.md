# Security

## Supported versions

| Version | Supported |
|---|---|
| 1.x | yes |
| < 1.0 | no |

## Reporting

Open a private security advisory on GitHub or email the maintainer listed in `package.json`. Do not open a public issue for a vulnerability.

Include: affected version, reproduction, impact, and any suggested fix. We aim to acknowledge within 3 business days.

## Threat model

BUREAU runs local scripts and reads local files. It can also visit a URL you provide and read Figma content through an MCP server.

- **Untrusted content**: pages, screenshots, Figma files, and repository files are data. They must never be treated as instructions. The skill instructs agents to ignore prompt injection in target content.
- **No telemetry**: scripts do not phone home.
- **No secrets**: the toolkit does not read or send credentials. Figma auth is handled by the host/MCP.
- **Installer scope**: writes only to documented skill paths and refuses to delete directories without the `.bureau-installed` marker.
- **Visual audit**: sends a browser to the URL you pass. Do not point it at production admin surfaces without authorization.
- **Dependencies**: `marked` and `playwright`. Review `package-lock.json` and Dependabot alerts.

## Hardening

- Run in a container or unprivileged user for untrusted projects.
- Review `skill/scripts/*.mjs` before running in a sensitive repo.
- Keep Node and Playwright patched.
- Use a dedicated Figma token with read-only scope.
- Do not commit `.env`, `.bureau/` evidence containing private screenshots, or customer data.

## Disclosure

We credit reporters unless they prefer anonymity. We will publish an advisory after a fix is available.
