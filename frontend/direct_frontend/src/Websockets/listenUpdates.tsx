import { socket } from "./index";
import { Transaction, TransactionStatus } from "../transaction.type";
import { WebsocketEvents } from "./websocket.events";
import {
  getTransactionsFromLocalStorage,
  updateTransactionsInLocalStorage,
} from "../utils";

type TransactionUpdateCallback = (updatedTransaction: Transaction) => void;

export const listenForTransactionUpdates = (
  callback: TransactionUpdateCallback
) => {
  // Listen for successful transactions
  const handleTransactionSuccess = (transactionData: string | Transaction) => {
    let transaction: Transaction;
    let transactionId: string;

    // Handle different payload formats (string ID or full transaction object)
    if (typeof transactionData === "string") {
      console.log("✅ Transaction successful (ID):", transactionData);
      transactionId = transactionData;

      // We only received the ID, construct a minimal transaction object
      transaction = {
        id: transactionId,
        status: TransactionStatus.SUCCESS,
        updatedAt: new Date().toISOString(),
      } as Transaction;
    } else {
      console.log("✅ Transaction successful (object):", transactionData);
      transaction = transactionData;
      transactionId = transaction.id;
    }

    // Update the transaction in localStorage
    updateTransactionInLocalStorage(transactionId, TransactionStatus.SUCCESS);

    // Notify the component through the callback
    callback(transaction);
  };

  // Listen for failed transactions
  const handleTransactionFailure = (transactionData: string | Transaction) => {
    let transaction: Transaction;
    let transactionId: string;

    // Handle different payload formats (string ID or full transaction object)
    if (typeof transactionData === "string") {
      console.log("❌ Transaction failed (ID):", transactionData);
      transactionId = transactionData;

      // We only received the ID, construct a minimal transaction object
      transaction = {
        id: transactionId,
        status: TransactionStatus.FAILED,
        updatedAt: new Date().toISOString(),
      } as Transaction;
    } else {
      console.log("❌ Transaction failed (object):", transactionData);
      transaction = transactionData;
      transactionId = transaction.id;
    }

    // Update the transaction in localStorage
    updateTransactionInLocalStorage(transactionId, TransactionStatus.FAILED);

    // Notify the component through the callback
    callback(transaction);
  };

  // Helper function to update a transaction in localStorage by ID
  const updateTransactionInLocalStorage = (
    transactionId: string,
    newStatus: TransactionStatus
  ) => {
    try {
      // Get all transactions from localStorage
      const transactions = getTransactionsFromLocalStorage();

      // Find and update the specific transaction
      const updatedTransactions = transactions.map((tx) => {
        if (tx.id === transactionId) {
          return {
            ...tx,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return tx;
      });

      // Save the updated transactions back to localStorage
      updateTransactionsInLocalStorage(updatedTransactions);
      console.log(
        `Transaction ${transactionId} updated in localStorage to status: ${newStatus}`
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
