import { Request, RequestHandler, Response } from "express";
import { ResponseDto } from "../../dto/response.dto";
import { ResponseStatus } from "../../constants/response-status.enum";
import { NotFoundException } from "../../utils/exceptions/not-found.exception";

export class HomeController {
  static welcome: RequestHandler = (req: Request, res: Response) => {
    const resObj = new ResponseDto(
      "Welcome to the home page",
      ResponseStatus.SUCCESS
    );
    res.json(resObj);
  };

  static notFound: RequestHandler = (
    req: Request,
    res: Response,
    next: Function
  ) => {
    if (req.originalUrl.startsWith("/websocket")) {
      console.log("not found", req.originalUrl);
      next(); // Let Socket.io handle it
    }
    let msg = `Route ${req.originalUrl} was not found, please check route and try again`;
    throw new NotFoundException(msg);
  };
}
