import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import { TransactionProvider } from "./context/TransactionContext";
import TransactionTracker from "./Wallet/Transactions/UpdateTransactions";
import { socket } from "./Websockets";

const App = () => {
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
    <TransactionProvider>
      <Layout>
        <TransactionTracker />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </TransactionProvider>
  );
};

export default App;
