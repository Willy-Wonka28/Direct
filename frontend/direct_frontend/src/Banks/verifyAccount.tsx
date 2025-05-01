import { useState } from "react";
import { SERVER_URL } from "../config";

interface AccountResponse {
  message: string;
  status: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id?: number;
  };
}

const useVerifyAccount = () => {
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountLoading, setAccountLoading] = useState<boolean>(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const verifyAccount = async (bank: string, accountNumber: string) => {
    if (!bank || accountNumber.length !== 10) {
      setAccountError("Invalid bank or account number.");
      return;
    }

    setAccountLoading(true);
    setAccountError(null);

    try {
      // ✅ Send parameters in the URL instead of the body
      const response = await fetch(
        `${SERVER_URL}/util/verify-account?bank=${encodeURIComponent(bank)}&accountNumber=${accountNumber}`,
        {
          method: "GET", // ✅ Now using GET as required by API
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify account");
      }

      const data: AccountResponse = await response.json();

      if (data.status === "success" && data.data.account_name) {
        setAccountName(data.data.account_name);
      } else {
        throw new Error(data.message || "Account verification failed");
      }
    } catch (err: any) {
      setAccountError(err.message || "An unexpected error occurred");
      setAccountName(null);
    } finally {
      setAccountLoading(false);
    }
  };

  return { accountName, accountError, accountLoading, verifyAccount };
};

export default useVerifyAccount;
