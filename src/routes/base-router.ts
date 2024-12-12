import { Router } from "express";

import healthRouter from './ping/health-check.router'
import staffRouter from './staff/staff.routes';
import classRouter from './class/class.routes'
import studentRouer from './students/students.routes'
import { errorMiddleware } from "../middleware/error.middleware";
const router = Router();
router.use('/api/v1/school', healthRouter, staffRouter, classRouter, studentRouer)

export default router