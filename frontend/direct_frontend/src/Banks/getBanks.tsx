import { useState, useEffect } from "react";
import { SERVER_URL } from "../config";

interface BankResponse {
  message: string;
  status: string;
  data: string[];
}

const useBanks = () => {
  const [banks, setBanks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanks = async () => {
      setIsLoading(true);
      const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch(
          `${SERVER_URL}/util/banks`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Failed to fetch banks");
        }

        const data: BankResponse = await response.json();

        if (data.status === "success") {
          setBanks(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch banks");
        }
      } catch (err: any) {
        if (err) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanks();
  }, []);

  return { banks, isLoading, error };
};

export default useBanks;
