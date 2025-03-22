import { useEffect } from "react";
import { listenForTransactionUpdates } from "../../Websockets/listenUpdates";

const updateTransactionStatus = (data: any) => {
  let transactions = JSON.parse(
    localStorage.getItem("pendingTransactions") || "[]"
  );

  const index = transactions.findIndex((tx: any) => tx.id === data.id);

  if (index !== -1) {
    transactions[index] = {
      ...transactions[index], // Keep all existing data
      status: data.status, // Only update status
      updatedAt: data.updatedAt || transactions[index].updatedAt, // Keep updatedAt if provided
    };

    localStorage.setItem("pendingTransactions", JSON.stringify(transactions));
  }
};

const TransactionTracker = () => {
  useEffect(() => {
    listenForTransactionUpdates(updateTransactionStatus);

    return () => {
      // Optional: Add cleanup logic if needed in your WebSocket listener
    };
  }, []);

  return null; // This component doesn't render anything, it just listens
};

export default TransactionTracker;
