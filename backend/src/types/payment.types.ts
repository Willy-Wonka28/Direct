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
