import { socket } from "./index";
import { Transaction } from "../transaction.type";
import { WebhookEvent } from "./webhook.events";

type TransactionUpdateCallback = (updatedTransaction: Transaction) => void;

export const listenForTransactionUpdates = (
  callback: TransactionUpdateCallback
) => {
  // Listen for successful transactions
  const handleTransactionSuccess = (transactionId: string) => {
    console.log("✅ Transaction successful:", transactionId);
    callback({
      id: transactionId,
      status: "successful",
      updatedAt: new Date().toISOString(),
    } as Transaction);
  };

  // Listen for failed transactions
  const handleTransactionFailure = (transactionId: string) => {
    console.log("❌ Transaction failed:", transactionId);
    callback({
      id: transactionId,
      status: "failed",
      updatedAt: new Date().toISOString(),
    } as Transaction);
  };

  socket.on(WebhookEvent.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
  socket.on(WebhookEvent.TRANSACTION_FAILED, handleTransactionFailure);

  // Return a cleanup function
  return () => {
    socket.off(WebhookEvent.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
    socket.off(WebhookEvent.TRANSACTION_FAILED, handleTransactionFailure);
  };
};
