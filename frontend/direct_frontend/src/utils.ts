import { Transaction, TransactionStatus } from "./transaction.type";
import { getTransactionById } from "./api/transaction.api";

export async function refreshTransactionStatuses(
  transactions: Transaction[]
): Promise<{ updated: Transaction[]; pendingIds: string[] }> {
  const updatedTransactions: Transaction[] = [...transactions];
  const pendingIds: string[] = [];

  // Process transactions in sequence to avoid overwhelming the server
  for (const tx of transactions) {
    try {
      // Only check pending transactions
      if (tx.status === TransactionStatus.PENDING) {
        const response = await getTransactionById(tx.id);

        if (response.success && response.data) {
          // Update transaction if status has changed
          const serverTx = response.data;

          if (serverTx.status !== tx.status) {
            console.log(
              `Transaction ${tx.id} status updated: ${serverTx.status}`
            );

            // Find and update the transaction in our local array
            const index = updatedTransactions.findIndex((t) => t.id === tx.id);
            if (index !== -1) {
              updatedTransactions[index] = {
                ...updatedTransactions[index],
                status: serverTx.status,
                updatedAt: serverTx.updatedAt || new Date().toISOString(),
              };
            }
          }

          // If it's still pending, add to pendingIds for websocket subscription
          if (serverTx.status === TransactionStatus.PENDING) {
            pendingIds.push(tx.id);
          }
        } else {
          // If we couldn't fetch the transaction or got an error, still consider it pending
          pendingIds.push(tx.id);
          console.warn(
            `Could not verify status for transaction ${tx.id}: ${response.message}`
          );
        }
      }
    } catch (error) {
      console.error(`Error refreshing transaction ${tx.id}:`, error);
      // If there was an error, we should still consider it pending
      pendingIds.push(tx.id);
    }

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { updated: updatedTransactions, pendingIds };
}

// Helper function to update transactions in localStorage
export function updateTransactionsInLocalStorage(transactions: Transaction[]) {
  localStorage.setItem("pendingTransactions", JSON.stringify(transactions));
}

// Helper function to format transaction amount with currency
export function formatAmount(amount: number, currency: string): string {
  if (currency === "SOL") {
    return `${amount.toFixed(4)} SOL`;
  } else if (currency === "NGN") {
    return `₦${amount.toFixed(2)}`;
  }
  return `${amount} ${currency}`;
}
