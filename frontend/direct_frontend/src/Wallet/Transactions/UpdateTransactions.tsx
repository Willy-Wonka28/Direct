import { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { joinTransactionRooms } from "../../Websockets/joinTransactionRoom";
import { listenForTransactionUpdates } from "../../Websockets/listenUpdates";
import { refreshTransactionStatuses } from "../../utils";

const TransactionTracker = () => {
  const { transactions, updateTransaction, setTransactions } =
    useTransactions();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check transaction statuses on initial load
  useEffect(() => {
    if (isInitialLoad && transactions.length > 0) {
      const checkTransactionStatuses = async () => {
        console.log("Checking transaction statuses on page load...");

        try {
          const { updated, pendingIds } = await refreshTransactionStatuses(
            transactions
          );

          // Update transactions with latest status from server
          if (JSON.stringify(updated) !== JSON.stringify(transactions)) {
            setTransactions(updated);
          }

          // Join rooms for transactions that are still pending
          if (pendingIds.length > 0) {
            joinTransactionRooms(pendingIds);
            console.log(
              `Joined rooms for ${pendingIds.length} pending transactions`
            );
          }
        } catch (error) {
          console.error("Error checking transaction statuses:", error);
        } finally {
          setIsInitialLoad(false);
        }
      };

      checkTransactionStatuses();
    }
  }, [isInitialLoad, transactions, setTransactions]);

  // Set up listeners for transaction updates and join rooms for pending transactions
  useEffect(() => {
    if (!isInitialLoad) {
      // Filter for pending transactions and join their rooms
      const pendingTransactions = transactions.filter(
        (tx) => tx.status === "pending"
      );

      if (pendingTransactions.length > 0) {
        const pendingTransactionIds = pendingTransactions.map((tx) => tx.id);
        joinTransactionRooms(pendingTransactionIds);

        console.log(
          `Joined rooms for ${pendingTransactionIds.length} pending transactions`
        );
      }

      // Set up global listener for all transaction updates
      const cleanup = listenForTransactionUpdates((updatedTx) => {
        console.log(
          `Received transaction update for ID: ${updatedTx.id}`,
          updatedTx
        );
        updateTransaction(updatedTx);

        // Show notification to user
        const statusMessage =
          updatedTx.status === "successful"
            ? "✅ Transaction completed successfully!"
            : "❌ Transaction failed";

        // You can implement a proper notification system here
        if (updatedTx.id) {
          // Using a more subtle notification than alert()
          console.info(
            `${statusMessage} (ID: ${updatedTx.id.substring(0, 8)}...)`
          );

          // Create a temporary notification element
          const notification = document.createElement("div");
          notification.className =
            "fixed top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50";
          notification.innerHTML = `${statusMessage} <span class="opacity-75 text-xs">(ID: ${updatedTx.id.substring(
            0,
            8
          )}...)</span>`;
          document.body.appendChild(notification);

          // Remove it after 5 seconds
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 5000);
        }
      });

      return () => {
        cleanup();
      };
    }
  }, [transactions, updateTransaction, isInitialLoad]);

  return null; // This component doesn't render anything
};

export default TransactionTracker;
