import server from "../../server";
import { Socket, Server } from "socket.io";
import { WebhookService } from "./webhook.service";
import { WebhookTransactionService } from "./webhook-transaction.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { WebhookEvent } from "./webhook.events";

const logger = new LoggerService(LoggerPaths.WEBHOOK_EVENTS);
const webhookTransactionService = new WebhookTransactionService(logger);

// Initialize Events
webhookTransactionService.on(WebhookEvent.CONNECTION, (socket: Socket) => {
  logger.info("New connection established");
  socket.on(WebhookEvent.JOIN_TRANSACTION_ROOM, () => {
    webhookTransactionService.joinTransactionRoom(
      socket,
      socket.handshake.query.transactionId as string
    );
  });
  socket.on(WebhookEvent.JOIN_TRANSACTION_ROOMS, (transactions: string[]) => {
    webhookTransactionService.joinTransactionRooms(socket, transactions);
  });
  socket.on(WebhookEvent.DISCONNECT, () => {
    logger.info("Connection closed");
  });
});
export default webhookTransactionService;
