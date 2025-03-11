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
  const status = error.status || 500;
  requestErrors.error(error.message);
  const message = error.message || "Something went wrong";
  const resObj = new ResponseDto(
    message,
    ResponseStatus.ERROR,
    undefined,
    error.cause || error
  );
  res.status(status).send(resObj);
  next();
}
