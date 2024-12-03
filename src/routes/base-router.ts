import { Router } from "express";

import healthRouter from './ping/health-check.router'
import staffRouter from './staff/staff.routes'
import { errorMiddleware } from "../middleware/error.middleware";
const router = Router();
router.use('/api/v1', healthRouter, staffRouter)

export default router