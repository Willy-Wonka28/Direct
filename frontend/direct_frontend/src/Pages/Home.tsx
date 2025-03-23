import { useEffect, useState } from "react";
import Form from "../UI/Form";
import { useWallet } from "@solana/wallet-adapter-react";
import { getWalletBalance } from "../Wallet/Balance";
import TransactionTable from "../UI/Table";

const Home = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const bal = await getWalletBalance(publicKey.toString());
        setBalance(bal || null);
      }
    };

    fetchBalance();
  }, [publicKey]);

  return (
    <div>
      <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg m-2 mt-5 p-5 rounded-2xl">
        <p className="drop-shadow-lg font-semibold text-white text-3xl tracking-wide">
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
        <div className="flex justify-center items-center">
          <Form />
        </div>
      </div>
      <div>
        <TransactionTable />
      </div>
    </div>
  );
};

export default Home;
