---
title: P2P protocol for capacity providers
description: libp2p messaging between Eld nodes and capacity providers — content sync, challenges, and GossipSub topics.
---

# P2P protocol for capacity providers

This page describes how Eld nodes and capacity providers communicate over **libp2p** (GossipSub, mDNS discovery, Noise encryption). For registration, slots, and on-chain transactions, see [Capacity Provider](./capacity-provider).

## Overview

Application messages are a single enum, **SyncMsg**, serialized with **bincode** and published on named GossipSub topics. Two areas matter for capacity providers:

1. **Content sync** — discover and fetch blobs so providers can fill open slots  
2. **Capacity challenges** — the epoch’s capacity validator asks providers to prove they still hold committed chunks  

Heartbeats and inventory messages help peers stay aware of each other; they are optional for understanding the core flows.

## Network

| Setting | Typical value | Notes |
|--------|----------------|-------|
| Node TCP / QUIC | 4001 / 4002 | Configurable on the Eld node |
| CLI daemon | 4011 / 4012 | Defaults avoid clashing with a local node |

Peers discover each other on the LAN via **mDNS** and exchange signed GossipSub messages.

## Topics

| Topic | Who uses it | Purpose |
|-------|-------------|---------|
| `eld-content-sync` | Nodes and providers | Announce, request, and respond with content; heartbeats and inventory |
| `eld-content-sync-response` | Providers (responses) | Some deployments route large responses here |
| `eld-storage-challenge-topic-{provider_id}` | Validator → provider | Capacity challenge for that provider’s address |
| `eld-storage-proof-topic-{provider_id}` | Provider → validator | Challenge response with chunk proofs |

`provider_id` is the provider’s on-chain address (e.g. `0x…` hex). Each provider subscribes only to **its own** challenge topic; validators subscribe to the **proof** topic before sending a challenge.

## Message families (SyncMsg)

All variants are defined in `eld_common::sync_msg` and share the same serialization format.

### Content sync

| Message | Role |
|---------|------|
| **Announce** | “I have this content id (blob key).” |
| **ContentRequest** | “Please send this content id.” |
| **ContentResponse** | Payload for that id (body is Base64-encoded in the wire format). |
| **ContentSyncHeartbeat** / **ContentSyncHeartbeatResponse** | Liveness between sync participants |
| **ContentInventoryRequest** / **ContentInventoryResponse** | Optional inventory exchange (JSON list) |

Published on `eld-content-sync` (and responses may use `eld-content-sync-response` depending on configuration).

### Capacity challenge and response

| Message | Direction | Role |
|---------|-----------|------|
| **CapacityChallenge** | Validator → provider | Lists chunk indices to prove, plus on-chain `merkle_root`, `seed`, `expiration_block`, and metadata |
| **CapacityChallengeResponse** | Provider → validator | One **ChunkProof** per requested index: chunk bytes, chunk hash, Merkle path, slot state |

**ChunkProof** includes the slot state (Proof, Open, or Content with deal id and hash) so validators can tell proof slots from user content.

### Other

| Message | Role |
|---------|------|
| **Heartbeat** | General P2P liveness |

## Capacity challenge flow

This is the proof-of-capacity loop tied to [consensus epochs](./consensus):

```text
Validator (capacity role for epoch)
    │  subscribe: eld-storage-proof-topic-{provider}
    │  publish:   CapacityChallenge → eld-storage-challenge-topic-{provider}
    ▼
Capacity provider
    │  verify: provider_id, merkle_root, not expired
    │  read chunks from capacity file, build Merkle proofs
    │  publish: CapacityChallengeResponse → eld-storage-proof-topic-{provider}
    ▼
Validator
    │  verify hashes and Merkle paths vs on-chain root
    │  optional: submit VerifiedProof transaction on-chain
    ▼
Chain state updated; provider may receive rewards
```

At each epoch boundary the chain selects which providers are challenged (deterministic selection from epoch state). The active capacity validator issues up to **5** challenges per epoch with **10** chunk indices each (protocol constants; see `eld_common::constants::protocol`).

Challenge ids are derived deterministically from validator, provider, block height, timestamp, and the chosen indices so all nodes can reason about the same challenge.

## Content sync flow (high level)

```text
Peer A has blob
    → Announce { content_id } on eld-content-sync
Peer B needs blob
    → ContentRequest { content_id }
Peer A (or any holder)
    → ContentResponse { content_id, content (base64) }
Provider stores in open slots, rebuilds Merkle tree
    → UpdateCapacityMerkleRoot transaction on-chain
```

Providers also **announce** content they hold so the network can replicate ephemeral blobs into open capacity.

## Implementation checklist

**Capacity provider daemon**

- Subscribe: `eld-content-sync`, `eld-storage-challenge-topic-{own_address}`
- Publish: content sync messages, `CapacityChallengeResponse` on `eld-storage-proof-topic-{own_address}`

**Capacity validator (node)**

- Subscribe to proof topic for each provider before challenging  
- Publish `CapacityChallenge` on that provider’s challenge topic  
- Verify responses; may broadcast **VerifiedProof** transactions  

## Related documentation

- [Capacity Provider](./capacity-provider) — slots, Merkle roots, RegisterCapacity / UpdateCapacityMerkleRoot  
- [Consensus](./consensus) — epoch validator and capacity validator selection
