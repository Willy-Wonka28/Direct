import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import Wallet from "./Wallet/ConnectWallet.tsx"; // ✅ Import Wallet Provider

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Wallet>
        <App />
      </Wallet>
    </BrowserRouter>
  </StrictMode>
);
