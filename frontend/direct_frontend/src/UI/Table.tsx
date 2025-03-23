import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { listenForTransactionUpdates } from "../Websockets/listenUpdates";
import { Transaction } from "../transaction.type";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const updateTransactions = () => {
    const storedData = JSON.parse(
      localStorage.getItem("pendingTransactions") || "[]"
    );

    if (Array.isArray(storedData)) {
      setTransactions(storedData.map((item) => item.data)); // ✅ Ensure re-render
    }
  };

  useEffect(() => {
    updateTransactions(); // Load initial transactions

    const updateTransactionStatus = (data: any) => {
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) =>
          tx.id === data.id ? { ...tx, status: data.status } : tx
        )
      );

      // Update Local Storage
      let storedTransactions = JSON.parse(
        localStorage.getItem("pendingTransactions") || "[]"
      );
      storedTransactions = storedTransactions.map((tx: any) =>
        tx.data.id === data.id
          ? { ...tx, data: { ...tx.data, status: data.status } }
          : tx
      );
      localStorage.setItem(
        "pendingTransactions",
        JSON.stringify(storedTransactions)
      );
    };

    const unsubscribe = listenForTransactionUpdates(updateTransactionStatus);

    return () => {
      unsubscribe?.(); // ✅ Ensure cleanup
    };
  }, []);

  return (
    <div className="md:p-6 p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto shadow-lg rounded-lg"
      >
        <table className="min-w-full shadow-lg text-white rounded-md overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Transaction ID</th>
              <th className="px-6 py-3 text-left">Receiver Name</th>
              <th className="px-6 py-3 text-left">Sender</th>
              <th className="px-6 py-3 text-left">Amount (SOL)</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="border-b"
                >
                  <td className="px-6 py-4">{tx.id}</td>
                  <td className="px-6 py-4">{tx.receiverName}</td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                    {tx.sender}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {tx.senderAmount} SOL
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      tx.status === "PENDING"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {tx.status}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No pending transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
