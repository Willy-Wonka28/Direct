import { Socket } from "socket.io";
import { WebhookTransactionService } from "./websocket-transaction.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { WebhookEvent } from "./websocket.events";
import { transactionService } from "../../models/transaction/transaction.service";

const logger = new LoggerService(LoggerPaths.WEBHOOK_EVENTS);

export function initializeWebsockets(server: any) {
  const websocketLogger = new LoggerService(LoggerPaths.WEBHOOK_EVENTS);
  const webhookTransactionService = new WebhookTransactionService(
    websocketLogger,
    transactionService,
    server
  );

  // Initialize Events, and wait for client to emit event, to join room.
  webhookTransactionService.io.on(
    WebhookEvent.CLIENT_CONNECTED,
    transactionConnectionHandler(webhookTransactionService)
  );
}

// Initialize Events, and wait for client to emit event, to join room.
export function transactionConnectionHandler(
  webhookService: WebhookTransactionService
) {
  return (socket: Socket) => {
    logger.info("New connection established", socket.id);
    socket.emit(WebhookEvent.CONNECTION_SUCCESSFUL, {
      message: "Connection successful",
    });
    socket.on(WebhookEvent.JOIN_TRANSACTION_ROOM, (transactionId: string) => {
      webhookService.joinTransactionRoom(socket, transactionId);
    });
    socket.on(WebhookEvent.JOIN_TRANSACTION_ROOMS, (transactions: string[]) => {
      webhookService.joinTransactionRooms(socket, transactions);
    });
    socket.on(WebhookEvent.CLIENT_DISCONNECTED, () => {
      // * will leave room automatically
      logger.info("Connection closed");
    });
  };
}
