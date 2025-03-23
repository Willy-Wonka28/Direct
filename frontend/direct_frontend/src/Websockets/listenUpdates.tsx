import { socket } from "./index.ts";
import { Transaction } from "../transaction.type.ts";

export const listenForTransactionUpdates = (
  updateTransactionStatus: (data: Transaction) => void
) => {
  const handler = (data: Transaction) => {
    console.log("✅ Received transaction update:", data);
    updateTransactionStatus(data);
  };

  socket.on("transaction_update", handler);

  return () => {
    socket.off("transaction_update", handler);
  };
};
