import { NextFunction } from "express";
import { BaseException } from "../exceptions/base.exception";
import { ResponseDto } from "../../dto/response.dto";
import { Response, Request } from "express";
import { ResponseStatus } from "../../constants/response-status.enum";
import { LoggerService } from "../../logger/logger.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";

const requestErrors = new LoggerService(LoggerPaths.CLIENT);
export function errorHandler(
  error: BaseException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.originalUrl.includes("/websocket")) {
    console.log("error", req.originalUrl);
    return next(); // Let Socket.io handle it
  }
  const status = error.status || 500;

  const message = error.message || "Something went wrong";
  const resObj = new ResponseDto(message, ResponseStatus.ERROR, undefined, {
    cause: error.cause || error.message,
    name: error.name || "Error",
    path: req.path,
    statusCode: error.status || 500,
  });
  requestErrors.error(resObj.message, resObj.status);
  res.status(200).send(resObj);
  next();
}
