import server from "../../server";
import { Socket } from "socket.io";
import { WebhookTransactionService } from "./websocket-transaction.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { WebhookEvent } from "./websocket.events";
import { transactionService } from "../../models/transaction/transaction.service";
const logger = new LoggerService(LoggerPaths.WEBHOOK_EVENTS);
const webhookTransactionService = new WebhookTransactionService(
  logger,
  transactionService
);

// Initialize Events, and wait for client to emit event, to join room.
webhookTransactionService.on(
  WebhookEvent.CLIENT_CONNECTED,
  (socket: Socket) => {
    logger.info("New connection established", socket.id);
    socket.emit(WebhookEvent.CONNECTION_SUCCESSFUL, {
      message: "Connection successful",
    });
    socket.on(WebhookEvent.JOIN_TRANSACTION_ROOM, (transactionId: string) => {
      webhookTransactionService.joinTransactionRoom(socket, transactionId);
    });
    socket.on(WebhookEvent.JOIN_TRANSACTION_ROOMS, (transactions: string[]) => {
      webhookTransactionService.joinTransactionRooms(socket, transactions);
    });
    socket.on(WebhookEvent.CLIENT_DISCONNECTED, () => {
      // * will leave room automatically
      logger.info("Connection closed");
    });
  }
);
export default webhookTransactionService;
