## Direct - Backend

## Overview

The **Direct** backend is built using **Express.js**, serving as the intermediary between the frontend, blockchain, and fiat banking system. It processes transactions, verifies payments, and handles webhook events.

## Features

- **API for Transactions**: Processes user transfer requests.
- **Solana Web3.js Integration**: Monitors blockchain transactions.
- **Fiat Transactions**: Uses Squad API to handle fiat transfers.
- **Webhooks & Real-time Events**: Implements Socket.io for real-time updates.

## Tech Stack

- **Express.js** - Backend framework
- **Solana Web3.js** - Blockchain interaction
- **Squad API** - Fiat transaction processing
- **Socket.io** - Webhook event handling
- **PostgreSQL** - Database for tracking transactions

## Installation

```sh
git clone https://github.com/yourusername/direct-backend.git
cd direct-backend
npm install
npm start
```

## API Endpoints

| Method | Endpoint                   | Description                      |
| ------ | -------------------------- | -------------------------------- |
| POST   | `/api/transaction/init`    | Initializes a crypto transaction |
| POST   | `/api/transaction/confirm` | Confirms transaction success     |
| POST   | `/api/webhook`             | Handles webhook events           |
