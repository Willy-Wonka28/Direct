export enum WebhookEvent {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  TRANSACTION_SUCCESSFUL = "transaction_successful",
  TRANSACTION_FAILED = "transaction_failed",
  TRANSACTION_CANCELLED = "transaction_cancelled",
  JOIN_TRANSACTION_ROOM = "join_transaction_room",
  JOIN_TRANSACTION_ROOMS = "join_transaction_room",
  LEAVE_TRANSACTION_ROOM = "leave_transaction_room",
}
