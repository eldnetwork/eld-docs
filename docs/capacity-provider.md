---
title: Capacity Provider Overview
description: How Eld capacity providers allocate storage slots, commit Merkle roots on-chain, and pass verification challenges.
---

# Capacity Provider

How a capacity provider works in the Eld network: what it does, slot allocation, on-chain transactions, and a brief overview of the P2P protocol.

## Introduction

A **capacity provider** is a storage provider in the Eld network. It pre-allocates disk space, proves that capacity via a Merkle-root commitment, registers on-chain, and then stores user content in a portion of its slots while remaining verifiable through periodic challenges. Capacity providers can be full nodes, CLI daemons, mobile apps, or browser extensions—any participant that implements the capacity-provider protocol.

**Key concepts:**

- **Capacity file**: A pre-allocated file holding all storage slots (chunks).
- **Slot map**: Metadata for each slot (offset, size, state: Proof / Open / Content).
- **Merkle tree**: Built from chunk hashes; the root is committed on-chain for verification.
- **Proof-of-capacity**: Challenges ask for a small set of chunk data + Merkle proofs; validators check them against the on-chain root.

## What a Capacity Provider Does

1. **Allocates capacity** – Pre-allocates a capacity file and builds a deterministic slot map (Proof vs Open slots).
2. **Registers on-chain** – Submits a registration transaction with capacity proof (Merkle root, seed, chunk count).
3. **Stores content** – Puts user content in Open slots and updates the Merkle tree.
4. **Responds to challenges** – Proves it still holds the committed capacity by returning chunk data and Merkle proofs.
5. **Updates Merkle root** – Submits an on-chain update whenever content is stored or removed so the committed root matches local state.

## Slot Allocation

The capacity file is divided into fixed-size **chunks** (slots). Each slot has a **state**:

| Slot type   | Approx. share | Purpose                                                                                                    |
| ----------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| **Proof**   | 80%           | Deterministic data from `provider_id`, `seed`, and chunk index. Used for capacity verification challenges. |
| **Open**    | 20%           | Zeros; available for user content. Can become Content slots when content is stored.                        |
| **Content** | (from Open)   | User content; tracked with `deal_id` (content_id) and `committed_hash`.                                    |

- **Chunk size**: 1 KB (`MAX_CHUNK_SIZE = 1024`).
- **Layout**: Slot offsets are determined by a deterministic permutation (e.g. Fisher–Yates) from a seed so the same provider/seed always produces the same layout.
- **Merkle tree**: One leaf per chunk (hash of chunk data); the root is stored on-chain and used to verify challenge responses.

After allocation, the provider writes Proof data (or zeros for Open slots) to the file, builds the Merkle tree, and saves the slot map (e.g. `capacity_{provider_id}.slots.json`). The initial Merkle root is submitted with registration.

## Transactions

Capacity providers use two main on-chain transaction types.

### RegisterCapacity

- **Purpose**: Register as a storage provider and commit the initial capacity proof.
- **Payload**: `sender` (provider address), `capacity_bytes`, `merkle_root`, `seed`, `chunk_count`.
- **When**: Once per provider (e.g. after first `capacity-provider init`, or on daemon start if not yet registered).
- **Effect**: Creates/updates `StorageProviderInfo` in app state; the provider is then eligible for challenges and content allocation.

### UpdateCapacityMerkleRoot

- **Purpose**: Update the committed Merkle root after storing or removing content.
- **Payload**: `sender` (provider address), `merkle_root` (new root).
- **When**: After writing content into Open slots or clearing Content slots, so the on-chain root matches the current Merkle tree.
- **Effect**: Updates `merkle_root` and `last_merkle_root_update` in the provider’s on-chain record; validators use this root when issuing and verifying challenges.

### UnregisterCapacity

- **Purpose**: Remove the provider’s on-chain registration when leaving the network.
- **Payload**: `sender`, `unregister: true`.
- **When**: When shutting down or decommissioning a provider.

Validators record successful challenges with **VerifiedProof** (submitted by the epoch’s capacity validator, not by the provider).

## P2P protocol in brief

Capacity providers and Eld nodes share a **libp2p** GossipSub network. Application messages use the **SyncMsg** enum (bincode on the wire).

### Content sync (`eld-content-sync`)

Peers advertise and fetch blobs by **content id**:

1. **Announce** — a peer has a blob
2. **ContentRequest** — another peer wants it
3. **ContentResponse** — blob bytes (Base64-encoded on the wire)

When a provider ingests content, it writes **open/content** slots, rebuilds the Merkle tree, and sends **UpdateCapacityMerkleRoot**.

### Capacity challenges (per-provider topics)

Each epoch, one **capacity validator** challenges registered providers:

| Step                 | Topic                                       | Message                                                                                               |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Validator → provider | `eld-storage-challenge-topic-{provider_id}` | **CapacityChallenge** — which chunk indices to prove, plus on-chain `merkle_root`, `seed`, and expiry |
| Provider → validator | `eld-storage-proof-topic-{provider_id}`     | **CapacityChallengeResponse** — chunk data, hashes, Merkle paths, and slot state per index            |

The validator subscribes to the proof topic **before** publishing the challenge. The provider ignores challenges not addressed to its own `provider_id` and checks that the Merkle root still matches chain state.

After verification, the validator may submit a **VerifiedProof** transaction on-chain; providers do not send that transaction themselves.

Typical epoch parameters: up to **5** providers challenged, **10** chunks per challenge (see chain constants).

For a fuller walkthrough of topics and flows, see **[P2P protocol (capacity provider)](./capacity-provider-p2p-protocol)**.
