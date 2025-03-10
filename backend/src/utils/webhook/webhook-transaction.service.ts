import { Socket } from "socket.io";
import { WebhookService } from "./webhook.service";
import { LoggerService } from "../../logger/logger.service";

export class WebhookTransactionService extends WebhookService {
  constructor(public logger: LoggerService) {
    super("/transactions");
  }
  joinTransactionRoom(socket: Socket, transactionId: string) {
    socket.join(transactionId);
    this.logger.info(`User ${socket.id} joined room: ${transactionId}`);
  }
  joinTransactionRooms(socket: Socket, transactionIds: string[]) {
    transactionIds.forEach((transactionId) => {
      this.joinTransactionRoom(socket, transactionId);
    });
  }
}
