import { Router } from "express";
import { HomeController } from "./models/home/home.controller";
import utilRouter from "./models/util/util.router";
import transactionRouter from "./models/transaction/transaction.route";
import heliusWebhookRouter from "./models/helius-webhook/helius-webhook.route";
// import webhookTransactionService from "./utils/webhook";
const router = Router();

router.get("/", HomeController.welcome);

router.use("/util", utilRouter);
router.use("/transaction", transactionRouter);
router.use("/helius-webhook", heliusWebhookRouter);
export default router;
