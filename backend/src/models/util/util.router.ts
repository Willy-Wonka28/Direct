import { Router } from "express";
import { UtilsController } from "./util.controller";
import { UtilService } from "./util.service";
import { LoggerPaths } from "../../constants/logger-paths.enum";
import { LoggerService } from "../../logger/logger.service";
import { Validator } from "../../utils/middleware/validator.middleware";
import { VerifyAccountDto } from "./dto/verify-account.dto";

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
  utilController.getBank
);

export default UtilRouter;
