import { Router } from "express";
import { HomeController } from "./models/home/home.controller";
import UtilRouter from "./models/util/util.router";
import transactionRouter from "./transaction/transaction.route";
const router = Router();

router.get("/", HomeController.welcome);

router.use("/util", UtilRouter);
router.use("/transaction", transactionRouter);
export default router;
