import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Transaction } from "../transaction.type";
import { socket } from "../Websockets/index";
import { WebhookEvent } from "../Websockets/webhook.events";
import { joinTransactionRooms } from "../Websockets/joinTransactionRoom";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (
    updatedTransaction: Partial<Transaction> & { id: string }
  ) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  refreshTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load transactions from localStorage on initial mount only
  useEffect(() => {
    if (!isInitialized) {
      refreshTransactions();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Set up WebSocket listeners and room joining
  useEffect(() => {
    if (transactions.length === 0) return;

    // Get pending transaction IDs
    const pendingTransactionIds = transactions
      .filter((tx) => tx.status === "pending")
      .map((tx) => tx.id);

    // Join rooms for all pending transactions
    if (pendingTransactionIds.length > 0) {
      joinTransactionRooms(pendingTransactionIds);
    }

    // Listen for transaction updates
    const handleTransactionSuccess = (transactionId: string) => {
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) => {
          if (tx.id === transactionId) {
            return {
              ...tx,
              status: "successful",
              updatedAt: new Date().toISOString(),
            };
          }
          return tx;
        })
      );
      console.log(`✅ Transaction successful: ${transactionId}`);
    };

    const handleTransactionFailure = (transactionId: string) => {
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) => {
          if (tx.id === transactionId) {
            return {
              ...tx,
              status: "failed",
              updatedAt: new Date().toISOString(),
            };
          }
          return tx;
        })
      );
      console.log(`❌ Transaction failed: ${transactionId}`);
    };

    socket.on(WebhookEvent.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
    socket.on(WebhookEvent.TRANSACTION_FAILED, handleTransactionFailure);

    // Save updated transactions to localStorage whenever they change
    saveTransactionsToLocalStorage(transactions);

    return () => {
      socket.off(WebhookEvent.TRANSACTION_SUCCESSFUL, handleTransactionSuccess);
      socket.off(WebhookEvent.TRANSACTION_FAILED, handleTransactionFailure);
    };
  }, [transactions]);

  // Save transactions to localStorage
  const saveTransactionsToLocalStorage = (txs: Transaction[]) => {
    localStorage.setItem(
      "pendingTransactions",
      JSON.stringify(txs.map((tx) => ({ data: tx })))
    );
  };

  const refreshTransactions = useCallback(() => {
    try {
      const storedTransactions = JSON.parse(
        localStorage.getItem("pendingTransactions") || "[]"
      );

      // Extract transactions from stored format
      const extractedTransactions = storedTransactions.map((item: any) =>
        item.data ? item.data : item
      );

      setTransactions(extractedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    }
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      // Check if transaction already exists
      const exists = prev.some((tx) => tx.id === transaction.id);
      if (exists) return prev;

      // Add new transaction
      const updatedTransactions = [...prev, transaction];

      // Save to localStorage
      saveTransactionsToLocalStorage(updatedTransactions);

      // Join room for new transaction if it's pending
      if (transaction.status === "pending") {
        joinTransactionRooms([transaction.id]);
      }

      return updatedTransactions;
    });
  }, []);

  const updateTransaction = useCallback(
    (updatedTransaction: Partial<Transaction> & { id: string }) => {
      setTransactions((prev) => {
        const updatedTransactions = prev.map((tx) => {
          if (tx.id === updatedTransaction.id) {
            const updated = { ...tx, ...updatedTransaction };
            return updated;
          }
          return tx;
        });

        // Save to localStorage
        saveTransactionsToLocalStorage(updatedTransactions);

        return updatedTransactions;
      });
    },
    []
  );

  const getTransactionById = useCallback(
    (id: string) => {
      return transactions.find((tx) => tx.id === id);
    },
    [transactions]
  );

  const contextValue = {
    transactions,
    addTransaction,
    updateTransaction,
    getTransactionById,
    refreshTransactions,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionProvider"
    );
  }
  return context;
};
