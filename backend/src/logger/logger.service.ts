import { LoggerPaths } from "../constants/logger-paths.enum";
import { configService } from "../utils/config/config.service";
import { ILogger } from "./logger.interface";
import pino from "pino";

export class LoggerService implements ILogger {
  private logger: pino.Logger;
  constructor(private path: LoggerPaths) {
    const label =
      Object.keys(LoggerPaths)[Object.values(LoggerPaths).indexOf(path)];
    console.log(`Logger initialized for: ${label}`);
    const isDev = configService.get("NODE_ENV") === "development";
    console.log(isDev);
    const transport = pino.transport({
      targets: [
        // Pretty logs for console in development
        isDev
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "yyyy-mm-dd HH:MM:ss",
                ignore: "pid,hostname",
              },
            }
          : null,
        // File logging in JSON format
        {
          target: "pino/file",
          options: { destination: this.path },
        },
      ].filter(Boolean) as any[], // Remove null if not in development
    });
    this.logger = pino(
      {
        base: { label },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      transport
    );
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }
  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }
  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }
}
