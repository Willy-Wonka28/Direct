import { socket } from "./index";
import { WebsocketEvents } from "./websocket.events";

export const joinTransactionRoom = (transactionId: string) => {
  socket.emit(WebsocketEvents.JOIN_TRANSACTION_ROOM, transactionId);
  console.log(`Joined transaction room: ${transactionId}`);
};
export const joinTransactionRooms = (transactionIds: string[]) => {
  socket.emit(WebsocketEvents.JOIN_TRANSACTION_ROOMS, transactionIds);
  console.log(`Joined transaction rooms: ${transactionIds}`);
};
