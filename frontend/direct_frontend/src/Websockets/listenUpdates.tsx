import { socket } from "./index.ts";

export const listenForTransactionUpdates = (
  updateTransactionStatus: (data: any) => void
) => {
  socket.emit("join_transaction_room", (data) => {
    console.log("Received transaction update:", data);
    updateTransactionStatus(data);
  });
};
