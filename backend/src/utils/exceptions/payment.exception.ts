import { BaseException } from "./base.exception";
export class PaymentException extends BaseException {
  constructor(message: string, cause?: string) {
    super(message, cause || "Recipient Payment Error");
    this.status = 402;
  }
}
