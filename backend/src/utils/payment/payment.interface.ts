export interface IPaymentService {
  initiateTransfer(
    amount: number,
    recipient: string
  ): Promise<TransferResponse>;
}
