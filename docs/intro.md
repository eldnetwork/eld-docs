---
sidebar_position: 1
slug: /
title: Welcome to Eld
description: Official docs for Eld — an ephemeral, content-addressed blockchain for temporary decentralized storage, namespaces, and capacity providers.
---

# Welcome to Eld

Eld is a decentralized network for **short-lived digital information** — messages, files, session data, and app state that should exist only as long as it is useful, then disappear on its own.

The name comes from an old Nordic word for *fire*: data that burns bright, serves its purpose, and fades.

Think of Eld as a **shared scratchpad for the internet** — not a permanent archive like most blockchains, and not a walled garden like a single cloud provider. Anyone can publish; everyone can verify while content is live; nothing is kept forever by default.

## The problem Eld solves

Most online systems assume **keep everything forever**. Cloud storage bills grow. Blockchains swell until only data centers can run them. Meanwhile, much of what we create — live events, ephemeral chat, sensor bursts, agent scratch space — only matters for minutes or hours.

Eld flips the default: **you decide how long your data stays available**, and the network enforces that expiry for everyone equally.

## How it works (in plain terms)

1. **Publish** — You post a message or file. The network records *what* you shared (a secure fingerprint of the content) and *when it expires*. The actual bytes live with storage contributors, not bloating the core ledger.

2. **Use while live** — While the clock is running, anyone with permission can fetch and verify the content. Posts can be public or encrypted.

3. **Expire automatically** — When time is up, the content stops being served and storage is reclaimed. You paid for the lifetime you needed, not centuries of hosting.

4. **Stay verifiable** — Independent operators run the network. They agree on ordering and rules; they cannot silently rewrite what was published. Storage contributors prove they are holding data when challenged and earn rewards for reliable service.

The network targets roughly **one round of updates (a block) per second** — fast enough for real-time apps, games, and live coordination.

## How Eld is different

| | Typical blockchain | Centralized app | **Eld** |
|---|-------------------|-----------------|---------|
| **Retention** | Forever | Platform decides | **You set the lifetime** |
| **Control** | Decentralized | One company | **Decentralized** |
| **Cost model** | Grows with history | Subscription / storage fees | **Pay for the time you need** |
| **Who can run it** | Often data centers | Provider only | **Laptops, phones, home NAS** |

Eld is **trustworthy while live, intentionally forgetful afterward** — like a whiteboard that erases itself, with a receipt that proves what was written.

## Key use cases

- **Temporary caching & sharing** — live events, real-time collaboration, flash sales; data expires after hours or days.
- **Ephemeral messaging** — chat, attachments, and social feeds that auto-purge for privacy and lean storage.
- **Quick prototyping & one-off work** — draft sharing, AI inference results, session logs, debug traces.
- **IoT & edge bursts** — sensor spikes and edge analytics where only recent readings matter.
- **Short-lived coordination** — disposable credentials, temporary proofs, event tickets, flash-loan metadata, live bidding state.
- **Agent scratch space** — content-addressed working memory for AI: intermediate results, tool outputs, thoughts that die with the task.

Looking ahead, Eld aims to extend this foundation to support compute and autonomous agents running on any device, or provide lightweight, ephemeral AI agent storage — enabling mobile-first, decentralized intelligence without relying on always-on servers or eternal blockchains.


## Get Started with Eld

- [Create an account](./accounts-overview)
- [Send your first transaction](./transactions-overview)

## Custom namespaces and content
- [Custom namespaces](./namespaces) — register `@yourname` and upload under `/@yourname/...`
- [Content Derived Addresses](./content-addresses) — CADO paths, pinboard, and namespace content paths

## Join Eld as a capacity provider
- [What is a Capacity Provider](./capacity-provider)
- [The Capacity Provider P2P protocol](./capacity-provider-p2p-protocol)
