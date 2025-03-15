import { heliusWebhookController } from "./helius-webhook.controller";
import { transactionController } from "../transaction/transaction.controller";
import { NextFunction, Request, Response, Router } from "express";
import { Validator } from "../../utils/middleware/validator.middleware";
import { configService } from "../../utils/config/config.service";
import { ENV } from "../../constants/env.enum";
import { ConfirmTransactionDto } from "../transaction/dto/confirm-transaction.dto";
import { BaseException } from "../../utils/exceptions/base.exception";
import { heliusWebhookErrorHandler } from "./helius-webhook.errorHandler";

const heliusWebhookRouter = Router();
const validator = new Validator();
heliusWebhookRouter.post(
  "/transaction-made",
  heliusWebhookController.transactionMade,
  validator.single(ConfirmTransactionDto),
  transactionController.confirmTransaction
);

// custom error handler for webhooks(must return 200 even through error occurred)
heliusWebhookRouter.use(heliusWebhookErrorHandler);

const heliusWebhookUrl =
  configService.get(ENV.SERVER_URL) + "/helius-webhook/transaction-made";
console.log(heliusWebhookUrl);

export default heliusWebhookRouter;
