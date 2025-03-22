import { socket } from "./index.ts";

<<<<<<< HEAD
const socket = io("https://direct-production.up.railway.app/transactions", {});

export const listenForTransactionUpdates = (
  updateTransactionStatus: (data: any) => void
) => {
  socket.on("transaction_update", (data) => {
    console.log("📡 Received transaction update:", data); // 👈 Check if this logs in the console
=======
export const listenForTransactionUpdates = (
  updateTransactionStatus: (data: any) => void
) => {
  socket.emit("join_transaction_room", (data) => {
    console.log("Received transaction update:", data);
>>>>>>> 39fa87f763dba609face21c072b83ff18d9fccf5
    updateTransactionStatus(data);
  });
};
