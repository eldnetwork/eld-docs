---
title: Get started with Eld
description: Quickstart for Eld testnet — install eld-cli, create a wallet, request faucet tokens, and send your first transfer.
---

# Get started with Eld

This quickstart gets you from zero to a signed transfer on the Eld testnet using **`eld-cli`**.

:::info Testnet
Commands below target the public testnet. Faucet tokens have no mainnet value; endpoints and limits can change.
:::

## 1. Install or obtain `eld-cli`

Use the released **`eld-cli`** binary for your platform (see project releases / operator docs). Configure the node RPC and app API with `--cli-config` (default: `config/config.json`).

Full command list: [Eld CLI reference](./eld-cli).

## 2. Create a wallet

```bash
eld-cli create-wallet alice
eld-cli get-wallet alice
```

:::warning Private keys
The wallet (including the private key) is stored locally, typically in `wallets.json`. Keep that file private.
:::

## 3. Request test tokens

```bash
eld-cli request-faucet 0x<your_address>
eld-cli get-account 0x<your_address>
```

## 4. Send a transfer

```bash
eld-cli transfer alice 0x<recipient_address> 1000000
```

Learn envelopes and other types in [Transactions](./transactions-overview).

## Next steps

| Goal                       | Page                                     |
| -------------------------- | ---------------------------------------- |
| Understand the protocol    | [Litepaper](./litepaper)                 |
| Register `@yourname`       | [Custom namespaces](./namespaces)        |
| Post TTL-bounded content   | [Eld CLI](./eld-cli) pinboard commands   |
| Provide storage capacity   | [Capacity provider](./capacity-provider) |
| Browse addresses and CADOs | [Content addresses](./content-addresses) |
| Common questions           | [FAQ](./faq)                             |
