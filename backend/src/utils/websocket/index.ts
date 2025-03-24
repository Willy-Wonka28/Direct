import { Socket } from "socket.io";
import { WebhookTransactionService } from "./websocket-transaction.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { WebsocketEvents } from "./websocket.events";
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
    WebsocketEvents.CLIENT_CONNECTED,
    transactionConnectionHandler(webhookTransactionService)
  );
  return webhookTransactionService;
}

// Initialize Events, and wait for client to emit event, to join room.
export function transactionConnectionHandler(
  websocketService: WebhookTransactionService
) {
  return (socket: Socket) => {
    logger.info("New connection established", socket.id);
    socket.emit(WebsocketEvents.CONNECTION_SUCCESSFUL, {
      message: "Connection successful",
    });
    socket.on(
      WebsocketEvents.JOIN_TRANSACTION_ROOM,
      (transactionId: string) => {
        websocketService.joinTransactionRoom(socket, transactionId);
      }
    );
    socket.on(
      WebsocketEvents.JOIN_TRANSACTION_ROOMS,
      (transactions: string[]) => {
        websocketService.joinTransactionRooms(socket, transactions);
      }
    );
    socket.on(WebsocketEvents.CLIENT_DISCONNECTED, () => {
      // * will leave room automatically
      logger.info("Connection closed");
    });
  };
}
