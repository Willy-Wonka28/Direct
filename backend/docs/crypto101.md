# **📌 Lesson 1: Core Crypto & Solana Concepts**

This lesson lays the **foundational knowledge** needed to understand how blockchain technology works, specifically focusing on Solana's ecosystem and how it applies to **Direct** .

---

## **1.1 What is a Blockchain?**

A blockchain is a **decentralized, distributed ledger** that records transactions securely and immutably. It consists of a series of blocks linked together using cryptographic techniques.

### **How Blockchain Works**

1. **Transactions** are created when users send assets (crypto, tokens, or NFTs). These transactions are grouped into a **block** .
2. The block is **validated** by nodes in the network using a consensus mechanism.
3. Once validated, the block is **added to the chain** and cannot be altered.

### **Key Benefits of Blockchain for Direct**

✅ **Decentralization** – No central authority controls transactions.

✅ **Security** – Transactions are cryptographically signed and immutable.

✅ **Transparency** – Transactions are publicly viewable on the blockchain.

✅ **Finality** – Transactions, once confirmed, cannot be reversed.

---

## **1.2 Key Blockchain Concepts for Direct**

Direct relies on **blockchain fundamentals** to bridge cryptocurrency with fiat transactions. Here’s what you need to understand:

### **🔑 Public & Private Keys**

A **private key** is like a password that allows a user to sign transactions. A **public key** is like a bank account number that people can use to send funds.

- **Public Key** → Shared openly, used to receive funds.
- **Private Key** → Kept secret, used to sign transactions.
- **Solana Uses Ed25519 Cryptography** → Unlike Ethereum (which uses ECDSA), Solana uses Ed25519, making its transactions faster and lighter.

> **Example:** If a user wants to withdraw funds in Direct, their private key signs the transaction before it gets processed.

---

### **💼 Wallets: How Users Store & Access Crypto**

A **wallet** stores a user’s private key and lets them interact with the blockchain.

🔹 **Custodial Wallets** – Managed by third parties (like exchanges: Binance, Coinbase).

🔹 **Non-Custodial Wallets** – The user controls their private key (like Phantom, Solflare).

> **Direct will use non-custodial wallets** so users have full control over their funds.

**Example of Wallets in Solana:**

- **Phantom** (like MetaMask but for Solana)
- **Solflare**
- **Backpack**

> **How Direct Uses Wallets:** Users will connect their Phantom wallet to fund transactions.

---

### **📜 Transactions: The Foundation of Blockchain**

A **transaction** is any action recorded on the blockchain, such as sending SOL, swapping tokens, or interacting with smart contracts.

#### **Solana Transaction Structure**

A **transaction on Solana contains** :

1. **Signatures** – Proof of authenticity from the sender.
2. **Instructions** – Actions the transaction must execute (like transferring SOL).
3. **Recent Blockhash** – Ensures the transaction is valid within a short time frame.

> **For Direct:** Transactions will include sending SOL or exchanging assets using Solana Web3.js.

---

### **💡 Smart Contracts (Programs on Solana)**

On **Ethereum** , they’re called **Smart Contracts** .

On **Solana** , they’re called **Programs** .

**Key Differences:**

| Feature     | Ethereum Smart Contract | Solana Program         |
| ----------- | ----------------------- | ---------------------- |
| Language    | Solidity                | Rust or C              |
| Execution   | Runs on EVM             | Runs on Solana runtime |
| Persistence | Stores contract state   | Stateless by default   |

💡 Solana programs are designed for **efficiency and speed** . Instead of storing contract state on-chain, Solana uses **Accounts** to hold persistent data.

> **For Direct:** You may not need custom Solana programs unless you want to create advanced features like **on-chain escrow** .

---

### **⛽ Gas Fees (Transaction Costs) on Solana**

Every blockchain transaction **requires fees** to be processed.

**Gas Fee Comparison:**

| Blockchain | Average Gas Fee          |
| ---------- | ------------------------ |
| Ethereum   | $5 - $50 per transaction |
| Solana     | $0.00025 per transaction |

🔥 Solana is **cheaper and faster** than Ethereum, making it ideal for microtransactions in Direct.

> **For Direct:** Low fees allow seamless transactions between crypto and fiat.

---

### **⚡ Finality: Why Solana is Ultra-Fast**

**Finality** refers to the time it takes for a transaction to be **irreversible** .

| Blockchain | Finality Time |
| ---------- | ------------- |
| Bitcoin    | 10 minutes    |
| Ethereum   | 12-60 seconds |
| Solana     | 2-3 seconds   |

**How Solana Achieves Fast Finality:**

✅ Uses **Proof-of-History (PoH)** + Proof-of-Stake (PoS).

✅ Transactions are pre-ordered before validation.

✅ Parallel processing speeds up execution.

> **For Direct:** This ensures **instant settlement** of transactions.

---

## **1.3 Solana-Specific Terms**

### **🚀 Solana Web3.js**

The **JavaScript SDK** for interacting with Solana, allowing Direct to:

- Get balances
- Send transactions
- Interact with smart contracts

> **Why It Matters:** Direct’s backend will use Solana Web3.js for **handling crypto transactions.**

---

### **💰 SPL Tokens (Solana Program Library Tokens)**

SPL Tokens are **Solana’s version of ERC-20 tokens** (Ethereum’s standard for fungible tokens).

**Types of SPL Tokens:**

1. **Fungible Tokens** (like USDC, Direct’s own token if needed).
2. **Non-Fungible Tokens (NFTs)** – Unique assets stored on-chain.

> **For Direct:** SPL Tokens are useful if you want to create a **stable token representation of fiat** .

---

### **🛠️ Solana CLI (Command Line Interface)**

A tool for:

✅ Managing Solana wallets

✅ Deploying Solana programs

✅ Sending transactions via terminal

> **For Direct:** Developers will use Solana CLI for **testing and managing wallets on Devnet** .

---

### **🧪 Devnet: Solana’s Free Testing Network**

**Solana Devnet** is a test blockchain where developers can:

- Experiment **without spending real money** .
- Get **free test SOL** for transactions.
- Deploy **smart contracts safely** before moving to Mainnet.

> **For Direct:** All testing will be done on Devnet before production.

---

### **🌍 RPC Node: The Gateway to Blockchain Data**

An **RPC (Remote Procedure Call) Node** allows you to interact with the Solana blockchain by:

✅ Querying balances

✅ Fetching transaction history

✅ Broadcasting transactions

> **For Direct:** You will need an RPC provider like **QuickNode or Alchemy** to improve performance.

---

## **🛠 How These Concepts Fit into Direct**

| Concept               | Relevance to Direct                               |
| --------------------- | ------------------------------------------------- |
| Public & Private Keys | Users sign transactions securely                  |
| Wallets               | Users connect Phantom to send funds               |
| Transactions          | Required for crypto payments & swaps              |
| Smart Contracts       | Optional, if escrow-like features are needed      |
| Gas Fees              | Users pay minimal fees per transaction            |
| Finality              | Ensures fast and irreversible settlements         |
| Solana Web3.js        | Handles blockchain interactions in the app        |
| SPL Tokens            | Needed if Direct wants a custom token             |
| Solana CLI            | Helps developers manage wallets & deploy programs |
| Devnet                | Allows testing before going live                  |
| RPC Node              | Enables real-time transaction updates             |

---

## **📌 Summary of Lesson 1**

✅ You now understand **how blockchain and Solana work** .

✅ You learned **core Solana tools** relevant to Direct.

✅ You see how **these concepts power Direct’s crypto-fiat transactions** .

---

## **🚀 Next Steps: Hands-On Tasks**

1️⃣ **Set up a Solana wallet** using Solana CLI.

2️⃣ **Airdrop free SOL** on Devnet and check balance.

3️⃣ **Use Web3.js to fetch account details.**

Would you like a **step-by-step guide** on setting up Solana CLI and Web3.js? 🚀
