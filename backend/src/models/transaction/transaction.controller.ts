import { RequestHandler } from "express";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { transactionService, TransactionService } from "./transaction.service";
import webhookTransactionService from "../../utils/webhook";
import { ConfirmTransactionDto } from "./dto/confirm-transaction.dto";
import { WebhookEvent } from "../../utils/webhook/webhook.events";
import { UtilService } from "../util/util.service";
import { InvalidAccountException } from "../../utils/exceptions/invalid-account.exception";
import { DuplicateTransactionException } from "../../utils/exceptions/duplicate-transaction.exception";
import { utilService } from "../util/util.router";
import {
  paymentService,
  PaymentService,
} from "../../utils/payment/payment.service";
import { TransactionStatus } from "@prisma/client";
import { ResponseDto } from "../../dto/response.dto";
import { ResponseStatus } from "../../constants/response-status.enum";
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly utilService: UtilService,
    private readonly paymentService: PaymentService
  ) {}
  initializeTransaction: RequestHandler = async (req, res, next) => {
    const payload = req.body as CreateTransactionDto & {
      receiverAmount: number;
    };
    try {
      // * prevent duplicate transfers
      const pendingTransaction =
        await this.transactionService.checkPendingTransaction(
          payload.publicKey,
          payload.receiverAccountNo
        );

      if (pendingTransaction) {
        throw new DuplicateTransactionException(
          "A Duplicate Pending Transfer was Detected"
        );
      }

      // * validate receiver's account details
      const accountDetails = await this.utilService.verifyAccountNumber(
        payload.receiverBank,
        payload.receiverAccountNo
      );

      if (!accountDetails) {
        throw new InvalidAccountException(
          "Invalid Account Details",
          "Invalid account details provided"
        );
      }
      const convertedAmount = (
        await this.utilService.fetchExchangeRate(
          payload.senderAmount,
          payload.senderToken,
          payload.receiverCurrency
        )
      ).convertedAmount;
      // enforce receivers details
      payload.receiverName = accountDetails.account_name;
      payload.receiverAmount = convertedAmount;

      const transaction = await this.transactionService.createTransaction(
        payload
      );

      const resObj = new ResponseDto(
        "Transaction initialized successfully",
        ResponseStatus.SUCCESS,
        transaction
      );
      res.status(201).json(resObj);
    } catch (error) {
      next(error);
    }
  };
  getTransaction: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
      const transaction = await this.transactionService.getTransactionById(id);
      const resObj = new ResponseDto(
        "Transaction fetched successfully",
        ResponseStatus.SUCCESS,
        transaction
      );
      res.status(200).json(resObj);
    } catch (error) {
      next(error);
    }
  };

  confirmTransaction: RequestHandler = async (req, res, next) => {
    const payload = req.body as ConfirmTransactionDto;
    try {
      const transaction = await this.transactionService.getPendingTransaction(
        payload
      );
      if (!payload.status) {
        await this.transactionService.updateTransactionStatus(
          transaction.id,
          TransactionStatus.FAILED
        );
        webhookTransactionService
          .to(transaction.id)
          .emit(WebhookEvent.TRANSACTION_FAILED, payload);
        res.status(400).json({ message: "Transaction not confirmed." });
        return;
      }
      // -------------------------------
      // // * create transfer recipient
      // const receiverBankCode = this.utilService.getBankCode(
      //   transaction.receiverBank
      // );
      // const recipientCode = await this.paymentService.createTransferRecipient(
      //   transaction.receiverName,
      //   transaction.receiverAccountNo,
      //   receiverBankCode
      // );

      // // * initiate transfer
      // const transferResponse = await this.paymentService.initiateTransfer(
      //   transaction.receiverAmount * 1000, //converted to Kobo
      //   recipientCode,
      //   "Payment for received currency"
      // );
      // -------------------------------
      // todo: create interval to verify payment
      // * update transaction status to "successful"
      await this.transactionService.updateTransactionStatus(
        transaction.id,
        TransactionStatus.SUCCESS
      );
      webhookTransactionService
        .to(transaction.id)
        .emit(WebhookEvent.TRANSACTION_SUCCESSFUL, payload);
      res.status(200).json({ message: "Transaction confirmed successfully." });
    } catch (error) {
      next(error);
    }
  };
}

export const transactionController = new TransactionController(
  transactionService,
  utilService,
  paymentService
);
