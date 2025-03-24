import express from "express";
import helmet from "helmet";
import cors from "cors";
import { AppEnum } from "./constants/app.enum";
import { errorHandler } from "./utils/middleware/error-handler.middleware";
import { HomeController } from "./models/home/home.controller";
import router from "./routes";
import { LoggerService } from "./logger/logger.service";
import { LoggerPaths } from "./constants/logger-paths.enum";
import { initializeWebsockets } from "./utils/websocket";
import { createServer } from "http";
const app = express();
app.set("port", AppEnum.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet(AppEnum.HELMET_OPTIONS));
app.use(cors(AppEnum.CORS_OPTIONS));

// Create HTTP server from Express app
export const server = createServer(app);
// ! This must be initialized before declaring routes
initializeWebsockets(server);

// declaring routes
app.use("/", router);
const logger = new LoggerService(LoggerPaths.APP);

app.use(HomeController.notFound);
// Global Error Handler
app.use(errorHandler);
export default app;
