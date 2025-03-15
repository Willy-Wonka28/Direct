import { Prisma, Transaction } from "@prisma/client";
import { databaseService } from "../../utils/database";
import { ConfirmTransactionDto } from "./dto/confirm-transaction.dto";
import { TransactionStatus } from "@prisma/client";
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
  async updateTransaction(
    where: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateInput
  ): Promise<Transaction> {
    return this.transactionDelegate.update({
      where,
      data,
    });
  }
  async getPendingTransaction(
    payload: Omit<ConfirmTransactionDto, "timestamp"> & { timestamp?: string }
  ): Promise<Transaction | null> {
    const transactions = await this.transactionDelegate.findMany({
      where: {
        publicKey: payload.senderPublicKey,
        senderAmount: payload.amountInToken,
        senderToken: payload.token,
        status: TransactionStatus.PENDING,
      },
    });
    // ? returning the last transaction incase multiple transactions are found (since the last one will get payed first)
    return transactions.length > 0
      ? transactions[transactions.length - 1]
      : null;
  }
  async getPendingTransactionByAccountNo(
    publicKey: string,
    accountNo: string
  ): Promise<Transaction | null> {
    return this.transactionDelegate.findFirst({
      where: {
        publicKey,
        receiverAccountNo: accountNo,
        status: TransactionStatus.PENDING,
      },
    });
  }
}

export const transactionRepository = new TransactionRepository();
