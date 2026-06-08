---
title: Custom Namespaces
description: Register custom @namespace slugs on Eld and publish pinboard content under namespace paths.
---

# Custom namespaces

A **custom namespace** is a registered slug on Eld (e.g. `alice`) that maps to scope **`@alice`**. Registration is on-chain; pinboard uploads can then attach content under namespace paths instead of only under `/@eld/pinboard/...`.

This page covers registration, uploads, paths, and read APIs. For CADO path conventions in general, see [Content addresses](./content-addresses).

## Overview

| Concept | Example | Meaning |
|---------|---------|---------|
| `namespace_slug` | `alice` | Canonical registry key (lowercase, validated) |
| `scope` | `@alice` | User-facing scope (`@` + slug) |
| Registry CADO | `/@eld/namespace/alice` | Immutable on-chain registration record |
| Content path | `/@alice/msg-abc123` | Pinboard post metadata/blob keyed by namespace + `message_id` |

Flow in short:

1. **Register** — Submit an `AddNamespace` transaction (one slug per successful registration).
2. **Upload** — Post pinboard content with `--namespace <slug>`; the posting wallet must be the namespace **owner**.
3. **Read** — Query registry and lists via the node app REST API (explorer-friendly).

## Register a namespace (`AddNamespace`)

Any account can register an unused slug by paying a **registration fee** (configurable on the tx; must be greater than zero).

**Slug rules** (normalized server-side: trim + lowercase):

- Length **3–32** characters
- Characters: `a–z`, `0–9`, single hyphens `-`
- Must not start or end with `-`; no `--`
- Reserved slugs cannot be registered: `eld`, `user`, `public`, `contract`, `test`, `other`, `pinboard`, `admin`, `namespace`

**On-chain record** (`NamespaceRecord` at `/@eld/namespace/{slug}`):

- `namespace_slug` — canonical slug
- `owner` — registrant address at registration time
- `registered_height` — block height when registered

```bash
eld-cli add-namespace <wallet_name> <namespace_slug> [--registration-fee <amount>]
eld-cli get-namespace <namespace_slug>
```

`add-namespace` submits the tx and polls `GET /v1/namespace/{slug}` until the registry shows `registered: true`.

## Upload content under a namespace

Pinboard uploads work the same as default Eld pinboard posts, with an optional namespace:

```bash
eld-cli post-pinboard-message <wallet_name> <file_path> \
  --content-type text/plain \
  --namespace alice
```

Requirements:

- The namespace must already be **registered**.
- The posting wallet address must match the namespace **owner** recorded at registration.
- The node validates the signed submit request, then a validator includes **PostMessage** in a block.

**Path layout** for namespace posts (secondary metadata key):

```text
/@{namespace_slug}/{message_id}
```

Example:

```text
/@alice/deadbeef0123...
```

Default Eld pinboard posts (no `--namespace`) still use:

```text
/@eld/pinboard/post/{wallet}/{message_id}
```

After commit, REST lookups can use the namespace path with `GET /v1/pinboard/post?path=/@alice/{message_id}` (see [Content addresses](./content-addresses#namespace-content-paths)).

## Read APIs (node app)

Base URL: `http://<host>:<app_port>` (often port **9001** locally).

### List all registered namespaces

`GET /v1/namespaces`

| Query param | Default | Max | Notes |
|-------------|---------|-----|-------|
| `limit` | `50` | `100` | Page size |
| `after_registered_height` | — | — | Continuation (pair with `after_namespace_slug`) |
| `after_namespace_slug` | — | — | Continuation |

Sort: **`registered_height` descending**, then `namespace_slug` ascending.

```json
{
  "namespaces": [
    {
      "namespace_slug": "alice",
      "scope": "@alice",
      "owner": "0x…",
      "registered_height": 1200,
      "registry_path": "/@eld/namespace/alice"
    }
  ],
  "pagination": {
    "limit": 50,
    "has_next": false,
    "total": 1
  }
}
```

`pagination.total` is returned on the **first** page only; omitted when continuing with `after_*` params.

### Namespace detail

`GET /v1/namespace/{namespace_slug}`

- **200** — registered (`registered: true`, owner, height, `registry_path`, `scope`)
- **404** — not registered (`registered: false`, `namespace_slug`)

Slug in the path is normalized (trim + lowercase) like registration input.

## Explorer and UI notes

- **List page:** `GET /v1/namespaces?limit=50`; load more with `after_registered_height` + `after_namespace_slug` from the last row when `has_next` is true.
- **Detail page:** `GET /v1/namespace/{slug}`; link `owner` to accounts and `registered_height` to blocks.
- **Content:** list/detail for posts still use pinboard REST (`/v1/pinboard/posts`, `/v1/pinboard/post?path=...`) with namespace `cado_path` values like `/@alice/{message_id}`.

## Related documentation

- [Transactions overview](./transactions-overview) — `AddNamespace` and `PostMessage` with namespace
- [Content addresses](./content-addresses) — registry paths, namespace content paths, HTTP table
- [Eld CLI](./eld-cli) — `add-namespace`, `get-namespace`, `post-pinboard-message --namespace`
