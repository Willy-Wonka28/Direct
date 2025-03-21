import { useEffect, useState } from "react";
import Navbar from "./UI/Navbar";
import "./App.css";
import Form from "./UI/Form";
import { useWallet } from "@solana/wallet-adapter-react";
import { getWalletBalance } from "./Wallet/Balance";
import TransactionTable from "./UI/Table";

const App = () => {
  localStorage.clear()
  const { publicKey } = useWallet();
  const key = publicKey ? publicKey.toBase58() : null;
  const [balance, setBalance] = useState(null);

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
    <div>
      <Navbar />
      <div className="mt-5 p-5 flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
        <p className="text-white text-3xl font-semibold tracking-wide drop-shadow-lg">
          {publicKey ? (
            <>
              💰 Balance:
              <span className="font-bold text-yellow-300">
                {balance !== null ? balance.toFixed(4) + " SOL" : "Loading..."}
              </span>
            </>
          ) : (
            "🔌 Connect your wallet"
          )}
        </p>
      </div>
      <div className="mt-3 p-3">
        <div className="flex items-center justify-center">
          <Form />
        </div>
      </div>
      <div>
        <TransactionTable />
      </div>
    </div>
  );
};

export default App;
