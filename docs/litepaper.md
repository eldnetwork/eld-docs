---
title: 'Eld Litepaper: The Eld Ephemeral Data Storage Protocol'
description: Eld litepaper — ephemeral information storage for developers, operators, and technical readers.
---

# Eld Litepaper: The Eld Ephemeral Data Storage Protocol

**Eld Network · July 2026**

_Audience: developers, operators, and technical readers familiar with blockchain and distributed systems._

---

ELD LITEPAPER
Version: 0.1.0

## What is Eld?

Eld is a **Proof-of-Stake blockchain** built for **time-bounded, content-addressed data** — messages, files, session state, and application metadata that should remain available only as long as it is useful, then expire and be reclaimed.

The name comes from an old Nordic word for _fire_: data that burns bright, serves its purpose, and fades.

Eld is a **decentralized scratchpad**, not a permanent archive. Publishers commit cryptographic hashes and explicit TTL on-chain; payload bytes live off-chain with capacity providers. The chain is **immutable in commitments** (signed transactions, content hashes, summary hashes) and **non-permanent in retention** (blobs and, eventually, pruned block bodies). Anyone can publish; anyone can verify while content is live; nothing is kept forever by default.

Three mechanisms define the protocol:

| Component                     | Role                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| **Time-Bounded Pinboard**     | On-chain metadata + TTL; off-chain blobs; consensus-enforced expiry         |
| **Proof-of-Capacity Storage** | Disk pre-allocation, Merkle-root commits, epoch challenges                  |
| **Bounded Chain History**     | Block-range consolidation into `summary_hash` commitments (Stage 2 roadmap) |

Eld targets **~1 second block times**, **~1,000 TPS** at current design targets, **smart contracts**, and participation from laptops, phones, and edge hardware — not only data-center full nodes.

---

## The problem Eld solves

Most blockchains optimize for **permanence**: block bodies, transaction metadata, and application indexes grow without bound. Node operators provision ever-larger disks; full participation drifts toward data centers. That structural mismatch hurts workloads that are inherently short-lived — live events, session state, ephemeral messaging, IoT bursts, disposable credentials, AI agent scratch space — where eternal retention adds cost without user value.

Centralized services offer convenience but introduce arbitrary censorship, opaque deletion policies, and single points of control.

Eld inverts the default: **publishers specify what** (a content hash) **and how long** (TTL in blocks); the protocol enforces expiry at consensus level and reclaims storage through garbage collection. You pay for the lifetime you need, not perpetual hosting.

---

## How it works

### Architecture

Eld is a three-layer stack: **clients** talk to **validator nodes** over REST, RPC, and P2P; each validator runs an **application** (pinboard, accounts, capacity verification) on top of **Tendermint** BFT Proof-of-Stake consensus (~1 second blocks, instant finality).

```
┌─────────────────────────────────────────────────────────────┐
│  Clients: CLI · SDK · Wallet · Capacity-provider dashboard  │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / RPC / P2P (libp2p)
┌──────────────────────────▼──────────────────────────────────┐
│  eld_node_app (Rust ABCI)                                   │
│  Pinboard · CADO state · Capacity challenges                │
│  Blob garbage collection                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ ABCI
┌──────────────────────────▼──────────────────────────────────┐
│  Tendermint — BFT PoS consensus, ~1s blocks, instant finality │
└─────────────────────────────────────────────────────────────┘
```

Consensus orders transactions and maintains agreed **application state** — accounts, balances, namespace registrations, pinboard indexes, and capacity-provider roots. **Payload bytes are not part of that state.** They live in separate off-chain blob storage held by capacity providers. That split is what makes high-throughput ephemeral data possible: the chain stays small and fast; bulk data scales through the storage layer.

### On-chain commitments, off-chain bytes

Every pinboard post records a **commitment** on-chain — a cryptographic hash of the content, an expiry height (TTL), the publisher's identity, and optional scope (namespace, topic, visibility). The chain never stores the raw message or file body.

| Stored on-chain                         | Stored off-chain                  |
| --------------------------------------- | --------------------------------- |
| Content hash, TTL, publisher, namespace | Actual message or file bytes      |
| Capacity-provider Merkle roots          | Provider disk slots holding blobs |
| Account balances, staking               | —                                 |

While a post is live, anyone can verify that fetched bytes match the on-chain hash. After TTL, the chain stops serving the body and storage is reclaimed — but the **fact that a commitment was made** remains in consensus history (under Stage 1; older block bodies may be consolidated under Stage 2).

### Publishing content

The upload path separates **commitment** from **storage**:

1. **Prepare** — The client hashes the payload and builds a signed post that includes the hash, a chosen expiry (TTL in blocks), and any namespace or visibility settings.
2. **Submit** — The client sends the payload bytes and signed commitment to a validator. The validator attests receipt and broadcasts the post to the network.
3. **Commit** — Once included in a block, the post's metadata is indexed in application state. Validators agree on the hash, TTL, and publisher — not on storing the bytes in chain state.
4. **Store** — Payload bytes are written to off-chain blob storage maintained by **capacity providers** — participants who have registered disk with the network. The provider updates its on-chain Merkle root to reflect the new content.

Default pinboard TTL is on the order of **1,000 blocks** (~16 minutes at 1 s/block). Applications choose shorter or longer lifetimes within protocol limits.

### Accounts and namespaces

**Accounts** are standard Ed25519 keypairs with an address, balance in ELD, and a sequential nonce for transaction ordering. Accounts pay fees to post, transfer, and register names.

**Namespaces** are optional human-readable handles (e.g. `peter` → `@peter`) registered on-chain by an account. They let publishers group content under a verifiable scope — similar to a username or channel — without a central naming service. Namespace registration is permanent chain state; the posts inside a namespace are still ephemeral and TTL-bound.

Together, accounts answer _who_ published and paid; namespaces answer _where_ in the logical address space content lives.

### Accessing content after upload

After a post is committed, clients retrieve content through the node's query and content APIs:

1. **Lookup metadata** — Query the pinboard index by message id, namespace, topic, or time range. The response includes the content hash, expiry height, and publisher — but only serves the body if `current_height < expires_height`.
2. **Fetch bytes** — Request the blob by content hash from validator or capacity-provider storage (via REST or P2P sync).
3. **Verify** — Recompute the hash of the returned bytes and compare to the on-chain commitment. A match proves the content is what the publisher signed; a mismatch means corrupt or substituted data.

Encrypted posts store ciphertext off-chain (or in the blob layer); confidentiality depends on end-to-end encryption held by the publisher and intended recipients. The chain still records who posted, when, and until which block the grant is valid.

### How off-chain content stays available (and honest)

If bytes are not on-chain, availability during TTL depends on **capacity providers** and **proof-of-capacity**:

1. **Registration** — A provider pre-allocates disk, organizes it into fixed slots, and registers a Merkle root on-chain. This is a public claim: "I have this much space, organized in this layout."
2. **Ingest** — When pinboard content arrives, providers store bytes in their slots and update their on-chain root so the network knows the content is anchored to registered capacity.
3. **Challenges** — Each epoch, validators randomly challenge active providers: prove you still hold specific slots (chunk hash + Merkle proof, returned over P2P). Successful proofs are recorded on-chain and rewarded in ELD.
4. **Accountability** — A provider that commits a root but drops content fails challenges and loses rewards. Honest providers earn for keeping referenced blobs available for the TTL window.

This is how Eld achieves **ephemeral but verifiable** storage: the chain does not replicate every byte to every validator, but it **does** economically and cryptographically enforce that someone registered capacity is actually holding the content while it is supposed to be live.

### Expiry and garbage collection

Expiry is enforced at the **protocol level**, not by provider discretion. Query APIs treat TTL metadata as authoritative — after `expires_height`, bodies are unavailable even if a copy still exists on disk. A background garbage collector deletes blob bytes once no live post references that content hash.

Under **Stage 1** (live testnet), pinboard transaction metadata and block bodies remain in chain history after expiry so indexers can audit who posted what and when. **Blob** growth is bounded by TTL. **Stage 2** (roadmap) extends the same philosophy to old block bodies: once every ephemeral obligation in a block range has expired, validators consolidate the range into a compact summary hash, capping total node disk while preserving a cryptographic record of what occurred.

### Consensus and integrity

Validators are selected per **epoch** from the staked set and produce ~1 second blocks with BFT instant finality. Once finalized, transactions cannot be silently reordered or altered.

Eld separates **tamper-evident commitments** from **indefinite byte retention**:

| Layer                 | Immutable (agreed by consensus)               | May expire or be pruned                      |
| --------------------- | --------------------------------------------- | -------------------------------------------- |
| Chain record          | Ordering, signatures, fees, state transitions | Old block bodies after Stage 2 consolidation |
| Publisher commitments | Content hash, TTL, publisher, namespace       | Live indexes and blob bytes after expiry     |
| Capacity layer        | On-chain roots and verified proof records     | Off-chain slot data after garbage collection |

Pruning bytes or consolidated blocks reclaims **copies** on individual nodes. It does not let the network pretend a post was never committed.

---

## How Eld is different

|                         | Typical blockchain                         | Centralized app             | **Eld**                                                   |
| ----------------------- | ------------------------------------------ | --------------------------- | --------------------------------------------------------- |
| **Retention**           | Forever                                    | Platform decides            | **Publisher-set TTL**                                     |
| **Payload location**    | Often on-chain or IPFS-style permanent pin | Provider storage            | **Off-chain blobs, hash on-chain**                        |
| **Control**             | Decentralized                              | One company                 | **Decentralized**                                         |
| **Cost model**          | Grows with history                         | Subscription / storage fees | **Fees aligned to TTL duration**                          |
| **Node footprint**      | Unbounded history                          | N/A                         | **Bounded by retention window (Stage 2)**                 |
| **Who can participate** | Often data centers                         | Provider only               | **Validators + capacity providers on commodity hardware** |

Eld is **trustworthy while live, intentionally forgetful afterward** — immutability of commitments without the archival burden of conventional chains.

**Scaling separation:** Throughput stays high because consensus records only hashes, TTL, and metadata. Per-object storage is bounded by TTL. Per-node chain storage is bounded by block netting once Stage 2 ships. Phones and edge devices can run as capacity providers or light clients without provisioning for decades of archival growth.

---

## Who uses Eld, and how

### Everyday users

Post time-bounded content via wallet or dApp: time-limited links, self-destructing notes, encrypted shares. Pay modest transaction fees; gain censorship-resistant publication and verifiable reads while live — without centuries of replication cost or a single operator's retention policy.

### Developers and startups

Build on the **pinboard primitive**, namespaces, and content-addressed paths.

| Pattern                     | Approach                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------- |
| Ephemeral messaging / feeds | Direct `PostMessageTx` or Merkle-root batch anchoring (one commitment per time slice) |
| Time-limited file share     | `content_key` + encrypted capability tokens expiring with the grant                   |
| Game sessions               | Matchmaking tickets, room keys, leaderboards anchored for match duration              |
| IoT / agent scratch space   | High-churn publishes with verifiable publication, no archival burden                  |

**Integration surface:** Tendermint RPC (`:26657`), node REST (pinboard, namespaces, content upload), JavaScript SDK with React hooks, and the Rust `eld-cli`.

### Storage contributors (capacity providers)

Register with `RegisterCapacityTx`, maintain slot files (80% proof slots, 20% open for user content), update Merkle roots via `UpdateCapacityMerkleRootTx` as content changes, respond to epoch challenges over libp2p. Earn **ELD** from `VerifiedProofTx` rewards. Participate from phones, NAS devices, or spare laptop disks without running a validator. Testnet geometry: up to 10 active providers per epoch.

### Validator and node operators

Stake ELD, run `eld_node_app` + Tendermint, process transactions, participate in capacity challenge verification, earn block rewards and fee shares proportional to stake. Epoch transitions snapshot validator and capacity-provider sets into CADO `EpochRecord` entries. Because Eld is designed to net history rather than hoard it, operating a consensus node remains feasible on commodity hardware over long chain lifetimes.

### Organizations and teams

Deploy namespaces for branded scopes, run private coordination channels with built-in expiry, or integrate Eld as a verifiable ephemeral layer alongside existing systems, such as incident channels, draft collaboration, customer data with protocol-enforced sunset.

---

## The ELD token

**ELD** coordinates fees, staking, and capacity rewards. One ELD is 1 million **MICRO** (short for MICROELD).

| Parameter             | Testnet default (indicative)   |
| --------------------- | ------------------------------ |
| Block reward          | 10 ELD per block               |
| Transaction fee       | 5,000 base units               |
| Verified proof reward | 1,000 base units per challenge |
| Max supply            | Bounded by `Coin` type         |

**Value flows:**

- **Users** pay fees to post data with TTL, transfer, and register namespaces.
- **Validators** earn block rewards and fee shares proportional to stake.
- **Capacity providers** earn proof-verification rewards; storage deal payments are planned.

Ongoing storage cost stays aligned with TTL — publishers pay for the lifetime they need, not perpetual replication at today's prices.

---

## Security and limitations

| Property                          | Mechanism                                                            |
| --------------------------------- | -------------------------------------------------------------------- |
| Integrity                         | BFT consensus; signed transactions; content hashes                   |
| Availability (while live)         | Validator state + capacity-provider blob storage                     |
| Confidentiality (encrypted posts) | E2E encryption; ciphertext on-chain                                  |
| Capacity honesty                  | Random epoch challenges, Merkle proofs, on-chain roots               |
| Determinism                       | Ordered state structures (`BTreeMap`); reproducible ABCI transitions |

**Explicit limits:** TTL is measured in blocks; wall-clock expiry depends on stable ~1 s block production. Garbage collection is best-effort; queries use TTL metadata as the authoritative gate. Stage 1 retains pinboard metadata and block bodies after expiry. Stage 2 consolidated ranges are not fully replayable from local disk — only `summary_hash` and lifted index anchors remain.

---

## Where Eld is today

:::info Testnet
The **2026 testnet** is for development and integration. APIs, economics, and network membership can change; do not treat testnet balances or state as permanent.
:::

The **2026 testnet** validates **Stage 1**: pinboard, namespaces, staking, capacity-provider flows, TTL-gated payloads, and blob GC. Stage 2 consolidation, enhanced ZK capacity proofs, and production economics hardening are on the roadmap.

Open for audit and integration: `eld_common`, `eld_node_app`, SDK, Chrome wallet, faucet, block explorer.

**Learn more:** [eld.network](https://www.eld.network) · [docs.eld.network](https://docs.eld.network)

---

_Eld — decentralized memory that knows when to forget._
