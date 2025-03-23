import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import { TransactionProvider } from "./context/TransactionContext";
import TransactionTracker from "./Wallet/Transactions/UpdateTransactions";

const App = () => {
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
