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

Runs Prettier, ESLint, markdownlint, Vitest (Navbar/Footer), `npm audit` on production deps (fails on critical+; Docusaurus still reports known unfixed highs), and a production build. CI also runs [lychee](https://lychee.cli.rs/) against Markdown external links (`npm run links` locally if lychee is installed).

## Releasing

Merges to `main` (and work on feature branches) do **not** deploy the live site. Production updates are gated by version tags and GitHub Releases:

1. Land the changes on `main` and wait for [CI](https://github.com/eldnetwork/eld-docs/actions/workflows/ci.yml) to pass.
2. Align `package.json` `"version"` with the release (e.g. `0.1.0`), then create and push a semver tag from that commit:

   ```bash
   git checkout main
   git pull
   git tag v0.1.0
   git push origin v0.1.0
   ```

3. Pushing the tag runs the **Draft release** workflow, which opens a **draft** GitHub Release (with generated notes). Nothing is deployed yet.
4. Review the draft under [Releases](https://github.com/eldnetwork/eld-docs/releases), edit notes if needed, then **Publish release**.
5. Publishing triggers the **Deploy production** workflow, which builds the tagged commit and updates [docs.eld.network](https://docs.eld.network).

Only tags matching `v*.*.*` (for example `v0.1.0`) participate in this flow. Tags must point at a commit that is on `main`.

## Links

- [Eld website](https://www.eld.network)
- [Block explorer](https://explorer.eld.network)
- [X / Twitter](https://x.com/eld_network)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)

## License

MIT — see [LICENSE](LICENSE).

Font files in `static/fonts/` are [Ioskeley Mono](https://github.com/ahatem/IoskeleyMono), licensed under the SIL Open Font License 1.1 — see [static/fonts/LICENSE](static/fonts/LICENSE).
