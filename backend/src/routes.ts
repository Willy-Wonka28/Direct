import { Router } from "express";
import { HomeController } from "./models/home/home.controller";
import utilRouter from "./models/util/util.router";
import transactionRouter from "./transaction/transaction.route";
const router = Router();

router.get("/", HomeController.welcome);

router.use("/util", utilRouter);
router.use("/transaction", transactionRouter);
export default router;
