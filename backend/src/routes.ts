import { Router } from "express";
import { HomeController } from "./home/home.controller";

const router = Router();

router.use("/", HomeController.welcome);
export default router;
