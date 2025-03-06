### **🚀 Crypto Class: Solana & Blockchain Essentials for Direct**

Welcome to your **Solana Blockchain Development Class** ! We'll cover the key tools and concepts needed to build **Direct** , focusing on **Solana Web3.js, SPL Tokens, Solana CLI, and Devnet** .

---

## **📌 Lesson 1: Core Crypto & Solana Concepts**

Before diving into tools, let's establish fundamental **blockchain concepts** relevant to Direct.

### **1.1 What is a Blockchain?**

A blockchain is a **decentralized ledger** that records transactions in blocks, ensuring security and transparency.

### **1.2 Key Blockchain Concepts for Direct**

🔹 **Public & Private Keys** – Users sign transactions with a private key, and others verify them with the public key.

🔹 **Wallets** – Applications like Phantom store private keys and interact with the blockchain.

🔹 **Transactions** – Blockchain updates require signed transactions (e.g., sending SOL or swapping tokens).

🔹 **Smart Contracts (Programs on Solana)** – On Ethereum, these are "smart contracts"; on Solana, they're **programs** deployed on-chain.

🔹 **Gas Fees (Transaction Fees)** – Solana requires **SOL** tokens to process transactions, but fees are much lower than Ethereum.

🔹 **Finality** – Transactions on Solana are **almost instant** , taking only a few seconds.

### **1.3 Solana-Specific Terms**

✅ **Solana Web3.js** – JavaScript SDK for interacting with the Solana blockchain.

✅ **SPL Tokens (Solana Program Library Tokens)** – The standard for fungible and non-fungible tokens on Solana.

✅ **Solana CLI** – A command-line tool for deploying programs, sending transactions, and managing wallets.

✅ **Devnet** – A Solana test environment where you can experiment without real money.

✅ **RPC Node** – A server that lets you interact with the blockchain (e.g., querying transaction history).

---

## **📌 Lesson 2: Solana Web3.js – Blockchain Interaction**

This is the **core JavaScript library** to send transactions, manage wallets, and interact with Solana programs.

### **2.1 Installing Solana Web3.js**

In your **React/Express project** , install:

```sh
npm install @solana/web3.js
```

### **2.2 Connecting a Wallet (Frontend Example)**

```js
import { Connection, PublicKey } from "@solana/web3.js";

// Connect to the blockchain
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Example: Get SOL balance of a wallet
const getBalance = async (walletAddress) => {
  const publicKey = new PublicKey(walletAddress);
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance / 1e9} SOL`); // Convert lamports to SOL
};
```

### **2.3 Sending SOL from One Wallet to Another**

```js
import {
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

// Create a transaction
const sendSol = async (fromKeypair, toAddress, amount) => {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: amount * 1e9, // Convert SOL to lamports
    })
  );

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
};
```

👉 This is **critical** for Direct, as users will send and receive SOL payments.

---

## **📌 Lesson 3: SPL Tokens – Creating & Managing Tokens**

Direct may need to handle **crypto reserves** using SPL Tokens (Solana’s version of ERC-20).

### **3.1 Installing SPL Token Library**

```sh
npm install @solana/spl-token
```

### **3.2 Creating an SPL Token**

```js
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Create an SPL token
const createToken = async (payer, mintAuthority, decimals) => {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const token = await Token.createMint(
    connection,
    payer, // Who pays for creation
    mintAuthority, // Who can mint new tokens
    null, // Optional freeze authority
    decimals, // Number of decimal places
    TOKEN_PROGRAM_ID
  );

  console.log(`Token Address: ${token.publicKey.toBase58()}`);
};
```

👉 If Direct needs **its own token** for transactions, this is how you do it.

---

## **📌 Lesson 4: Solana CLI – Managing Wallets & Programs**

## **When to Use Solana CLI**

Solana CLI is mainly useful for **development and testing** purposes:
✅ **Wallet Management** – Create, fund, and manage wallets.
✅ **Airdrop Test SOL** – Get free SOL for testing on Devnet.
✅ **Check Account Balances** – View balances without writing code.
✅ **Deploy Smart Contracts** – If you plan to write custom Solana Programs (not necessary for Direct).
✅ **Manually Send Transactions** – Useful for debugging or testing before automating transactions in your backend.

### **4.1 Installing Solana CLI**

```sh
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

### **4.2 Setting Up a Wallet**

```sh
solana-keygen new --outfile my-keypair.json
solana config set --keypair my-keypair.json
solana config set --url https://api.devnet.solana.com
```

### **4.3 Airdropping Test SOL (Devnet Only)**

```sh
solana airdrop 1
```

👉 This gives you **free test SOL** to use in development.

---

## **📌 Lesson 5: Deploying & Testing Transactions on Devnet**

### **5.1 Checking Account Balance**

```sh
solana balance
```

### **5.2 Sending SOL from CLI**

```sh
solana transfer <RECIPIENT_ADDRESS> 0.1 --allow-unfunded-recipient
```

### **5.3 Deploying a Smart Contract (For Advanced Phase of Direct)**

To deploy a **Rust-based smart contract** (Solana program):

```sh
solana program deploy my_solana_program.so
```

👉 For now, **Direct** can function without custom programs, just using **Web3.js transactions** .

---

## **📌 Lesson 6: Final Architecture for Direct (Blockchain Layer)**

Now that you understand the tools, here’s **how they fit into Direct** :

✅ **Solana Web3.js** – Send transactions, get balances, manage wallets.

✅ **SPL Tokens** – (Optional) If Direct needs tokenized reserves.

✅ **Solana CLI & Devnet** – For wallet creation, testing, and debugging.

### **📌 Direct Transaction Flow**

1️⃣ **User connects wallet** (Frontend → Solana Web3.js)

2️⃣ **User sends crypto or requests withdrawal**

3️⃣ **Express.js backend processes the transaction**

4️⃣ **If fiat is involved, Squad API is triggered**

5️⃣ **Transaction is recorded and reflected in UI**

---

## **🚀 Next Steps: Hands-On Tasks for You**

🎯 **Task 1:** Set up a Solana wallet using CLI and airdrop SOL.

🎯 **Task 2:** Use Web3.js to fetch and display a wallet's SOL balance.

🎯 **Task 3:** Implement a simple SOL transfer function using Web3.js.

Would you like a **starter project template** to speed up your learning? 🚀
