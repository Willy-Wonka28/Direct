import { Transaction } from "./transaction.type";
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
      if (tx.status === "pending") {
        const response = await getTransactionById(tx.id);

        if (response.success && response.transaction) {
          // Update transaction if status has changed
          const serverTx = response.transaction;

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
          if (serverTx.status === "pending") {
            pendingIds.push(tx.id);
          }
        } else {
          // If we couldn't fetch the transaction, still consider it pending
          pendingIds.push(tx.id);
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
  localStorage.setItem(
    "pendingTransactions",
    JSON.stringify(transactions.map((tx) => ({ data: tx })))
  );
}
