# Eld Docs

![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs&logoColor=white)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![CI](https://github.com/eldnetwork/eld-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/eldnetwork/eld-docs/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/website?url=https%3A%2F%2Fdocs.eld.network&label=docs)](https://docs.eld.network)

Documentation site for the [Eld](https://www.eld.network) blockchain, built with [Docusaurus](https://docusaurus.io/).

This repository is the public documentation site only — not the Eld protocol, node software, or SDKs. For the marketing site and live chain, see [eld.network](https://www.eld.network).

**Live site:** [https://docs.eld.network](https://docs.eld.network)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20

## Local development

```bash
npm install
npm start
```

This starts a local dev server at [http://localhost:3000](http://localhost:3000). Most changes reload automatically.

## Build

```bash
npm run build
```

Static output is written to the `build/` directory.

To preview the production build locally:

```bash
npm run serve
```

## CI

```bash
npm run ci
```

Runs Prettier (including Markdown), `npm audit` on production deps (fails on critical+; Docusaurus still reports known unfixed highs), and a production build.

## Links

- [Eld website](https://www.eld.network)
- [Block explorer](https://explorer.eld.network)
- [X / Twitter](https://x.com/eld_network)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## License

MIT — see [LICENSE](LICENSE).

Font files in `static/fonts/` are [Ioskeley Mono](https://github.com/ahatem/IoskeleyMono), licensed under the SIL Open Font License 1.1 — see [static/fonts/LICENSE](static/fonts/LICENSE).
