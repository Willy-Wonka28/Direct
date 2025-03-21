export const savePendingTransaction = (tx: any) => {
  try {
    const transactions: any[] = JSON.parse(
      localStorage.getItem("pendingTransactions") || "[]"
    );
    transactions.push(tx);
    localStorage.setItem("pendingTransactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving pending transaction:", error);
  }
};
