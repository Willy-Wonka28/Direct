import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Transaction, TransactionStatus } from "../transaction.type";
import {
  updateTransactionsInLocalStorage,
  getTransactionsFromLocalStorage,
} from "../utils";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  refreshTransactions: () => void;
  setTransactions: (transactions: Transaction[]) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load transactions from localStorage on initial mount only
  useEffect(() => {
    if (!isInitialized) {
      refreshTransactions();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      // Only save after initial load
      updateTransactionsInLocalStorage(transactions);
      console.log(`Saved ${transactions.length} transactions to localStorage`);
    }
  }, [transactions, isInitialized]);

  const refreshTransactions = useCallback(() => {
    try {
      const loadedTransactions = getTransactionsFromLocalStorage();
      console.log(
        `Loaded ${loadedTransactions.length} transactions from localStorage`
      );
      setTransactionsState(loadedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactionsState([]);
    }
  }, []);

  const setTransactions = useCallback((txs: Transaction[]) => {
    setTransactionsState(txs);
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactionsState((prev) => {
      // Check if transaction already exists
      const exists = prev.some((tx) => tx.id === transaction.id);
      if (exists) {
        // Update it if it exists but don't add a duplicate
        return prev.map((tx) =>
          tx.id === transaction.id ? { ...tx, ...transaction } : tx
        );
      }

      // Add new transaction
      const updatedTransactions = [...prev, transaction];
      return updatedTransactions;
    });
  }, []);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactionsState((prev) => {
      const updatedTransactions = prev.map((tx) => {
        if (tx.id === updatedTransaction.id) {
          return { ...tx, ...updatedTransaction };
        }
        return tx;
      });

      return updatedTransactions;
    });
  }, []);

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
    setTransactions,
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
