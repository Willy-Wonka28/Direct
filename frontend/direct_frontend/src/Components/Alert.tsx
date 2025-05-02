import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

interface SnackbarProps {
  severity: "success" | "error" | "warning" | "info";
  content: string;
}

const CustomizedSnackbars = ({ severity, content }: SnackbarProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {content}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbars;
