import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const getWalletBalance = async (
  publicKeyString: string
): Promise<number> => {
  try {
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    return 0;
  }
};
