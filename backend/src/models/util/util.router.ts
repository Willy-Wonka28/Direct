import { Router } from "express";
import { UtilsController } from "./util.controller";
import { UtilService } from "./util.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { Validator } from "../../utils/middleware/validator.middleware";
import { VerifyAccountDto } from "./dto/verify-account.dto";
import { GetExchangeRateDto } from "./dto/get-exchange-rate.dto";

const utilRouter = Router();
const utilLogger = new LoggerService(LoggerPaths.UTIL);
export const utilService = new UtilService(utilLogger);
const utilController = new UtilsController(utilService);
const validator = new Validator();
// Routes
utilRouter.get("/banks", utilController.getBank);
utilRouter.get(
  "/verify-account",
  validator.single(VerifyAccountDto),
  utilController.verifyBank
);
utilRouter.get("/tokens", utilController.getTokens);
utilRouter.get("/currencies", utilController.getCurrencies);
utilRouter.get(
  "/exchange-rate",
  validator.single(GetExchangeRateDto, "query"),
  utilController.fetchExchangeRate
);

export default utilRouter;
