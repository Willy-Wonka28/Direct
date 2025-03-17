import { useState, useEffect } from "react";
import useBanks from "../Banks/getBanks";
import Loader from "../Components/Loader";
import useVerifyAccount from "../Banks/verifyAccount";

const Form = () => {
  const [bankData, setBankData] = useState({
    accountData: "",
    bankName: "",
    solValue: "",
  });

  const { banks, isLoading: banksLoading, error: banksError } = useBanks();
  const { accountName, accountError, accountLoading, verifyAccount } = useVerifyAccount();

  useEffect(() => {
    if (bankData.accountData.length === 10 && bankData.bankName) {
      verifyAccount(bankData.bankName, bankData.accountData); // ✅ Uses correct format
    }
  }, [bankData.accountData, bankData.bankName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setBankData((prevData) => {
      if (prevData[name] === value) return prevData;

      if (name === "accountData" && (!/^\d{0,10}$/.test(value) || value.length > 10)) {
        return prevData;
      }

      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bankData.accountData.length !== 10) {
      alert("Account number must be exactly 10 digits.");
      return;
    }

    console.log("Form submitted successfully with data:", bankData);
  };

  if (banksError) {
    return <div>Error occurred while fetching banks.</div>;
  }

  if (banksLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="form-container">
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

          <div className="form-group">
            <label htmlFor="bank">Bank</label>
            <select
              onChange={handleChange}
              id="bank"
              name="bankName"
              value={bankData.bankName}
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
              : accountName || accountError || "Enter a valid account number"}
          </p>

          <button className="form-submit-btn" type="submit">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
