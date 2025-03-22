export type Transaction = {
  id: string;
  sender: string;
  publicKey: string;
  senderToken: string;
  senderAmount: number;
  receiverAmount: number;
  receiverCurrency: string;
  receiverAccountNo: string;
  receiverBank: string;
  receiverName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
