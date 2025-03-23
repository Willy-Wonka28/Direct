import { io } from "socket.io-client";
import { TRANSACTION_WEBHOOK_URL } from "../config";

export const socket = io(TRANSACTION_WEBHOOK_URL, {});

export const stopListeningForTransactionUpdates = () => {
  socket.off("transactionUpdate");
};
