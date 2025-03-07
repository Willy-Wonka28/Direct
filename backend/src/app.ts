import express from "express";
import helmet from "helmet";
import cors from "cors";
import { AppEnum } from "./constants/app.enum";
import { errorHandler } from "./utils/middleware/error-handler.middleware";
import { HomeController } from "./home/home.controller";
import router from "./routes";
const app = express();
app.set("port", AppEnum.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet(AppEnum.HELMET_OPTIONS));
app.use(cors(AppEnum.CORS_OPTIONS));

app.use("/", router);

// Not Found Route Handler
app.use(HomeController.notFound);
// Global Error Handler
app.use(errorHandler);
export default app;
