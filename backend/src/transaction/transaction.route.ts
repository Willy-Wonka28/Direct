import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { LoggerService } from "../logger/logger.service";
import { LoggerPaths } from "../constants/logger-paths.enum";
import { Validator } from "../utils/middleware/validator.middleware";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { ConfirmedTransactionDto } from "./dto/confirmed-transaction.dto";
import { TransactionRepository } from "../repositories/transaction.repositories";
import { utilService } from "../models/util/util.router";
const transactionRouter = Router();
const logger = new LoggerService(LoggerPaths.TRANSACTIONS);
const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(
  logger,
  transactionRepository
);
const transactionController = new TransactionController(
  transactionService,
  utilService
);
const validator = new Validator();

transactionRouter.post(
  "/init",
  validator.single(CreateTransactionDto),
  transactionController.initializeTransaction
);
transactionRouter.get("/:id", transactionController.getTransaction);

transactionRouter.post(
  "/confirm",
  validator.single(ConfirmedTransactionDto),
  transactionController.confirmTransaction
);

export default transactionRouter;
