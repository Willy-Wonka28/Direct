import { RequestHandler } from "express-serve-static-core";
import { HeliusWebhookData } from "../../types/helius-webhook.types";
import { HeliusWebhookService } from "./helius-webhook.service";
import { InvalidRequestBodyException } from "../../utils/exceptions/invalid-request-body.exception";
import { heliusWebhookService } from "./helius-webhook.service";
export class HeliusWebhookController {
  constructor(private readonly heliusWebhookService: HeliusWebhookService) {}

  transactionMade: RequestHandler = async (req, res, next) => {
    const payload = req.body as HeliusWebhookData[];
    console.log("helius payload", payload);
    try {
      if (!payload || payload.length === 0)
        throw new InvalidRequestBodyException("No payload provided");

      const extractedData = this.heliusWebhookService.extractData(payload[0]);

      req.body = extractedData;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export const heliusWebhookController = new HeliusWebhookController(
  heliusWebhookService
);
