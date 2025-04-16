import { NextFunction } from "express";
import { BaseException } from "../../utils/exceptions/base.exception";
import { ResponseDto } from "../../dto/response.dto";
import { Response, Request } from "express";
import { ResponseStatus } from "../../constants/response-status.enum";
import { LoggerService } from "../../logger/logger.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";

const requestErrors = new LoggerService(LoggerPaths.HELIUS_WEBHOOK_SERVICE);
export function heliusWebhookErrorHandler(
  error: BaseException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message = error.message || "Something went wrong";
  const resObj = new ResponseDto(message, ResponseStatus.ERROR, undefined, {
    cause: error.cause || error.message,
    name: error.name || "Error",
    path: req.path,
    statusCode: error.status || 500,
  });
  requestErrors.error(resObj.message, resObj.status, resObj.error);
  res.status(200).send(resObj);
}
