import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { ApiResponse, initializeTransaction } from "../../api/transaction.api";
import { joinTransactionRoom } from "../../Websockets/joinTransactionRoom";
import { useTransactions } from "../../context/TransactionContext";
import { Transaction as AppTransaction } from "../../transaction.type";

interface SendSolParams {
  solAmount: number;
  acctNumber: string;
  bankName: string;
  name: string;
}

interface SendSolResult {
  success: boolean;
  message: string;
  transaction?: AppTransaction;
}

const useSendSol = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { addTransaction } = useTransactions();

  const sendSol = async ({
    solAmount,
    acctNumber,
    bankName,
    name,
  }: SendSolParams): Promise<SendSolResult> => {
    if (!publicKey) {
      return { success: false, message: "Wallet not connected" };
    }

    try {
      // Step 1: Initialize transaction with the server
      const initResponse = await initializeTransaction({
        publicKey: publicKey.toBase58(),
        solAmount,
        acctNumber,
        bankName,
        name,
      });

      // Handle server-side initialization errors
      if (!initResponse.success || !initResponse.data) {
        return {
          success: false,
          message: initResponse.message,
        };
      }

      const serverTransaction = initResponse.data;

      // Step 2: Join transaction room to listen for updates
      joinTransactionRoom(serverTransaction.id);

      // Step 3: Execute blockchain transaction
      try {
        const receiver = new PublicKey(
          "5z4WLC6mr74hb6roPov1xBwnsYNaQsLcTy6YM6LWYpre"
        );

        const blockchainTx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: receiver,
            lamports: solAmount * 1e9,
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        blockchainTx.recentBlockhash = blockhash;
        blockchainTx.feePayer = publicKey;

        const signature = await sendTransaction(blockchainTx, connection);
        const confirmation = await connection.confirmTransaction(
          signature,
          "confirmed"
        );

        if (confirmation.value.err) {
          throw new Error(
            `Transaction confirmed with error: ${confirmation.value.err}`
          );
        }

        console.log(`✅ Transaction Successful: ${signature}`);

        // Step 4: Add transaction to context
        addTransaction(serverTransaction);

        return {
          success: true,
          message: "Transaction completed successfully",
          transaction: serverTransaction,
        };
      } catch (error) {
        console.error("❌ Blockchain Transaction Failed:", error);
        return {
          success: false,
          message: `Transaction failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          transaction: serverTransaction, // Still return the transaction for tracking
        };
      }
    } catch (error) {
      console.error("❌ Send SOL operation failed:", error);
      return {
        success: false,
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  };

  return { sendSol };
};

export default useSendSol;
