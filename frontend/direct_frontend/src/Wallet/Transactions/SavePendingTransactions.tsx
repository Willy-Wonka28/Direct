// import { Transaction } from "../../transaction.type";
// import { useTransactions } from "../../context/TransactionContext";

// export const useSavePendingTransaction = () => {
//   const { addTransaction } = useTransactions();

//   const savePendingTransaction = (tx: Transaction) => {
//     try {
//       addTransaction(tx);
//     } catch (error) {
//       console.error("Error saving pending transaction:", error);
//     }
//   };

//   return savePendingTransaction;
// };

// // Keep the old function for backward compatibility
// export const savePendingTransaction = (tx: Transaction) => {
//   try {
//     const transactions: Transaction[] = JSON.parse(
//       localStorage.getItem("pendingTransactions") || "[]"
//     );
//     transactions.push(tx);
//     localStorage.setItem("pendingTransactions", JSON.stringify(transactions));
//   } catch (error) {
//     console.error("Error saving pending transaction:", error);
//   }
// };
