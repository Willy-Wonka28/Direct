import { useEffect } from "react";
import { listenForTransactionUpdates } from "../../Websockets/listenUpdates";

const updateTransactionStatus = (data: any) => {
  
    let transactions = JSON.parse(localStorage.getItem("pendingTransactions") || "[]");
    const index = transactions.findIndex((tx: any) => tx.id === data.id);
  
    if (index !== -1) {
      transactions[index] = { ...transactions[index], status: data.status };
      localStorage.setItem("pendingTransactions", JSON.stringify(transactions));
    }
  };
  
  useEffect(() => {
    listenForTransactionUpdates(updateTransactionStatus);
  }, []);
  