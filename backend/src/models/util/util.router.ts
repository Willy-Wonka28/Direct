import { Router } from "express";
import { UtilsController } from "./util.controller";
import { UtilService } from "./util.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { Validator } from "../../utils/middleware/validator.middleware";
import { VerifyAccountDto } from "./dto/verify-account.dto";
import { GetExchangeRateDto } from "./dto/get-exchange-rate.dto";

const UtilRouter = Router();
const utilLogger = new LoggerService(LoggerPaths.UTIL);
const utilService = new UtilService(utilLogger);
const utilController = new UtilsController(utilService);
const validator = new Validator();
// Routes
UtilRouter.get("/banks", utilController.getBank);
UtilRouter.get(
  "/verify-account",
  validator.single(VerifyAccountDto),
  utilController.verifyBank
);
UtilRouter.get("/tokens", utilController.getTokens);
UtilRouter.get("/currencies", utilController.getCurrencies);
UtilRouter.get(
  "/exchange-rate",
  validator.single(GetExchangeRateDto, "query"),
  utilController.fetchExchangeRate
);

export default UtilRouter;
