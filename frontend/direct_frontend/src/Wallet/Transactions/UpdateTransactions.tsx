import { useEffect } from "react";
import { useTransactions } from "../../context/TransactionContext";
import { socket } from "../../Websockets/index";
import { WebhookEvent } from "../../Websockets/webhook.events";
import { joinTransactionRooms } from "../../Websockets/joinTransactionRoom";

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

    // Set up socket listeners for transaction status updates
    const handleTransactionSuccess = (transactionId: string) => {
      console.log(`✅ Transaction successful: ${transactionId}`);
      updateTransaction({
        id: transactionId,
        status: "successful",
        updatedAt: new Date().toISOString(),
      });
    };

    const handleTransactionFailure = (transactionId: string) => {
      console.log(`❌ Transaction failed: ${transactionId}`);
      updateTransaction({
        id: transactionId,
        status: "failed",
        updatedAt: new Date().toISOString(),
      });
    };

    // Register listeners
    socket.on(WebhookEvent.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
    socket.on(WebhookEvent.TRANSACTION_FAILED, handleTransactionFailure);

    // Clean up listeners when component unmounts
    return () => {
      socket.off(WebhookEvent.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
      socket.off(WebhookEvent.TRANSACTION_FAILED, handleTransactionFailure);
    };
  }, [transactions, updateTransaction]);

  return null; // This component doesn't render anything
};

export default TransactionTracker;
