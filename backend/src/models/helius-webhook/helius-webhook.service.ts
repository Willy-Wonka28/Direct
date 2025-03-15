import { LoggerService } from "../../logger/logger.service";
import { HeliusWebhookData } from "../../types/helius-webhook.types";
import { Token } from "@prisma/client";
import { InvalidRequestBodyException } from "../../utils/exceptions/invalid-request-body.exception";
import { LoggerPaths } from "../../constants/logger-paths.enum";
export class HeliusWebhookService {
  constructor(private readonly logger: LoggerService) {}
  extractData(payload: HeliusWebhookData) {
    const status = !payload.transactionError;

    const timestamp = new Date(payload.timestamp * 1000).toLocaleString();

    // Check SOL Transfers
    if (payload.nativeTransfers.length > 0) {
      // * the maxTransfer will be the amount set
      const maxTransfer = payload.nativeTransfers.reduce((prev, current) => {
        return prev.amount > current.amount ? prev : current;
      });
      const {
        amount,
        fromUserAccount: senderPublicKey,
        toUserAccount,
      } = maxTransfer;

      const amountInToken = amount / 1_000_000_000;
      const token = "SOL"; // SOL is the native token of the Solana blockchain;

      this.logger.info(
        `Transaction processed for ${senderPublicKey} to ${toUserAccount} with amount ${amountInToken} SOL`
      );

      const extractedData = {
        status,
        timestamp,
        amountInToken,
        senderPublicKey,
        token: token as Token,
      };
      console.log(JSON.stringify(extractedData));
      return extractedData;
    } else {
      throw new InvalidRequestBodyException("No Native Transfers found");
    }
  }
}

const logger = new LoggerService(LoggerPaths.HELIUS_WEBHOOK_SERVICE);
export const heliusWebhookService = new HeliusWebhookService(logger);
