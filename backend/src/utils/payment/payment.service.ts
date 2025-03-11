import { IPaymentService } from "./payment.interface";

export class PaymentService implements IPaymentService {
  initiateTransfer(
    amount: number,
    recipient: string
  ): Promise<TransferResponse> {}
}
