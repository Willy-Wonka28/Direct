import { Socket } from "socket.io";
import { WebhookService } from "./webhook.service";
import { LoggerService } from "../../logger/logger.service";
import { TransactionService } from "../../models/transaction/transaction.service";

export class WebhookTransactionService extends WebhookService {
  constructor(
    public logger: LoggerService,
    public readonly transactionService: TransactionService
  ) {
    super("/webhook/transactions");
    logger.info("Webhook Transaction Service Initialized");
  }
  async joinTransactionRoom(socket: Socket, transactionId: string) {
    // * transaction must exists
    const transactionExists =
      await this.transactionService.verifyTransactionExistence(transactionId);
    if (!transactionExists) {
      this.logger.debug(`Transaction with id ${transactionId} does not exist`);
      return;
    }
    socket.join(transactionId);
    this.logger.debug(`User ${socket.id} joined room: ${transactionId}`);
  }
  async joinTransactionRooms(socket: Socket, transactionIds: string[]) {
    await Promise.all(
      transactionIds.map((transactionId) =>
        this.joinTransactionRoom(socket, transactionId)
      )
    );
  }

  leaveTransactionRoom(socket: Socket, transactionId: string) {
    socket.leave(transactionId);
    this.logger.debug(`User ${socket.id} left room: ${transactionId}`);
  }

  leaveTransactionRooms(socket: Socket, transactionIds: string[]) {
    transactionIds.forEach((transactionId) => {
      this.leaveTransactionRoom(socket, transactionId);
    });
  }
}
