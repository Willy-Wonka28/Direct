import { socket } from "./index";
import { WebhookEvent } from "./webhook.events";

export const joinTransactionRoom = (transactionId: string) => {
  socket.emit(WebhookEvent.JOIN_TRANSACTION_ROOM, transactionId);
  console.log(`Joined transaction room: ${transactionId}`);
};
export const joinTransactionRooms = (transactionIds: string[]) => {
  socket.emit(WebhookEvent.JOIN_TRANSACTION_ROOMS, transactionIds);
  console.log(`Joined transaction rooms: ${transactionIds}`);
};
