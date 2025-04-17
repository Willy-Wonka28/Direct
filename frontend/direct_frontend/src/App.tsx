import "./App.css";
import React, { useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import { TransactionProvider } from "./context/TransactionContext";
import TransactionTracker from "./Wallet/Transactions/UpdateTransactions";
import { socket } from "./Websockets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";


const App = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);


  // Ensure socket connection is established when the app loads
  useEffect(() => {
    // Reconnect socket if disconnected
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Clean up socket connection when app unmounts
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
    <TransactionProvider>
      <Layout>
        <TransactionTracker />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </TransactionProvider>
    </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
