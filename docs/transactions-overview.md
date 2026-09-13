---
title: Eld transactions and fees
description: Signed Eld transactions — envelope fields, types, fees, and how validators order and validate on-chain actions.
---

# Eld transactions and fees

Every on-chain action in Eld is a **signed transaction**: a payload describing what should happen, plus metadata (nonce, fee, public key, signature). Validators order transactions into blocks through BFT consensus; the Eld application validates each transaction and updates state.

## Transaction envelope

All transactions share the same outer structure:

- **Payload** — what to do (transfer, stake, register capacity, and so on), identified by a type string and typed fields
- **Nonce** — must be exactly one greater than the sender’s last committed nonce
- **Fee** — paid from the sender’s balance
- **Public key** — Ed25519 key used to verify the signature
- **Signature** — over the transaction body (chain ID is included when signing)

If validation fails (bad signature, wrong nonce, insufficient balance, invalid fields), the transaction may appear in a block but **does not change state**.

Transactions are submitted to an Eld node (HTTP/RPC); the node broadcasts them to validators for inclusion in a block.

## Transaction types

| Type                         | Who sends it                  | Purpose                                                                |
| ---------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| **Transfer**                 | Any account                   | Send native tokens to another address                                  |
| **Stake**                    | Account holder                | Lock tokens toward validator candidacy (optional validator public key) |
| **Unstake**                  | Staker                        | Release staked tokens back to the sender                               |
| **RegisterCapacity**         | Capacity provider             | Register disk capacity with Merkle root, seed, and chunk count         |
| **UnregisterCapacity**       | Capacity provider             | Remove capacity registration from the chain                            |
| **UpdateCapacityMerkleRoot** | Capacity provider             | Publish a new Merkle root after storing or removing content            |
| **VerifiedProof**            | Capacity validator            | Record that a provider passed a capacity challenge for an epoch        |
| **PostMessage**              | Validator (on behalf of user) | Commit a pinboard post after the user signed the message               |
| **AddNamespace**             | Any account                   | Register a custom namespace slug (maps to scope `@slug`)               |

Below is a high-level description of each. Amount fields use the chain’s native token representation (fixed-point integer units).

### Transfer

Moves tokens from the sender to the recipient. The sender must have balance for **amount + fee**; amount must be non-zero. The recipient account is created if it does not exist.

```bash
eld-cli transfer <wallet_name> <recipient_address> <amount>
```

### Stake and Unstake

**Stake** locks tokens from the sender’s balance into staking state. There is a minimum stake amount. An optional Ed25519 public key (hex) can associate the stake with a validator identity.

**Unstake** returns staked tokens to the sender. The unstake amount must be non-zero and cannot exceed what is staked.

```bash
eld-cli stake <wallet_name> <amount>
eld-cli unstake <wallet_name> <amount>
```

Staking affects which validators are eligible and how they are ranked when the active set is chosen each epoch.

### Capacity: RegisterCapacity, UnregisterCapacity, UpdateCapacityMerkleRoot

Capacity providers anchor their storage commitment on-chain:

- **RegisterCapacity** — Declares total capacity (bytes), initial Merkle root, seed, and chunk count. Run once when joining (often after `eld-cli capacity-provider init` / daemon registration).
- **UnregisterCapacity** — Removes the provider’s registration (`unregister` must be true).
- **UpdateCapacityMerkleRoot** — Updates the committed Merkle root after content is written to or removed from open slots so challenges use the current tree.

See [Capacity Provider](./capacity-provider) for slots, challenges, and P2P behavior.

### VerifiedProof

Submitted by the **capacity validator** for the epoch after it verifies a provider’s challenge response on P2P. Records which provider passed which challenge at which block height. Successful proofs can trigger rewards to the provider per protocol rules.

This is separate from the P2P challenge/response itself; it is the on-chain attestation that verification succeeded.

### PostMessage (pinboard)

Pinboard posts are **user-signed** off-chain payloads submitted to a node; the node validates them and broadcasts a **PostMessage** transaction. Fields include content key, message id, TTL (`expires_height`), visibility, optional topic and tags, content type, user fee, and the user’s signature.

Optional **`namespace`** on the user request: when set, the post is tied to a **registered custom namespace** and indexed under `/@{namespace_slug}/{message_id}` instead of `/@eld/pinboard/post/{wallet}/{message_id}`. The posting wallet must be the namespace **owner** at submit time.

Typical flow: `eld-cli post-pinboard-message` builds the user request, the node checks it, then a validator includes the `PostMessage` tx in a block. Message bodies are stored and indexed separately from the tx payload (blob model).

```bash
eld-cli post-pinboard-message <wallet> ./note.txt --content-type text/plain
eld-cli post-pinboard-message <wallet> ./note.txt --content-type text/plain --namespace peter
```

See [Custom namespaces](./namespaces) for registration and REST lookup.

### AddNamespace

Registers a custom namespace slug on-chain. The sender becomes **owner** of the slug; a duplicate slug or a **reserved** slug is rejected.

- **`namespace_slug`** — canonical lowercase slug (validated at construction)
- **`registration_fee`** — fee paid from the sender (must be greater than zero)

On commit, an immutable registry CADO is written at `/@eld/namespace/{namespace_slug}` with `owner` and `registered_height`.

```bash
eld-cli add-namespace <wallet_name> <namespace_slug>
eld-cli get-namespace <namespace_slug>
```

## Fees and lifecycle

1. **Build** — CLI or app constructs payload and loads the correct nonce from chain state
2. **Sign** — Sender signs with their wallet key
3. **Submit** — Transaction is sent to a node
4. **CheckTx / DeliverTx** — Validators verify signature, nonce, balance, and type-specific rules
5. **Commit** — State updates and events are persisted in the block

Fees are deducted from the sender on success. The CLI calculates fees when building transactions.

## Common failures

- Insufficient balance for transfer amount or fee
- Nonce not sequential
- Invalid or unregistered addresses
- Stake below minimum or unstake above staked balance
- Capacity registration with zero bytes or mismatched Merkle root at challenge time
- Pinboard validation errors (content type, tags, signature, TTL)
- Namespace upload without registration, wrong owner, or invalid slug
- `AddNamespace` on an already taken or reserved slug

## Related documentation

- [Accounts](./accounts-overview)
- [Consensus](./consensus) — epochs and validator roles
- [Capacity Provider](./capacity-provider)
- [Custom namespaces](./namespaces)
- [Content addresses](./content-addresses)
- [Eld CLI](./eld-cli)
