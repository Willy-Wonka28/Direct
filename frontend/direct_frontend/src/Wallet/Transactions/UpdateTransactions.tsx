import { useEffect, useState, useCallback } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { joinTransactionRooms } from "../../Websockets/joinTransactionRoom";
import { listenForTransactionUpdates } from "../../Websockets/listenUpdates";
import { getTransactionById } from "../../api/transaction.api";
import { Transaction, TransactionStatus } from "../../transaction.type";

const TransactionTracker = () => {
  const { transactions, updateTransaction, } =
    useTransactions();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCheckingTransactions, setIsCheckingTransactions] = useState(false);

  // Function to check a single transaction's status from the server
  const checkTransactionStatus = useCallback(
    async (tx: Transaction) => {
      try {
        console.log(`Checking status for transaction ${tx.id}...`);
        const response = await getTransactionById(tx.id);

        if (response.success && response.data) {
          const serverTx = response.data;

          // If status changed, update the transaction
          if (serverTx.status !== tx.status) {
            console.log(
              `Transaction ${tx.id} status updated from ${tx.status} to ${serverTx.status}`
            );

            // Update the transaction with new data from server
            updateTransaction({
              ...tx,
              ...serverTx,
              updatedAt: new Date().toISOString(),
            });

            return {
              id: tx.id,
              status: serverTx.status,
              needsRoomJoin: serverTx.status === TransactionStatus.PENDING,
            };
          }
        } else {
          console.warn(
            `Could not verify status for transaction ${tx.id}: ${response.message}`
          );
        }

        // If we couldn't check or status hasn't changed, assume still pending
        return {
          id: tx.id,
          status: tx.status,
          needsRoomJoin: tx.status === TransactionStatus.PENDING,
        };
      } catch (error) {
        console.error(`Error checking transaction ${tx.id}:`, error);
        return {
          id: tx.id,
          status: tx.status,
          needsRoomJoin: tx.status === TransactionStatus.PENDING,
        };
      }
    },
    [updateTransaction]
  );

  // Check all transaction statuses on initial load
  useEffect(() => {
    if (isInitialLoad && transactions.length > 0 && !isCheckingTransactions) {
      const checkAllTransactions = async () => {
        console.log("Checking all transaction statuses on page load...");
        setIsCheckingTransactions(true);

        try {
          // For each transaction, check its status from the server
          const pendingIds: string[] = [];
          const checkResults = await Promise.all(
            transactions.map((tx) => checkTransactionStatus(tx))
          );

          // Collect IDs of transactions that are still pending
          checkResults.forEach((result) => {
            if (result.needsRoomJoin) {
              pendingIds.push(result.id);
            }
          });

          // Join rooms for transactions that are still pending
          if (pendingIds.length > 0) {
            joinTransactionRooms(pendingIds);
            console.log(
              `Joined rooms for ${pendingIds.length} pending transactions:`,
              pendingIds
            );
          }
        } catch (error) {
          console.error("Error checking transaction statuses:", error);
        } finally {
          setIsCheckingTransactions(false);
          setIsInitialLoad(false);
        }
      };

      checkAllTransactions();
    }
  }, [
    isInitialLoad,
    transactions,
    checkTransactionStatus,
    isCheckingTransactions,
  ]);

  // Set up listeners for transaction updates and join rooms for pending transactions
  useEffect(() => {
    if (!isInitialLoad && !isCheckingTransactions) {
      // Filter for pending transactions
      // const pendingTransactions = transactions.filter(
      //   (tx) => tx.status === TransactionStatus.PENDING
      // );

      // Set up global listener for all transaction updates
      const cleanup = listenForTransactionUpdates((updatedTx) => {
        console.log(
          `Received transaction update for ID: ${updatedTx.id}`,
          updatedTx
        );
        updateTransaction(updatedTx);

        // Show notification to user
        const statusMessage =
          updatedTx.status === TransactionStatus.SUCCESS
            ? "✅ Transaction completed successfully!"
            : "❌ Transaction failed";

        if (updatedTx.id) {
          // Log to console
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
  }, [transactions, updateTransaction, isInitialLoad, isCheckingTransactions]);

  return null; // This component doesn't render anything
};

export default TransactionTracker;
