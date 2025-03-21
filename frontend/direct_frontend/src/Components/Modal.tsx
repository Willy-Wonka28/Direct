import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import CustomizedSnackbars from "../Components/Alert"; // Import Snackbar for notifications
import initializeTransaction from "../Wallet/Transactions/InitializeTransaction";

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
  refreshTransactions: () => void; // 🔥 Accept refresh function
}

export default function AlertDialog({
  open,
  handleClose,
  solValue,
  bankName,
  accountNumber,
  accountName,
  refreshTransactions, // 🔥 Accept refresh function
}: AlertDialogProps) {
  const { publicKey } = useWallet();
  const pbKey = publicKey ? publicKey.toBase58() : "";
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error" | "warning";
  } | null>(null);

  const handleTransactionComplete = async () => {
    if (!pbKey) {
      setNotification({
        message: "Wallet not connected. Please connect your wallet.",
        severity: "error",
      });
      return;
    }

    try {
      const data = await initializeTransaction({
        publicKey: pbKey,
        solAmount: solValue,
        acctNumber: accountNumber,
        bankName,
        name: accountName || "Unknown User",
      });

      console.log(data);

      if (!data.success) {
        setNotification({ message: data.message, severity: "error" });
      } else {
        setNotification({
          message: "Transaction initialized successfully!",
          severity: "success",
        });

        refreshTransactions(); // 🔥 Refresh transactions when confirmed!
      }

      handleClose();
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
