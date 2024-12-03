import { Router } from "express";
import healthController from "../../controllers/ping/health-check.controllers";

const router = Router();

router.get('/ping', healthController)

export default router