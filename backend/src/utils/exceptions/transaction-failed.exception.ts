import { HttpStatus } from "../../constants/http-status";
import { BaseException } from "./base.exception";
export class TransactionFailedException extends BaseException {
  constructor(message: string, cause?: string) {
    super(message, cause || "Transaction Failed");
    this.status = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
