---
title: Eld CADO paths and content IDs
description: Content-addressed data objects (CADO) in Eld — paths, content IDs, integrity, deduplication, and lookups.
---

# Content-Addressability and CADO in Eld

This document describes how Eld is **content-addressable** and how **CADO** (Content-Addressed Data Object) paths and **content IDs** work in practice.

## Overview

Eld identifies data by **hashes and typed paths** instead of arbitrary server locations. That gives:

- **Integrity** — the same identifier always refers to the same bytes
- **Deduplication** — identical content shares one ID
- **Portable lookups** — any node can resolve a path or content ID the same way

Two layers are worth separating:

1. **CADO** — typed objects in node storage (accounts, epoch records, and similar), looked up by a **CADO path**
2. **Blob content** — raw bytes split into chunks; identified by **content_id** (and used on the P2P content-sync topics)

---

## CADO (Content-Addressed Data Object)

A **CADO** is a typed blob with metadata (`type`, owner, hash). It can be immutable or mutable:

| Variant       | Meaning                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| **Immutable** | One version; the name is usually `0x` plus the hash of the data                                               |
| **Mutable**   | Stable path (e.g. an account address) while the payload can change; storage tracks original and latest hashes |

Internally, keys are derived from scope, type, and hash. What you use in APIs and the CLI is the **path string** below.

---

## CADO path format

Paths under the Eld root scope follow:

```text
/@eld/<type>/<name>
```

- **scope** is `@eld` (full prefix `/@eld/`)
- **type** is a known segment such as `account` or `epoch_record`
- **name** is always a `0x` prefix plus hex:
  - **40 hex characters** (20 bytes) for account-like types — same shape as a wallet address
  - **64 hex characters** (32 bytes) for hash-like types — epoch keys, snapshot IDs, etc.

### Examples you can copy

**Account** (balance and nonce live here):

```text
/@eld/account/0xe17404c417fa10cc04fdf73604fcacca8d0a687c
```

**Staking account** for the same address:

```text
/@eld/staking_account/0xe17404c417fa10cc04fdf73604fcacca8d0a687c
```

**Content manifest** (metadata + chunk list for a blob; 32-byte manifest id):

```text
/@eld/content_manifest/0x23c076780fc0cec4fdd4f0015c9b9043866b824a61162940697080c0125f871a
```

**Epoch record** (epoch number encoded as `0x` + 64 hex):

```text
/@eld/epoch_record/0x0000000000000000000000000000000000000000000000000000000000000001
```

When querying the node, pass the **full path** (URL-encoded if it appears in a URL). The CLI accepts the path as a single argument:

```bash
eld-cli get-cado '/@eld/account/0xe17404c417fa10cc04fdf73604fcacca8d0a687c'
eld-cli list-cados '/@eld/account/'
```

### CADO types in use today

These `type` segments match the allow-list in `eld_common` (3-part paths only):

| Category           | `type` values                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Accounts           | `account`, `staking_account`, `storage_staking_account`                                                    |
| Chain / snapshots  | `state_version`, `epoch_record`, `trie_snapshot`, `snapshot_metadata`, `snapshot_chunk`, `chunk_reference` |
| Namespace registry | `namespace`                                                                                                |

Related path prefixes also exist for **content manifests** (`/@eld/content_manifest/...`) and **account content** indexes; manifests use the same 64-hex `name` pattern.

### Namespace registry (custom scopes)

Each registered custom namespace has an immutable registry CADO:

```text
/@eld/namespace/{namespace_slug}
```

Example:

```text
/@eld/namespace/peter
```

The payload records `namespace_slug`, `owner`, and `registered_height`. Reserved slugs cannot be registered. See [Custom namespaces](./namespaces) for slug rules, `AddNamespace`, and REST lookup.

---

## Pinboard paths (nested under `/@eld/pinboard/`)

Pinboard posts are **not** generic 3-part CADOs. They use longer paths under:

```text
/@eld/pinboard/...
```

Examples:

**Single post** (wallet address + message id):

```text
/@eld/pinboard/post/0xe17404c417fa10cc04fdf73604fcacca8d0a687c/0xabc123...message_id_hex...
```

**List posts by wallet** (paginated; used by ABCI query paths):

```text
/@eld/pinboard/wallet/0xe17404c417fa10cc04fdf73604fcacca8d0a687c/0/100
```

**List posts by tag**:

```text
/@eld/pinboard/tag/demo/0/100
```

The CLI wraps the REST API, for example:

```bash
eld-cli pinboard-get-post 0xe17404c417fa10cc04fdf73604fcacca8d0a687c <message_id>
```

### Namespace content paths

When a pinboard post is submitted with `--namespace <slug>` (namespace must be registered; poster must be owner), metadata and REST `cado_path` use a **two-segment** path under the custom scope:

```text
/@{namespace_slug}/{message_id}
```

Example:

```text
/@peter/deadbeef0123...
```

This is separate from the Eld pinboard tree (`/@eld/pinboard/post/...`). Fetch by full path:

```bash
# REST (URL-encode the path query value)
GET /v1/pinboard/post?path=/@peter/<message_id>
```

```bash
eld-cli post-pinboard-message <wallet> ./file.txt --content-type text/plain --namespace peter
```

Upload flow: user-signed submit → `PostMessage` tx → blob in capacity slots; registry stays at `/@eld/namespace/peter`. See [Custom namespaces](./namespaces).

---

## Content IDs (raw blobs)

Separate from CADO paths, **raw content** is chunked and hashed:

1. Each chunk is stored under **chunk_id** = `0x` + SHA-256(chunk bytes)
2. A **ChunkSummary** lists all chunks
3. **content_id** = `0x` + SHA-256(serialized ChunkSummary)

The same file always produces the same **content_id**. Peers announce and fetch blobs by this id on the `eld-content-sync` P2P topic (see [P2P protocol](./capacity-provider-p2p-protocol)).

**Example content id** (64 hex digits after `0x`):

```text
0x6ddb7450d754a0dc66a1eb93c682eea6c2ce860b16e62453146f43d7c915fa91
```

**Manifest id** (if you have a manifest CADO) is a different 32-byte hash — it identifies the manifest object, not the raw bytes alone:

```text
manifest_id → /@eld/content_manifest/0x<64-hex-chars>
content_id  → 0x<64-hex-chars>   (used for sync and storage slots)
```

---

## Quick reference

| What you have           | Example                                                    | How to fetch                                                    |
| ----------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Account                 | `/@eld/account/0xe17404c417fa10cc04fdf73604fcacca8d0a687c` | `eld-cli get-cado` or `GET /cado/{path}` on the node            |
| Manifest CADO           | `/@eld/content_manifest/0x23c07678...f871a`                | Same CADO APIs                                                  |
| Pinboard post           | `/@eld/pinboard/post/0x.../0x...`                          | `GET /v1/pinboard/post?path=...` or `eld-cli pinboard-get-post` |
| Namespace registry      | `/@eld/namespace/peter`                                    | `GET /v1/namespace/peter`                                       |
| Namespace pinboard post | `/@peter/{message_id}`                                     | `GET /v1/pinboard/post?path=/@peter/...`                        |
| Raw blob                | `0x6ddb7450...915fa91`                                     | P2P content sync; capacity providers hold bytes in slots        |

---

## HTTP APIs (node)

Paths must be valid **CadoPath** strings where applicable (correct type, `0x`, and hex length).

| Endpoint                             | Purpose                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `GET /health`                        | Health check                                                                  |
| `GET /cado/{cado_path}`              | Fetch CADO at path — e.g. `/cado/@eld/account/0xe174...` (encode `/` in URLs) |
| `GET /v1/pinboard/post?path=...`     | Pinboard post by full path (`/@eld/pinboard/...` or `/@namespace/...`)        |
| `GET /v1/pinboard/posts`             | Pinboard feed (query parameters per API)                                      |
| `POST /v1/pinboard/messages:submit`  | Submit a signed pinboard message (optional namespace in body)                 |
| `GET /v1/namespaces`                 | Paginated list of registered custom namespaces                                |
| `GET /v1/namespace/{namespace_slug}` | Namespace registry detail (registered or not)                                 |

Transaction and epoch queries (`/transactions`, `/epoch/current`, and similar) use other routes on the same app server; they are not CADO paths.

---

## Summary

- **CADO paths** look like `/@eld/<type>/0x<hex>` — use real hex from the chain or explorer, not placeholders.
- **Account paths** use 42-character `0x` + 40 hex; **hash types** use `0x` + 64 hex.
- **Pinboard** adds extra segments under `/@eld/pinboard/`.
- **Custom namespaces** register at `/@eld/namespace/{slug}`; uploads can use `/@{slug}/{message_id}`.
- **content_id** is the hash of the chunk summary; use it for blobs and P2P sync, and pair manifests with `/@eld/content_manifest/...` when you need metadata on-chain.
