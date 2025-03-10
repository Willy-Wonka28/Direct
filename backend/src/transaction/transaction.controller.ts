import { RequestHandler } from "express";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionService } from "./transaction.service";
import webhookTransactionService from "../utils/webhook";
import { ConfirmedTransactionDto } from "./dto/confirmed-transaction.dto";
import { WebhookEvent } from "../utils/webhook/webhook.events";
import { UtilService } from "../models/util/util.service";
import { InvalidAccountException } from "../utils/exceptions/invalid-account.exception";
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly utilService: UtilService
  ) {}
  initializeTransaction: RequestHandler = async (req, res, next) => {
    const payload = req.body as CreateTransactionDto;
    try {
      // * validate receivers account details
      const backDetails = this.utilService.verifyBank(
        payload.receiverBank,
        payload.receiverAccountNo
      );
      if (!backDetails) {
        throw new InvalidAccountException(
          "Invalid Account Details",
          "Invalid account details provided"
        );
      }
      const transaction = await this.transactionService.createTransaction(
        payload
      );

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  };
  getTransaction: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
      const transaction = await this.transactionService.getTransactionById(id);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  };

  confirmTransaction: RequestHandler = async (req, res, next) => {
    const payload = req.body as ConfirmedTransactionDto;
    try {
      const transaction = await this.transactionService.getPendingTransaction(
        payload
      );
      if (!payload.status) {
        webhookTransactionService
          .to(transaction.id)
          .emit(WebhookEvent.TRANSACTION_FAILED, payload);
        res.status(400).json({ message: "Transaction not confirmed." });
      }
      // -------------------------------
      // todo : make payment to the receiver
      // todo : update transaction status to "successful"
      // --------------------------------
      webhookTransactionService
        .to(transaction.id)
        .emit(WebhookEvent.TRANSACTION_SUCCESSFUL, payload);
      res.status(200).json({ message: "Transaction confirmed successfully." });
    } catch (error) {
      next(error);
    }
  };
}
