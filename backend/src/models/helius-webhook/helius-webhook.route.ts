import { heliusWebhookController } from "./helius-webhook.controller";
import { transactionController } from "../transaction/transaction.controller";
import { CreateTransactionDto } from "../transaction/dto/create-transaction.dto";
import { Router } from "express";
import { Validator } from "../../utils/middleware/validator.middleware";
import { configService } from "../../utils/config/config.service";
import { ENV } from "../../constants/env.enum";

const heliusWebhookRouter = Router();
const validator = new Validator();
heliusWebhookRouter.post(
  "/transaction-made",
  heliusWebhookController.transactionMade,
  validator.single(CreateTransactionDto),
  transactionController.confirmTransaction
);

const heliusWebhookUrl =
  configService.get(ENV.SERVER_URL) + "/helius-webhook/transaction-made";
console.log(heliusWebhookUrl);

export default heliusWebhookRouter;
