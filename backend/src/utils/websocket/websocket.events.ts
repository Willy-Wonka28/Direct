export enum WebhookEvent {
  CLIENT_CONNECTED = "connection",
  CLIENT_DISCONNECTED = "disconnect",
  CONNECTION_SUCCESSFUL = "connection_successful",
  TRANSACTION_SUCCESSFUL = "transaction_successful",
  TRANSACTION_FAILED = "transaction_failed",
  TRANSACTION_CANCELLED = "transaction_cancelled",
  JOIN_TRANSACTION_ROOM = "join_transaction_room",
  JOIN_TRANSACTION_ROOMS = "join_transaction_rooms",
  LEAVE_TRANSACTION_ROOM = "leave_transaction_room",
}
