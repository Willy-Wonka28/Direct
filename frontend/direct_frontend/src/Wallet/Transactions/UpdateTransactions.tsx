import { useEffect } from "react";
import { listenForTransactionUpdates } from "../../Websockets/listenUpdates";
import { Transaction } from "../../transaction.type.ts";

const TransactionTracker = () => {
  useEffect(() => {
    listenForTransactionUpdates((updatedTransaction: Transaction) => {
      let transactions: Transaction[] = JSON.parse(
        localStorage.getItem("pendingTransactions") || "[]"
      );

      // Find the transaction that matches the incoming update
      const index = transactions.findIndex(
        (tx) => tx.id === updatedTransaction.id
      );

      if (index !== -1) {
        // Update only the matching transaction
        transactions[index] = {
          ...transactions[index],
          status: updatedTransaction.status,
          updatedAt:
            updatedTransaction.updatedAt || transactions[index].updatedAt,
        };

        localStorage.setItem(
          "pendingTransactions",
          JSON.stringify(transactions)
        );
      }
    });
  });

  return null;
};

export default TransactionTracker;
