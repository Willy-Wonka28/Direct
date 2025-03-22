import { createContext, useEffect, useState } from "react";
import Navbar from "./UI/Navbar";
import "./App.css";
import Form from "./UI/Form";
import { useWallet } from "@solana/wallet-adapter-react";
import { getWalletBalance } from "./Wallet/Balance";
import TransactionTable from "./UI/Table";
import TransactionTracker from "./Wallet/Transactions/UpdateTransactions";

const TransactionContext = createContext<{
  transactions: any[];
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}>({ transactions: [], setTransactions: () => {} });
const App = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(null);
  let localTransactions = localStorage.getItem("transactions") || "[]";
  const [transactions, setTransactions] = useState(
    JSON.parse(localTransactions) || []
  );
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const bal = await getWalletBalance(publicKey);
        setBalance(bal);
      }
    };

    fetchBalance();
  }, [publicKey]);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      <div>
        <TransactionTracker />

        <Navbar />
        <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg m-2 mt-5 p-5 rounded-2xl">
          <p className="drop-shadow-lg font-semibold text-white text-3xl tracking-wide">
            {publicKey ? (
              <>
                💰 Balance:
                <span className="font-bold text-yellow-300">
                  {balance !== null
                    ? balance.toFixed(4) + " SOL"
                    : "Loading..."}
                </span>
              </>
            ) : (
              "🔌 Connect your wallet"
            )}
          </p>
        </div>
        <div className="mt-3 p-3">
          <div className="flex justify-center items-center">
            <Form />
          </div>
        </div>
        <div>
          <TransactionTable />
        </div>
      </div>
    </TransactionContext.Provider>
  );
};

export default App;
