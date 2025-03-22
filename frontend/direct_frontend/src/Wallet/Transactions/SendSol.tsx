import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { savePendingTransaction } from "./SavePendingTransactions";
import initializeTransaction from "./InitializeTransaction";

const useSendSol = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = async ({
    solAmount,
    acctNumber,
    bankName,
    name,
  }: {
    solAmount: number;
    acctNumber: string;
    bankName: string;
    name: string;
  }) => {
    if (!publicKey) {
      return { success: false, message: "Wallet not connected." };
    }

    const response = await initializeTransaction({
      publicKey: publicKey.toBase58(),
      solAmount,
      acctNumber,
      bankName,
      name,
    });

    if (!response.success) {
      return response;
    }

    try {
      const receiver = new PublicKey(
        "5z4WLC6mr74hb6roPov1xBwnsYNaQsLcTy6YM6LWYpre"
      );
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiver,
          lamports: solAmount * 1e9,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log(`✅ Transaction Successful: ${signature}`);
      savePendingTransaction(response.data);

      return { success: true, message: `Transaction Successful: ${signature}` };
    } catch (error) {
      console.error("❌ Transaction Failed:", error);
      return { success: false, message: "Transaction Failed" };
    }
  };

  return { sendSol };
};

export default useSendSol;
