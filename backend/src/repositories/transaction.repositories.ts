import { Prisma, Transaction } from "@prisma/client";
import { databaseService } from "../utils/database";
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
    data: Omit<Prisma.TransactionCreateInput, "updatedAt" | "createdAt">
  ): Promise<Transaction> {
    return this.transactionDelegate.create({
      data,
    });
  }
}
