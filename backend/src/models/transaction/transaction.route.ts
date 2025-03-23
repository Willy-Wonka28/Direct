import { Router } from "express";
import { TransactionController } from "./transaction.controller";

import { Validator } from "../../utils/middleware/validator.middleware";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { transactionController } from "./transaction.controller";

const transactionRouter = Router();

const validator = new Validator();

transactionRouter.post(
  "/init",
  validator.single(CreateTransactionDto),
  transactionController.initializeTransaction
);
transactionRouter.get("/:id", transactionController.getTransaction);

export default transactionRouter;
