import { SERVER_URL } from "../../../../config";
import { Transaction } from "./../transaction.type";
export async function getTransactionById(
  transactionId: string
): Promise<Transaction> {
  const response = await fetch(
    `${SERVER_URL}/api/transaction/${transactionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch transaction");
  }
  const transaction = (await response.json()).data;
  return transaction;
}

interface TransactionDataProp {
  publicKey: string;
  solAmount: number;
  acctNumber: string;
  bankName: string;
  name: string;
}

export const initializeTransaction = async ({
  publicKey,
  solAmount,
  acctNumber,
  bankName,
  name,
}: TransactionDataProp) => {
  const submittedData = {
    sender: "anonymous username",
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

    if (!response.ok) {
      throw new Error(
        `Failed to initialize transaction: ${response.statusText}`
      );
    }

    const data = await response.json();

    console.log(data);

    if (data.error === "Duplicate Transaction Error") {
      return {
        success: false,
        message: "A Duplicate Pending Transfer was Detected.",
      };
    }

    if (data.status === "error") {
      return { success: false, message: data.message };
    }

    if (data.status === "success") {
      return {
        success: true,
        message: "Transaction initialized successfully.",
        data,
      };
    }

    return { success: false, message: "Unexpected response from the server." };
  } catch (err) {
    console.error("Transaction initialization failed:", err);
    return {
      success: false,
      message: "Transaction initialization failed. Please try again later.",
    };
  }
};
