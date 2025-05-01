import { useEffect, useState } from "react";
import Form from "../UI/Form";
import { useWallet } from "@solana/wallet-adapter-react";
import { getWalletBalance } from "../Wallet/Balance";
import useExchangeRate from "../Wallet/ExchangeRate";

const Home = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [ngnValue, setNgnValue] = useState<number | null>(null);
  const { getExchangeRate, exchangeLoading } = useExchangeRate();

  useEffect(() => {
    const fetchBalanceAndRate = async () => {
      if (!publicKey) return;

      try {
        const solBalance = await getWalletBalance(publicKey.toString());
        if (solBalance !== null) {
          setBalance(solBalance);

          const nairaRate = await getExchangeRate(solBalance);
          if (typeof nairaRate === "number") {
            setNgnValue(solBalance * nairaRate);
          }
        }
      } catch (error) {
        console.error("Error fetching balance or rate:", error);
      }
    };

    fetchBalanceAndRate();
  }, [publicKey, getExchangeRate]);

  return (
    <div className="font-sans p-4 border rounded-lg border-[#10A0C9]">
      <div className="flex flex-col justify-center items-center text-green-600 bg-white rounded-2xl">
        {publicKey ? (
          <>
            <div className="mt-2 text-black text-3xl font-medium">
              {exchangeLoading ? (
                "Fetching rate..."
              ) : ngnValue !== null ? (
                <>₦{ngnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>
              ) : (
                "Fetching..."
              )}
            </div>
            <p className="text-lg font-semibold">
              {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
          </>
        ) : (
          <>
            <p className="text-3xl font-semibold text-black">**.**</p>
            <p className="text-red-500 mt-2 font-medium text-base">
              ⚠️ Please connect your wallet to view your balance
            </p>
          </>
        )}
      </div>

      <div className="mt-3 p-3 flex justify-center items-center">
        <Form />
      </div>
    </div>
  );
};

export default Home;
