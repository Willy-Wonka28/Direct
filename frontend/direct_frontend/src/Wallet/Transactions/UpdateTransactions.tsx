import { useEffect } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { joinTransactionRooms } from "../../Websockets/joinTransactionRoom";
import { listenForTransactionUpdates } from "../../Websockets/listenUpdates";

const TransactionTracker = () => {
  const { transactions, updateTransaction } = useTransactions();

  // Set up listeners for transaction updates and join rooms for pending transactions
  useEffect(() => {
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
      updateTransaction({
        id: updatedTx.id,
        status: updatedTx.status,
        updatedAt: updatedTx.updatedAt || new Date().toISOString(),
      });

      // Show notification to user
      const statusMessage =
        updatedTx.status === "successful"
          ? "✅ Transaction completed successfully!"
          : "❌ Transaction failed";

      // You can implement a proper notification system here
      if (updatedTx.id) {
        alert(`${statusMessage} (ID: ${updatedTx.id.substring(0, 8)}...)`);
      }
    });

    return () => {
      cleanup();
    };
  }, [transactions, updateTransaction]);

  return null; // This component doesn't render anything
};

export default TransactionTracker;
