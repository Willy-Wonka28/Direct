import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../context/TransactionContext";

export default function TransactionTable() {
  const { transactions, refreshTransactions } = useTransactions();

  // Load transactions when component mounts
  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  return (
    <div className="p-2 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-lg rounded-lg overflow-x-auto"
      >
        <table className="shadow-lg rounded-md min-w-full overflow-hidden text-white">
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
                  <td className="px-6 py-4 max-w-xs text-gray-600 truncate">
                    {tx.sender}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {tx.senderAmount} SOL
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      tx.status === "pending"
                        ? "text-yellow-500"
                        : tx.status === "successful"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {tx.status.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-gray-500 text-center">
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
