---
title: Eld BFT consensus and epochs
description: How Eld validators agree on block order, finality, and role rotation with Byzantine Fault Tolerant consensus.
---

# Eld BFT consensus and epochs

This page describes how the Eld network agrees on a single, ordered history of transactions and how validator roles rotate over time. It is an overview of the design—not an implementation guide.

## What consensus does

Every node on Eld needs the same answer to two questions: **which transactions happened, and in what order?** Consensus is the process that lets a distributed set of participants agree on that history even when some nodes are offline, slow, or actively malicious.

Once agreed, that history is packaged into **blocks**. Each block builds on the previous one, forming a chain. The rules encoded in Eld’s **app layer** then interpret those blocks: balances change, capacity providers register, content deals are recorded, and epoch boundaries trigger role changes.

## Byzantine Fault Tolerance (BFT)

Eld uses **Byzantine Fault Tolerant (BFT)** consensus, implemented by **[Tendermint](https://docs.tendermint.com/)** as the **consensus layer**.

In a BFT system, validators repeatedly propose blocks and vote on them in rounds. A block is **final** once a supermajority of validators has committed to it—it will not be reverted unless more than one-third of voting power is Byzantine and colludes to break safety.

**Byzantine** means a participant can behave arbitrarily: it might crash, go offline, or send conflicting messages to different peers. BFT consensus is designed so that the network remains safe and live as long as **fewer than one-third of validators (by voting power) are Byzantine**. With more than that, guarantees no longer hold.

For operators and users, the practical takeaway is:

- Confirmed blocks are not easily rolled back under normal conditions.
- The network tolerates some faulty or adversarial validators without splitting into incompatible histories.
- Agreement is explicit: validators vote, rather than simply following the longest chain by proof-of-work.

## Blocks and application state

The **consensus layer** handles **ordering and finality** of blocks. The **app layer** defines what those blocks mean: token transfers, staking, capacity registration, content metadata, and epoch transitions.

For each new block, the app layer applies the transactions inside it to its state database. Invalid transactions may appear in a block but do not change state. At the end of the block, Eld updates its view of the world—who holds what, which providers are registered, and which epoch the chain is in.

The consensus layer and the app layer work together: the consensus layer ensures all honest nodes see the same blocks in the same order; the app layer ensures every node derives the same application state from that order.

## Epochs

An **epoch** is a fixed span of blocks—a recurring window on top of the chain, not a separate clock. When the chain crosses into a new epoch, the app layer will **rotate several roles** that were active during the previous epoch.

Epochs matter because Eld separates **who secures the chain** from **who stores ephemeral content** and **who audits storage**. Those jobs are not all done by the same nodes forever; they are reassigned on a regular cadence so participation can change as stake, capacity, and registration change.

At each epoch boundary, Eld will:

1. Choose the **active consensus validators** for block production and confirmation.
2. Choose the **active capacity providers** eligible for rewards and challenges in that epoch.
3. Assign one **capacity validator** responsible for running storage challenges and verification for that epoch.
4. Prune expired capacity registrations that are no longer valid.

## Validator roles per epoch

Validators and providers play different parts. At each epoch boundary, Eld will select participants for each role from the current registry and stake-weighted rules.

### Consensus validators (block validation and confirmation)

**Consensus validators** are the nodes that participate in BFT on the consensus layer: proposing blocks, prevoting, precommitting, and committing. They are the security backbone of the chain.

Candidates are drawn from validators registered in Eld’s state (genesis and later staking/registration). At each epoch boundary, the app layer will rank them by **stake** and activate a bounded set with the highest stake for the coming epoch. Only this **active validator set** will be handed to the consensus layer, so voting power—and who can confirm blocks—rotates with stake and epoch changes.

Their job is strictly **ledger consensus**: agree on transactions, finalize blocks, and keep application state consistent across the network.

### Active capacity providers

Separately, Eld will maintain the set of **active capacity providers** for the epoch—storage nodes that have registered on-chain, committed a capacity proof (Merkle root), and remain eligible. That set defines who can receive content, earn rewards, and be subject to challenges during the epoch.

Selection is driven by registration and epoch rules rather than by block voting, but it is still tied to the same epoch clock as consensus validators.

### Capacity validator (storage challenge and verification)

Each epoch, Eld will designate **one** of the active consensus validators as the **capacity validator** (also referred to as the storage validator in some contexts). That node has a special operational role for that epoch only.

The capacity validator:

- Issues **capacity challenges** to a subset of active capacity providers.
- Verifies responses (chunk data and Merkle proofs against the provider’s on-chain root).
- May record outcomes on-chain (successful proofs, failures, or slashing per network rules).

Selection is **deterministic** from the epoch and chain state so every node computes the same assignee without a separate election round. Only the designated validator should initiate challenges for that epoch; providers respond on the P2P layer.

This role does not replace BFT block consensus on the consensus layer—it adds **storage accountability** on top of it.

### Content storage and challenges

Capacity providers also hold **user content** in open slots and update their on-chain Merkle root when content changes. Challenges are not only about raw disk size; they prove that a provider still holds specific committed data.

When challenged, a provider must return the requested chunks and proofs that reconcile with its published root. The capacity validator (or the protocol logic it enforces) checks that responses match what was committed. Failed or missing proofs can affect rewards or standing, depending on network policy.

Together, **consensus validators** secure the chain, **capacity providers** offer ephemeral storage, and the **capacity validator** audits that storage within each epoch.

## How the pieces fit together

```text
                    ┌─────────────────────────────┐
                    │      Consensus layer (BFT)   │
                    │  (active consensus validators) │
                    └──────────────┬──────────────┘
                                   │ ordered blocks
                                   ▼
                    ┌─────────────────────────────┐
                    │           App layer          │
                    │  state, epochs, registrations │
                    └──────────────┬──────────────┘
                                   │ each epoch
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
   Active consensus        Active capacity          Capacity validator
   validators              providers                (one per epoch)
   (block confirm)         (store content)          (challenges & verifies)
```

## Related documentation

- [Capacity Provider](capacity-provider) — registration, slots, Merkle commitments, and on-chain updates.
- [P2P protocol (capacity provider)](capacity-provider-p2p-protocol) — how challenges and proofs are exchanged between validators and providers.
- [Content addresses](content-addresses) — how content is named and tied to storage deals.
