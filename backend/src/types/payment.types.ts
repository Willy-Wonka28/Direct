interface TransferResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    recipient: string;
    status: string;
    [key: string]: any;
  };
}

interface TransferStatusResponse {
  transfer_code: string;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  // Add additional properties as needed from the Paystack response
}
