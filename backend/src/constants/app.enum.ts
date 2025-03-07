import { configService } from "../utils/config/config.service";
import { HelmetOptions } from "helmet";
import { CorsOptions } from "cors";
const HELMET_OPTIONS: HelmetOptions = {
  contentSecurityPolicy: false,
};
const CORS_OPTIONS: CorsOptions = {
  origin: [configService.get("CLIENT_URL") || "http://localhost"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "transaction-id"],
};
export const AppEnum = {
  PORT: configService.get("PORT") || "3000",
  BASE_URL: configService.get("BASE_URL") || "http://localhost",
  NODE_ENV: configService.get("NODE_ENV") || "development",
  CORS_OPTIONS,
  HELMET_OPTIONS,
  DATABASE_URL: configService.get("DATABASE_URL"),
  JWT_SECRET: configService.get("JWT_SECRET"),
};
