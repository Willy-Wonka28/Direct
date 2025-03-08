import { Router } from "express";
import { HomeController } from "./models/home/home.controller";
import UtilRouter from "./models/util/util.router";

const router = Router();

router.get("/", HomeController.welcome);

router.use("/util", UtilRouter);
export default router;
