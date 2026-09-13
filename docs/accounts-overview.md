---
title: Eld accounts and Ed25519 addresses
description: How Eld accounts work — Ed25519 addresses, balances, nonces, and creating wallets with eld-cli.
---

# Eld accounts and Ed25519 addresses

This document explains how accounts work in the Eld network, including address creation, representation, and how to create accounts using the CLI.

## Overview

An **account** in Eld represents a user's identity on the network. Each account has:

- **Address**: A unique 20-byte identifier derived from a public key
- **Balance**: The account's token balance
- **Nonce**: A counter that tracks the number of transactions sent from this account

Accounts are stored on-chain and can be queried by their address.

## Address Creation and Representation

### Address Derivation

Eld addresses are derived from Ed25519 public keys using the following process:

1. **Generate Ed25519 Keypair**: A 32-byte private key is used to generate a 32-byte public key
2. **Hash the Public Key**: The public key is hashed using SHA-256
3. **Take First 20 Bytes**: The first 20 bytes of the hash become the address

```rust
// Pseudocode for address derivation
public_key = ed25519_derive_public_key(private_key)  // 32 bytes
hash = SHA256(public_key)                            // 32 bytes
address = hash[0..20]                                 // 20 bytes
```

### Address Format

Addresses in Eld are represented as:

- **Hex-encoded**: 40 hexadecimal characters (20 bytes × 2)
- **With 0x prefix**: `0x` followed by 40 hex characters
- **Example**: `0xe17404c417fa10cc04fdf73604fcacca8d0a687c`

Addresses can be used with or without the `0x` prefix in most contexts, but the canonical format includes the prefix.

### Address Properties

- **Length**: Always 20 bytes (40 hex characters)
- **Deterministic**: The same public key always produces the same address
- **Unique**: Different public keys produce different addresses (with extremely high probability)

## Creating an Account

### Using the CLI

To create a new account (wallet) in Eld, use the `create-wallet` command:

```bash
eld-cli create-wallet <wallet_name>
```

**Example:**

```bash
eld-cli create-wallet mywallet
```

### What Happens When You Create a Wallet

1. **Key Generation**: A new Ed25519 keypair is generated using cryptographically secure random number generation
2. **Address Derivation**: The address is derived from the public key using the process described above
3. **Wallet Storage**: The wallet (including private key, public key, and address) is saved locally in `wallets.json`

### Wallet vs Account

- **Wallet**: A local file containing your private key, public key, and address. Used for signing transactions.
- **Account**: The on-chain representation of your address, including balance and nonce. Created automatically when you first interact with the network.

**Important**: Creating a wallet does not automatically create an on-chain account. An account is created on-chain when:

- You receive tokens (e.g., from a faucet or transfer)
- You send your first transaction
- You are registered as a validator

### Viewing Your Wallet

To view wallet information:

```bash
# List all wallets
eld-cli list-wallets

# Get a specific wallet
eld-cli get-wallet <wallet_name>
```

### Viewing Your Account

To view your on-chain account (balance, nonce):

```bash
eld-cli get-account <address>
```

**Example:**

```bash
eld-cli get-account 0xe17404c417fa10cc04fdf73604fcacca8d0a687c
```

## Account Structure

An account on-chain contains:

```rust
pub struct Account {
    pub address: Address,    // 20-byte address
    pub balance: Coin,       // Token balance
    pub nonce: u64,          // Transaction counter
}
```

### Balance

The account's token balance, represented as a `Coin` type. Balances are stored as `u128` values internally.

### Nonce

The nonce is a counter that tracks the number of transactions sent from this account. Each transaction must have a nonce that is:

- **Sequential**: Each new transaction must have a nonce one greater than the previous transaction
- **Unique**: Prevents transaction replay attacks
- **Required**: All transactions must include a valid nonce

## Security Considerations

:::warning Private keys
Your private key is stored in `wallets.json`. Keep this file secure and never share it. Anyone with the file can spend your funds.
:::

1. **Address Reuse**: The same address can be used for multiple transactions. Addresses are public and can be shared.
2. **Nonce Management**: The CLI automatically manages nonces by querying the current account nonce before creating transactions.

## Examples

### Complete Workflow: Create Wallet and Get Tokens

:::caution Testnet faucet
`request-faucet` is for testnet tokens only. Availability and limits depend on the faucet operator; do not rely on it for mainnet or production balances.
:::

```bash
# 1. Create a new wallet
eld-cli create-wallet alice

# 2. View the wallet to get the address
eld-cli get-wallet alice

# 3. Request tokens from the faucet (if available)
eld-cli request-faucet 0x<your_address>

# 4. Check your account balance
eld-cli get-account 0x<your_address>
```

### Address Format Examples

```
Valid addresses:
- 0xe17404c417fa10cc04fdf73604fcacca8d0a687c  (with 0x prefix)
- e17404c417fa10cc04fdf73604fcacca8d0a687c    (without 0x prefix, also accepted)

Invalid addresses:
- 0xe17404c417fa10cc04fdf73604fcacca8d0a687   (too short, 19 bytes)
- 0xe17404c417fa10cc04fdf73604fcacca8d0a687cc (too long, 21 bytes)
- e17404c417fa10cc04fdf73604fcacca8d0a687g     (invalid hex character 'g')
```

## Technical Details

### Address Implementation

Addresses are implemented as a 20-byte array:

```rust
pub struct Address {
    value: [u8; 20],
}
```

### Address Validation

Addresses are validated to ensure:

- Correct length (20 bytes)
- Valid hexadecimal encoding
- Proper format (with or without 0x prefix)

### Address Serialization

Addresses are serialized as hex strings with the `0x` prefix in JSON:

```json
{
  "address": "0xe17404c417fa10cc04fdf73604fcacca8d0a687c"
}
```

## Related Documentation

- [Eld CLI](./eld-cli)
- [Transactions](./transactions-overview)
