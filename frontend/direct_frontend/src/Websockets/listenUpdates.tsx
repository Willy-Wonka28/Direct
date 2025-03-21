import { io } from "socket.io-client";

const socket = io("https://direct-production.up.railway.app/transactions", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

export const listenForTransactionUpdates = (updateTransactionStatus: (data: any) => void) => {
  socket.on("transaction_update", (data) => {
    console.log("Received transaction update:", data);
    updateTransactionStatus(data); 
  });
};
