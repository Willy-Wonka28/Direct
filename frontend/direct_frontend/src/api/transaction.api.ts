import { SERVER_URL } from "../../../../config";
import { Transaction } from "./../transaction.type";

// Type for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

/**
 * Fetches a transaction by ID from the server
 */
export async function getTransactionById(
  transactionId: string
): Promise<ApiResponse<Transaction>> {
  try {
    const response = await fetch(
      `${SERVER_URL}/api/transaction/${transactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message || `Error: ${response.statusText}`,
        error: responseData.error || response.status,
      };
    }

    return {
      success: true,
      message: responseData.message || "Transaction retrieved successfully",
      data: responseData.data,
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return {
      success: false,
      message: "Failed to connect to server",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

interface TransactionDataProp {
  publicKey: string;
  solAmount: number;
  acctNumber: string;
  bankName: string;
  name: string;
}

/**
 * Initializes a new transaction with the server
 * Returns the transaction data if successful, or throws an error with appropriate message
 */
export const initializeTransaction = async ({
  publicKey,
  solAmount,
  acctNumber,
  bankName,
  name,
}: TransactionDataProp): Promise<ApiResponse<Transaction>> => {
  const submittedData = {
    sender: "anonymous user",
    publicKey,
    senderToken: "SOL",
    senderAmount: solAmount,
    receiverCurrency: "NGN",
    receiverAccountNo: acctNumber,
    receiverBank: bankName,
    receiverName: name,
  };

  try {
    const response = await fetch(
      "https://direct-production.up.railway.app/transaction/init",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submittedData),
      }
    );

    const data = await response.json();
    console.log("Server response:", data);

    // Handle different response scenarios
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to initialize transaction",
        error: data.error || response.statusText,
      };
    }

    if (data.error === "Duplicate Transaction Error") {
      return {
        success: false,
        message: "A duplicate pending transfer was detected",
        error: "DUPLICATE_TRANSACTION",
      };
    }

    if (data.status === "error") {
      return {
        success: false,
        message: data.message || "An error occurred",
        error: data.error || "UNKNOWN_ERROR",
      };
    }

    // Success case
    return {
      success: true,
      message: "Transaction initialized successfully",
      data: data.data || data, // Handle different response formats
    };
  } catch (error) {
    console.error("Transaction initialization failed:", error);
    return {
      success: false,
      message:
        "Could not connect to server. Please check your internet connection.",
      error: error instanceof Error ? error.message : "NETWORK_ERROR",
    };
  }
};
