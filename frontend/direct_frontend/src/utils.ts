import { Transaction } from "./transaction.type";

export const loadTransactions = (): Transaction[] => {
  try {
    const storedTransactions = JSON.parse(
      localStorage.getItem("pendingTransactions") || "[]"
    );

    // Extract transactions from stored format
    return storedTransactions.map((item: any) =>
      item.data ? item.data : item
    );
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
