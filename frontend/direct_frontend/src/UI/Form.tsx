import { useState, useEffect } from "react";
import useBanks from "../Banks/getBanks";
import Loader from "../Components/Loader";
import useVerifyAccount from "../Banks/verifyAccount";
import AlertDialog from "../Components/Modal";
import useExchangeRate from "../Wallet/ExchangeRate";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomizedSnackbars from "../Components/Alert";
import { useTransactions } from "../context/TransactionContext";

type BankData = {
  accountData: string;
  bankName: string | null;
  solValue: number | null;
};

const Form = () => {
  const { connected } = useWallet();
  const { transactions } = useTransactions();

  const [bankData, setBankData] = useState<BankData>({
    accountData: "",
    bankName: null,
    solValue: null,
  });

  const [nairaValue, setNairaValue] = useState<number | null>(null);
  const { getExchangeRate, exchangeLoading } = useExchangeRate();

  useEffect(() => {
    const fetchRate = async () => {
      if (!bankData.solValue) return;

      try {
        const rate = await getExchangeRate(bankData.solValue);
        console.log("Exchange Rate:", rate);
        setNairaValue((prevRate) => (prevRate !== rate ? rate : prevRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchRate();
  }, [bankData.solValue, getExchangeRate]);

  const [confirmed, setConfirmed] = useState(false);
  const [verificationAttempted, setVerificationAttempted] =
    useState<string>("");

  const { banks, isLoading: banksLoading, error: banksError } = useBanks();
  const { accountName, accountError, accountLoading, verifyAccount } =
    useVerifyAccount();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (bankData.accountData.length === 10 && bankData.bankName) {
        const verificationKey = `${bankData.bankName}-${bankData.accountData}`;
        if (verificationKey !== verificationAttempted) {
          verifyAccount(bankData.bankName, bankData.accountData);
          setVerificationAttempted(verificationKey);
        }
      }
    }, 500); // Debounce API call to avoid excessive calls

    return () => clearTimeout(delayDebounce);
  }, [
    bankData.accountData,
    bankData.bankName,
    verifyAccount,
    verificationAttempted,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setBankData((prevData) => {
      if (prevData[name as keyof BankData] === value) return prevData;

      if (
        name === "accountData" &&
        (!/^[0-9]{0,10}$/.test(value) || value.length > 10)
      ) {
        return prevData;
      }

      return {
        ...prevData,
        [name]: name === "solValue" ? (value ? parseFloat(value) : 0) : value,
      };
    });
  };

  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    severity: "error" | "warning" | "info" | "success";
    content: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bankData.accountData.length !== 10) {
      setAlertInfo({
        show: true,
        severity: "warning",
        content: "Account Number must be exactly 10 digits",
      });
      return;
    } else if (!connected) {
      setAlertInfo({
        show: true,
        severity: "warning",
        content: "Please Connect before any transaction",
      });
      return;
    }

    setConfirmed(true);
  };

  // check the server and correct this

  // if (banksError) {
  //   return <div>Error occurred while fetching banks.</div>;
  // }

  if (banksLoading) {
    return <Loader />;
  }

  return (
    <div>
      {alertInfo && alertInfo.show && (
        <CustomizedSnackbars
          severity={alertInfo.severity}
          content={alertInfo.content}
        />
      )}
      <div className="form-container p-2">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sol_value">Amount of Sol</label>
            <input
              type="number"
              id="sol_value"
              name="solValue"
              value={bankData.solValue}
              onChange={handleChange}
              required
            />
          </div>

          {exchangeLoading ? (
            <p>Loading...</p>
          ) : (
            nairaValue !== 0 &&
            nairaValue !== null && <p>Naira Value: {nairaValue}</p>
          )}

          <div className="form-group">
            <label htmlFor="bank">Bank</label>
            <select
              onChange={handleChange}
              id="bank"
              name="bankName"
              value={bankData.bankName || ""}
              required
              className="custom-select"
            >
              <option value="" disabled>
                Select your bank
              </option>
              {banks.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accountData">Account Number</label>
            <input
              type="text"
              id="accountData"
              name="accountData"
              value={bankData.accountData}
              onChange={handleChange}
              required
              pattern="\d{10}"
              maxLength={10}
            />
          </div>

          <p>
            {accountLoading
              ? "Verifying account..."
              : accountError
              ? "Invalid account details. Please check."
              : accountName || "Enter a 10-digit account number"}
          </p>

          <button className="form-submit-btn" type="submit">
            Confirm
          </button>
        </form>
      </div>

      <AlertDialog
        open={confirmed}
        handleClose={() => setConfirmed(false)}
        solValue={bankData.solValue}
        bankName={bankData.bankName || "Unknown Bank"}
        accountNumber={bankData.accountData}
        accountName={accountName}
      />
    </div>
  );
};

export default Form;
