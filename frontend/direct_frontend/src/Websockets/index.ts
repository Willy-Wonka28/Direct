import { io } from "socket.io-client";

export const socket = io(
  "https://direct-production.up.railway.app/transactions",
  {}
);
