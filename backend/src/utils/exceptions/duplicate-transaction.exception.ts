import { BaseException } from "./base.exception";
export class DuplicateTransactionException extends BaseException {
  constructor(message: string, cause?: string) {
    super(message, cause || "Duplicate Transaction Error");
    this.status = 409;
  }
}
