import { LoggerService } from "../../logger/logger.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import paymentApi from "./payment.api";
import { InvalidAccountException } from "../exceptions/invalid-account.exception";
import { PaymentException } from "../exceptions/payment.exception";
export class PaymentService {
  constructor(private readonly logger: LoggerService) {}
  async createTransferRecipient(
    receiverName: string,
    accountNumber: string,
    bankCode: string
  ): Promise<string> {
    try {
      const response = await paymentApi.post("/transferrecipient", {
        type: "nuban",
        name: receiverName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      });
      this.logger.debug(
        `Transfer recipient created successfully for ${receiverName} with account number ${accountNumber}`,
        response.data
      );
      return response.data.data.recipient_code;
    } catch (error: any) {
      this.logger.error(
        "Error creating transfer recipient:",
        error.response?.data
      );
      throw new InvalidAccountException(
        "Invalid Account Details",
        error.response?.data?.message || error.message
      );
    }
  }

  async initiateTransfer(
    amount: number,
    recipientCode: string,
    reason: string
  ): Promise<TransferResponse> {
    try {
      const response = await paymentApi.post("/transfer", {
        source: "balance",
        amount, // Amount in kobo
        recipient: recipientCode,
        reason,
      });
      this.logger.debug(
        `Transfer initiated successfully for recipient ${recipientCode} with amount ${amount}`,
        response.data
      );
      return response.data.data; // Contains transfer details
    } catch (error: any) {
      this.logger.error(
        "Error initiating transfer:",
        error.response?.data || error.message
      );
      throw new PaymentException(error.response?.data || error.message);
    }
  }

  async verifyTransfer(transferCode: string): Promise<TransferStatusResponse> {
    try {
      const response = await paymentApi.get<{ data: TransferStatusResponse }>(
        `/transfer/${transferCode}`
      );
      this.logger.debug(
        `Transfer verified successfully for ${transferCode}`,
        response.data
      );
      return response.data.data;
    } catch (error: any) {
      this.logger.error(
        "Error verifying transfer:",
        error.response?.data || error.message
      );
      throw new Error("Transfer verification failed.");
    }
  }
}

const logger = new LoggerService(LoggerPaths.PAYMENTS);

export const paymentService = new PaymentService(logger);
