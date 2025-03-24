import { Server } from "socket.io";
import server from "../../server";
export class WebhookService extends Server {
  constructor() {
    super(server, {
      path: "/websocket", // Make sure path starts with a slash
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      pingTimeout: 10000, // Increase timeout to match client
      pingInterval: 5000,
    });

    console.log("WebhookService initialized with path:", "/websocket");
  }
}
