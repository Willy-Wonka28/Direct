import { io } from "socket.io-client";

const socket = io("https://direct-production.up.railway.app/transactions", {});

export const listenForTransactionUpdates = (
  updateTransactionStatus: (data: any) => void
) => {
  socket.on("transaction_update", (data) => {
    console.log("📡 Received transaction update:", data); // 👈 Check if this logs in the console
    updateTransactionStatus(data);
  });
};
