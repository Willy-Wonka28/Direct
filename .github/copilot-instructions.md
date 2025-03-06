# GitHub Copilot Custom Instructions

## **🌟 General Coding Standards**

- **Maintain Clean, Modular Code**: Keep functions and components small, reusable, and well-documented.
- **Error Handling**: Always handle errors gracefully, especially in API calls and blockchain transactions.
- **Security First**: Never expose private keys, API secrets, or sensitive logic in the frontend.

## **🖥️ Frontend (React + Solana Web3.js)**

- **Use Functional Components** and React Hooks (`useState`, `useEffect`).
- **Wallet Connection**: Implement Solana Wallet Adapter for seamless Phantom wallet integration.
- **Efficient API Calls**: Use `fetch` or `axios`, handle loading/error states properly.
- **Styling**: Use **TailwindCSS** for consistent UI styling.
- **Folder Structure**:
  - `/components`: Reusable UI components.
  - `/pages`: Route-based components.
  - `/utils`: Helper functions.
  - `/hooks`: Custom React hooks.

---

## **🔧 Backend (Express + Solana Web3.js)**

- **Use RESTful API design** with clear request/response structures.
- **Database**: Store fiat transaction records in PostgreSQL.
- **Transaction Flow**:
  - Confirm **crypto payment success** before initiating fiat payout.
  - Handle refunds securely in case of transaction failures.
- **Security Practices**:
  - Validate and sanitize all inputs.
  - Use **environment variables** for sensitive credentials.

---

## **🔗 Smart Contracts (Solana + Seahorse)**

- **Optimize transaction execution** to minimize fees.
- **Use Solana’s PDA (Program Derived Addresses)** for managing account states securely.
- **Test on Solana Devnet** before deploying to mainnet.
- **Keep contracts efficient**: Avoid unnecessary state storage.

---

## **🔄 Real-time Updates (Socket.io)**

- **Webhooks & Events**:
  - Emit events for transaction updates.
  - Secure webhooks using **API keys**.
