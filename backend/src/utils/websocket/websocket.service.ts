import { Server } from "socket.io";
export class WebhookService {
  public io: Server;
  constructor(server: any) {
    this.io = new Server(server, {
      path: "/websocket/", // Make sure path starts with a slash
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
