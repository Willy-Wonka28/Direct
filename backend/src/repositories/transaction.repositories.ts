import { Prisma, Transaction } from "@prisma/client";
import { databaseService } from "../utils/database";
import { ConfirmedTransactionDto } from "../transaction/dto/confirmed-transaction.dto";
export class TransactionRepository {
  private readonly transactionDelegate: Prisma.TransactionDelegate;
  constructor() {
    this.transactionDelegate = databaseService.transaction;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.transactionDelegate.findUnique({
      where: { id },
    });
  }

  async createTransaction(
    data: Omit<
      Prisma.TransactionCreateInput,
      "updatedAt" | "createdAt" | "id" | "status"
    >
  ): Promise<Transaction> {
    return this.transactionDelegate.create({
      data,
    });
  }
  async getPendingTransaction(
    payload: Omit<ConfirmedTransactionDto, "timestamp"> & { timestamp?: string }
  ): Promise<Transaction | null> {
    const transaction = await this.transactionDelegate.findFirst({
      where: {
        publicKey: payload.publicKey,
        senderAmount: payload.amountInToken,
        senderToken: payload.token,
        status: "PENDING",
      },
    });
    return transaction;
  }
}
