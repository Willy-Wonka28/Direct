import { Transaction, TransactionStatus } from "@prisma/client";
import {
  transactionRepository,
  TransactionRepository,
} from "../repositories/transaction.repositories";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { LoggerService } from "../../logger/logger.service";
import { InternalServerErrorException } from "../../utils/exceptions/internal-server.exception";
import { NotFoundException } from "../../utils/exceptions/not-found.exception";
import { ConfirmTransactionDto } from "./dto/confirm-transaction.dto";
import { LoggerPaths } from "../../constants/logger-paths.enum";

export class TransactionService {
  constructor(
    private readonly logger: LoggerService,
    private readonly transactionRepository: TransactionRepository
  ) {}
  async createTransaction(
    createTransactionDto: CreateTransactionDto & { receiverAmount: number }
  ): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.createTransaction({
        ...createTransactionDto,
      });
      return transaction;
    } catch (error: any) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(
        "Failed to Initialize Transaction",
        error.message
      );
    }
  }
  async getTransactionById(id: string): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException(
        "Transaction could not be found",
        `Transaction with id ${id} not found`
      );
    }
    return transaction;
  }
  async getPendingTransaction(
    payload: Omit<ConfirmTransactionDto, "timestamp"> & { timestamp?: string }
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.getPendingTransaction(
      payload
    );
    if (!transaction) {
      throw new NotFoundException(
        "Transaction could not be found",
        `Transaction with publicKey ${payload.senderPublicKey} not found`
      );
    }
    return transaction;
  }
  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.getTransactionById(
      transactionId
    );
    if (!transaction) {
      throw new NotFoundException(
        "Transaction could not be found",
        `Transaction with id ${transactionId} not found`
      );
    }

    this.logger.debug(
      `Updating transaction ${transactionId} status to ${status}`
    );
    return this.transactionRepository.updateTransaction(
      { id: transactionId },
      { status }
    );
  }

  async verifyTransactionExistence(transactionId: string): Promise<boolean> {
    // TODO : first check cache (redis store)
    const transaction = await this.transactionRepository.getTransactionById(
      transactionId
    );
    return transaction !== null;
  }
  async checkPendingTransaction(
    publicKey: string,
    accountNumber: string
  ): Promise<boolean> {
    const transaction =
      await this.transactionRepository.getPendingTransactionByAccountNo(
        publicKey,
        accountNumber
      );
    return transaction !== null;
  }
}

const logger = new LoggerService(LoggerPaths.TRANSACTIONS);
export const transactionService = new TransactionService(
  logger,
  transactionRepository
);
