import { Server } from "socket.io";
import server from "../../server";
export class WebhookService extends Server {
  constructor(path = "") {
    super(server, {
      path,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }
}
