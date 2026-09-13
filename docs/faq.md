---
title: Eld FAQ — ephemeral storage and testnet
description: Answers on ephemeral decentralized storage, content-addressed TTL data, Eld testnet, wallets, and capacity providers.
---

# FAQ

## What is Eld?

Eld is a Proof-of-Stake blockchain for **time-bounded, content-addressed data**. You publish a content hash and a TTL (in blocks); the network serves and verifies the payload while it is live, then stops serving it after expiry.

## What is ephemeral decentralized storage?

Storage that is **decentralized** (no single operator decides retention) and **ephemeral** (lifetime is part of the protocol). Eld enforces expiry with consensus and reclaim, instead of keeping every blob forever like most chains.

## What is a content-addressed TTL blockchain?

**Content-addressed** means data is identified by a cryptographic hash (and typed CADO paths), not by a mutable server path. **TTL** (time-to-live) is measured in blocks: after `expires_height`, query APIs treat the body as unavailable even if a disk copy remains briefly.

## Is Eld live on mainnet?

The **2026 testnet** validates Stage 1 (pinboard, namespaces, staking, capacity providers, TTL payloads, blob GC). See the [roadmap](./roadmap) and [litepaper](./litepaper) for Stage 2 plans. Treat testnet state as temporary.

## How do I get started?

Follow the [quickstart](./quickstart): create a wallet with `eld-cli`, use the faucet, send a transfer.

## Where are my private keys?

Locally in the CLI wallet store (often `wallets.json`). Never commit or share that file. See [Accounts](./accounts-overview).

## What is a capacity provider?

A participant who pre-allocates disk, commits a Merkle root on-chain, stores user blobs in open slots, and answers epoch challenges over libp2p. Overview: [Capacity provider](./capacity-provider).

## How do custom namespaces work?

Register a slug on-chain (`add-namespace`), then post under `/@{slug}/...` as the owner. Details: [Custom namespaces](./namespaces).
