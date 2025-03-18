# Direct - Cryptocurrency to Fiat Bridge

## Overview

**Direct** is a blockchain-based payment gateway that allows users to convert cryptocurrency into fiat seamlessly. It bridges the gap between crypto and traditional banking by providing a reliable and trustless transaction process.

## Architecture

Direct consists of **three core components**:

1. **Frontend** (`frontend/`)
   - A React-based UI that lets users connect wallets, initiate payments, and track transaction status.
2. **Backend** (`backend/`)
   - An Express.js server that processes transactions, integrates with Solana Web3.js, and handles fiat transactions via Squad API.
3. **Smart Contract** (`smart-contract/`)
   - A Solana smart contract (written in Rust via Seahorse) that ensures the integrity of crypto transactions.

## Tech Stack

- **Frontend:** React.js, Solana Wallet Adapter, Socket.io
- **Backend:** Express.js, Solana Web3.js, PostgreSQL
- **Smart Contract:** Rust (Anchor or Native Rust), Solana CLI

## Getting Started

### Clone the repository

```sh
git clone https://github.com/Willy-Wonka28/Direct.git
cd direct
```
