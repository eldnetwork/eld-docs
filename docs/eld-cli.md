---
title: Eld CLI
description: Eld CLI reference — wallets, transfers, staking, pinboard, CADO queries, CosmWasm, and capacity provider commands.
---

# Eld CLI

The Eld CLI (`eld-cli`) is the command-line interface for interacting with the Eld network. It supports wallet management, transfers, staking, pinboard posts, CADO queries, CosmWasm contracts, and capacity provider daemon control.

Configure the node and endpoints with `--cli-config` (default: `config/config.json`).

## Commands

### Wallet

| Command | Description |
|--------|-------------|
| `create-wallet <name>` | Create a wallet (local keypair). |
| `list-wallets` | List wallets stored locally. |
| `get-wallet <name>` | Display a wallet by name. |
| `remove-wallet <name>` | Remove a wallet (**deletes the private key**). |

### Transfers and faucet

| Command | Description |
|--------|-------------|
| `transfer <wallet_name> <recipient> <amount>` | Transfer native tokens. |
| `request-faucet <address>` | Request test tokens from the faucet for an address. |

### Account and chain info

| Command | Description |
|--------|-------------|
| `get-account <address>` | Fetch account state from a node. |
| `get-stake-account <address>` | Fetch staking state for an address. |
| `get-abci-info` | Fetch ABCI info from the node. |
| `list-all-transactions` | List all transactions on the chain (testing). |
| `list-transactions <addr>` | List transactions involving an address. |

### Staking and epochs

| Command | Description |
|--------|-------------|
| `stake <wallet_name> <amount>` | Stake tokens. |
| `unstake <wallet_name> <amount>` | Unstake tokens back to the wallet. |
| `view-active-validators` | Show active validators. |
| `view-epoch-info` | Show current epoch info. |
| `view-epoch` | Show detailed epoch info including active validators. |

### Custom namespaces

| Command | Description |
|--------|-------------|
| `add-namespace <wallet_name> <namespace_slug>` | Register a custom namespace (`AddNamespace` tx). Options: `--registration-fee` (must be greater than zero). Polls REST until registered. |
| `get-namespace <namespace_slug>` | Look up registry via `GET /v1/namespace/{slug}`. |

### Pinboard

| Command | Description |
|--------|-------------|
| `post-pinboard-message <wallet_name> <file_path> --content-type <mime>` | Post a pinboard message from a file. Options: `--expires-height` (TTL in blocks, default `1000`), `--visibility` (default `Public`), `--topic`, `--tag` (repeatable, max 4), `--user-fee-amount` (default `1000`), `--namespace <slug>` (registered namespace; poster must be owner). |
| `pinboard-get-post <wallet> <message_id>` | Fetch a single post. |
| `pinboard-list-by-tag <tag>` | List posts by tag. Options: `--page`, `--page-size` (default `100`). |
| `pinboard-list-by-wallet <wallet>` | List posts by wallet. Options: `--page`, `--page-size`. |

### CADO (content-addressed data objects)

| Command | Description |
|--------|-------------|
| `get-cado <path>` | Query a CADO by path (e.g. `/@eld/account/0x...`). |
| `list-cados <search_string>` | List CADO paths matching a prefix (e.g. `/@eld/`). |

### CosmWasm contracts

| Command | Description |
|--------|-------------|
| `add-contract <wallet_name> <contract_path> <args_json>` | Deploy a WASM contract. `args_json` is inline JSON or a path to a JSON file. |
| `contract-query <contract_id> <field_name>` | Query a contract field. |
| `contract-query2 <contract_id> <query_type> <query_args_json>` | Query by type with JSON args. |
| `execute-contract <wallet_name> <contract_id> <method_name> <args_json_path>` | Execute a contract method. Use a path to a JSON file; `{}` for no args. |

### Capacity provider

Subcommand: `capacity-provider` (hyphenated).

| Command | Description |
|--------|-------------|
| `capacity-provider init` | Allocate capacity file and slot map. **Required flags:** `--wallet-name`, `--capacity-mb`. Optional: `--storage-path` (default `./capacity`), `--log-mode` (`terminal` or `file`), `--log-file`. |
| `capacity-provider start` | Run the capacity provider daemon (P2P, challenges, content sync). **Required:** `--wallet-name`. Optional: `--storage-path`, `--log-mode`, `--log-file`, `--api-port` (default `8080`). |
| `capacity-provider stop` | Stop hint only; use Ctrl+C on a running daemon. |
| `capacity-provider status` | Registration and Merkle root status. **Required:** `--wallet-name`. Optional: `--storage-path`. |
| `capacity-provider info` | Detailed slot and capacity metadata. **Required:** `--wallet-name`. Optional: `--storage-path`. |

## Examples

```bash
eld-cli create-wallet alice
eld-cli request-faucet 0x<alice_address>
eld-cli transfer alice 0x<bob_address> 1000000
eld-cli stake alice 5000000
eld-cli post-pinboard-message alice ./note.txt --content-type text/plain --tag demo
eld-cli add-namespace alice peter
eld-cli get-namespace peter
eld-cli post-pinboard-message alice ./note.txt --content-type text/plain --namespace peter
eld-cli get-cado /@eld/account/0x<address>
eld-cli capacity-provider init --wallet-name cp1 --capacity-mb 100
eld-cli capacity-provider start --wallet-name cp1 --api-port 8080
```

## Overview

The CLI stores wallets locally and talks to an Eld node using `config/config.json` (RPC and app API URLs). Chain operations submit signed transactions; pinboard posts use the node’s submit API before a `PostMessage` tx is broadcast. Namespace registration uses `AddNamespace`; namespace uploads pass `--namespace` on pinboard submit. The capacity provider daemon registers on-chain, participates in content sync and capacity challenges over libp2p, and exposes a small HTTP dashboard on `--api-port`.

See [Custom namespaces](./namespaces) for paths and REST APIs.
