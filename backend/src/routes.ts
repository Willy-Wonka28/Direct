import { Router } from "express";
import { HomeController } from "./home/home.controller";

const router = Router();

router.get("/", HomeController.welcome);
export default router;
