import { socket } from "./index";
export const joinTransactionRoom = (transactionId: string) => {
  socket.emit("join_transaction_room", transactionId);
};
