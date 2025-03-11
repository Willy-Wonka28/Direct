import { Transaction } from "@prisma/client";
import { TransactionRepository } from "../repositories/transaction.repositories";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { LoggerService } from "../logger/logger.service";
import { InternalServerErrorException } from "../utils/exceptions/internal-server.exception";
import { NotFoundException } from "../utils/exceptions/not-found.exception";
import { ConfirmedTransactionDto } from "./dto/confirmed-transaction.dto";
import { UtilService } from "../models/util/util.service";

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
    payload: Omit<ConfirmedTransactionDto, "timestamp"> & { timestamp?: string }
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.getPendingTransaction(
      payload
    );
    if (!transaction) {
      throw new NotFoundException(
        "Transaction could not be found",
        `Transaction with publicKey ${payload.publicKey} not found`
      );
    }
    return transaction;
  }
}
