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
  try {
    localStorage.setItem("pendingTransactions", JSON.stringify(transactions));
    console.log(`Updated ${transactions.length} transactions in localStorage`);
  } catch (error) {
    console.error("Failed to update localStorage:", error);
  }
}

// Helper function to retrieve transactions from localStorage
export function getTransactionsFromLocalStorage(): Transaction[] {
  try {
    const storedData = localStorage.getItem("pendingTransactions");
    if (!storedData) return [];

    const parsedData = JSON.parse(storedData);

    // Ensure we have an array of transactions
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Error retrieving transactions from localStorage:", error);
    return [];
  }
}

// Helper function to add a single transaction to localStorage
export function addTransactionToLocalStorage(transaction: Transaction): void {
  try {
    const existingTransactions = getTransactionsFromLocalStorage();
    const exists = existingTransactions.some((tx) => tx.id === transaction.id);

    if (!exists) {
      const updatedTransactions = [...existingTransactions, transaction];
      updateTransactionsInLocalStorage(updatedTransactions);
      console.log(`Added transaction ${transaction.id} to localStorage`);
    } else {
      console.log(
        `Transaction ${transaction.id} already exists in localStorage`
      );
    }
  } catch (error) {
    console.error("Error adding transaction to localStorage:", error);
  }
}

// Helper function to update a single transaction in localStorage
export function updateTransactionStatusInLocalStorage(
  transactionId: string,
  status: TransactionStatus
): void {
  try {
    const existingTransactions = getTransactionsFromLocalStorage();
    const updatedTransactions = existingTransactions.map((tx) => {
      if (tx.id === transactionId) {
        return {
          ...tx,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return tx;
    });

    updateTransactionsInLocalStorage(updatedTransactions);
    console.log(
      `Updated transaction ${transactionId} status to ${status} in localStorage`
    );
  } catch (error) {
    console.error("Error updating transaction status in localStorage:", error);
  }
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
