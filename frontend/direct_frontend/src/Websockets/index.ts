import { io } from "socket.io-client";
import { SERVER_URL } from "../config";
import { WebhookEvent } from "./webhook.events";

// Connect to the server with the correct path configuration
export const socket = io(SERVER_URL, {
  transports: ["websocket", "polling"],
  path: "/websocket", // Make sure path starts with a slash
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000, // Increase timeout to 10 seconds
});

// Log connection events for better debugging
socket.on("connect", () => {
  console.log("Socket connected successfully with ID:", socket.id);
});

socket.on(WebhookEvent.CONNECTION_SUCCESSFUL, (data) => {
  console.log("Received connection confirmation:", data);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error, error.message);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`Attempting to reconnect (${attemptNumber})...`);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

export const stopListeningForTransactionUpdates = () => {
  socket.off("transactionUpdate");
};
