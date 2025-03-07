import { NextFunction } from "express";
import { BaseException } from "../exceptions/base.exception";
import { ResponseDto } from "../../dto/response.dto";
import { Response, Request } from "express";
import { ResponseStatusEnum } from "../../constants/response-status.enum";

export function errorHandler(
  error: BaseException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  const resObj = new ResponseDto(message, ResponseStatusEnum.ERROR);
  res.status(status).send(resObj);
  next();
}
