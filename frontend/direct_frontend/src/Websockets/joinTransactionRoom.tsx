import { socket } from "./index";

export const joinTransactionRoom = (transactionId: string) => {
  socket.emit("join_transaction_room", transactionId);
  console.log(`Joined transaction room: ${transactionId}`);
};

export const leaveTransactionRoom = (transactionId: string) => {
  socket.emit("leave_transaction_room", transactionId);
  console.log(`Left transaction room: ${transactionId}`);
};
