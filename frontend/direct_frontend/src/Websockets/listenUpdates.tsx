import { socket } from "./index";
import { Transaction } from "../transaction.type";
import { WebsocketEvents } from "./websocket.events";

type TransactionUpdateCallback = (updatedTransaction: Transaction) => void;

export const listenForTransactionUpdates = (
  callback: TransactionUpdateCallback
) => {
  // Listen for successful transactions
  const handleTransactionSuccess = (transaction: Transaction) => {
    console.log("✅ Transaction successful:", transaction);

    // Update transaction in localStorage directly too
    updateTransactionInLocalStorage(transaction);

    callback(transaction);
  };

  // Listen for failed transactions
  const handleTransactionFailure = (transaction: Transaction) => {
    console.log("❌ Transaction failed:", transaction);

    // Update transaction in localStorage directly too
    updateTransactionInLocalStorage(transaction);

    callback(transaction);
  };

  // Helper function to update localStorage directly
  const updateTransactionInLocalStorage = (
    updatedTx: Partial<Transaction> & { id: string }
  ) => {
    try {
      const storedTransactions = JSON.parse(
        localStorage.getItem("pendingTransactions") || "[]"
      );

      const updatedTransactions = storedTransactions.map((item: any) => {
        const tx = item.data ? item.data : item;
        if (tx.id === updatedTx.id) {
          return { data: { ...tx, ...updatedTx } };
        }
        return item;
      });

      localStorage.setItem(
        "pendingTransactions",
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error("Error updating transaction in localStorage:", error);
    }
  };

  socket.on(WebsocketEvents.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
  socket.on(WebsocketEvents.TRANSACTION_FAILED, handleTransactionFailure);

  // Return a cleanup function
  return () => {
    socket.off(
      WebsocketEvents.TRANSACTION_SUCCESSFUL,
      handleTransactionSuccess
    );
    socket.off(WebsocketEvents.TRANSACTION_FAILED, handleTransactionFailure);
  };
};
