import { Router } from "express";
import { registerClass } from '../../controllers/class/class.controllers'
import { verifyAdmin, verifyAdminRefresh } from "../../middleware/verify-admin.middleware";


const router = Router();

router.route("/classes")
.post(verifyAdmin, verifyAdminRefresh, registerClass)


export default router;