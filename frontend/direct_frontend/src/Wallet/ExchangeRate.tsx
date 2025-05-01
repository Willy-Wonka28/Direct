import { useState, useCallback } from "react";
import { SERVER_URL } from "../config";

const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(false);

  const getExchangeRate = useCallback(async (amount: number) => {
    setExchangeLoading(true);
    try {
      const response = await fetch(
        `${SERVER_URL}/util/exchange-rate?amount=${amount}&fromToken=SOL&toCurrency=NGN`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Error fetching exchange rate");
      }

      const convertedAmount = data.data.convertedAmount; // ✅ Extract the correct field
      setExchangeRate(convertedAmount);
      return convertedAmount;
    } catch (err) {
      console.error("Error getting exchange rate:", err);
      return null;
    } finally {
      setExchangeLoading(false);
    }
  }, []);

  return { exchangeRate, getExchangeRate, exchangeLoading };
};

export default useExchangeRate;
