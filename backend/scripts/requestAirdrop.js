import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Connect to Devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Your wallet address
const walletAddress = new PublicKey(
  "5z4WLC6mr74hb6roPov1xBwnsYNaQsLcTy6YM6LWYpre"
);

async function requestAirdrop() {
  console.log("Requesting airdrop...");

  const airdropSignature = await connection.requestAirdrop(
    walletAddress,
    2 * LAMPORTS_PER_SOL // Request 2 SOL
  );

  await connection.confirmTransaction(airdropSignature);
  console.log("Airdrop successful! Transaction ID:", airdropSignature);
}

requestAirdrop();
