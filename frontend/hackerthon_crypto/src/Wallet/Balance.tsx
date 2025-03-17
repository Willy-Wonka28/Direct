import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const getWalletBalance = async (walletAddress: string) => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const publicKey = new PublicKey(walletAddress);

    const balance = await connection.getBalance(publicKey);

    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    return balance / 1_000_000_000;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};


