# Direct - Frontend

## Overview

The **Direct** frontend is a React-based web application that provides a seamless UI for cryptocurrency-to-fiat transactions. It enables users to connect their wallets, initiate transactions, and track payments securely.

## Features

- **Wallet Connection**: Uses Solana Wallet Adapter to connect wallets (Phantom, Solflare, etc.).
- **Transaction Initiation**: Allows users to enter details and confirm transfers.
- **Real-time Updates**: Utilizes WebSockets for instant transaction status updates.
- **Secure Webhooks**: Listens for transaction confirmations and displays results.

## Tech Stack

- **React.js** - UI Framework
- **Solana Wallet Adapter** - Wallet connection
- **Solana Web3.js** - Blockchain interaction
- **Socket.io** - Real-time updates
- **Axios** - API requests to backend

## Installation

```sh
git clone https://github.com/yourusername/direct-frontend.git
cd direct-frontend
npm install
npm start
```
