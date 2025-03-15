import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
const mnemonic =
  "You sneaky little devil, you are trying to steal my secret key?, try harder ";
const seed = mnemonicToSeedSync(mnemonic).toString("hex");
const derivedSeed = derivePath(
  "m/44'/501'/0'/0'",
  Buffer.from(seed, "hex")
).key;
const keypair = Keypair.fromSeed(derivedSeed);

const privateKeyArray = Uint8Array.from(keypair.secretKey);

const privateKeyBase58 = bs58.encode(privateKeyArray);

console.log("Public Key:", keypair.publicKey.toBase58());

console.log("Private Key:", privateKeyBase58);
