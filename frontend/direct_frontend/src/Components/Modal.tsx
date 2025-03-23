import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import CustomizedSnackbars from "../Components/Alert";
import useSendSol from "../Wallet/Transactions/SendSol";
import { useTransactions } from "../context/TransactionContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#5a5df0" },
    background: { default: "#0b0f19", paper: "#1a1d2f" },
    text: { primary: "#ffffff", secondary: "#a1a1a1" },
  },
});

interface AlertDialogProps {
  open: boolean;
  handleClose: () => void;
  solValue: number;
  bankName: string;
  accountNumber: string;
  accountName: string | null;
  refreshTransactions?: () => void; // Made optional as we'll use the context
}

export default function AlertDialog({
  open,
  handleClose,
  solValue,
  bankName,
  accountNumber,
  accountName,
}: AlertDialogProps) {
  const { publicKey } = useWallet();
  const pbKey = publicKey ? publicKey.toBase58() : "";
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error" | "warning";
  } | null>(null);

  const { sendSol } = useSendSol();
  const { refreshTransactions } = useTransactions();

  const handleTransactionComplete = async () => {
    setNotification(null);
    if (!pbKey) {
      setNotification({
        message: "Wallet not connected. Please connect your wallet.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await sendSol({
        solAmount: solValue,
        acctNumber: accountNumber,
        bankName,
        name: accountName || "Unknown User",
      });

      // Transaction is now handled by the context
      // The useSendSol hook already adds the transaction to the context

      if (response.success) {
        refreshTransactions();
        handleClose();
      }

      setNotification({
        message: response.message,
        severity: response.success ? "success" : "error",
      });

      if (!response.success) {
        handleClose();
      }
    } catch (error) {
      console.error("Transaction Failed:", error);
      setNotification({
        message: "Transaction failed. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to send <strong>{solValue} SOL</strong> to{" "}
            <strong>{accountName || "Unknown User"}</strong>.<br />
            Bank: {bankName} <br />
            Account Number: {accountNumber}
            <br />
            Would you like to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#f44336" }}>
            Cancel
          </Button>
          <Button sx={{ color: "#4caf50" }} onClick={handleTransactionComplete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {notification && (
        <CustomizedSnackbars
          severity={notification.severity}
          content={notification.message}
        />
      )}
    </ThemeProvider>
  );
}
