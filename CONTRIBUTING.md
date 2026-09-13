# Contributing

Thanks for helping improve Eld docs.

This repository is the public documentation site only (`https://docs.eld.network`) — not the Eld protocol, node software, or SDKs.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20 (see `.nvmrc`)

## Local setup

```bash
npm install
npm start
```

## Before you open a PR

```bash
npm run ci
```

That runs Prettier, ESLint, markdownlint, unit tests, npm audit, and a production build. Prefer editing docs as clear Markdown; avoid raw HTML unless needed for media or layout.

## Docs content guidelines

- Keep pages focused; prefer one topic per page
- Use relative links between docs pages when possible
- User-facing CLI examples must use `eld-cli` (not `cargo run`)
- Do not embed untrusted third-party scripts or opaque HTML
- Do not commit secrets, credentials, or private deploy config

## Pull requests

1. Keep changes scoped and easy to review
2. Run `npm run ci` locally
3. Describe what changed and why

## Security

Do not report security vulnerabilities in public issues. See [SECURITY.md](SECURITY.md).
