import { Router } from "express";
import { addSection } from "../../controllers/section/section.controllers";
import { verifyAdmin } from "../../middleware/verify-admin.middleware";
import { verifyJWTRefresh } from '../../middleware/validate-auth.middleware'
const router = Router();


router.route("/section")
.post(addSection)

export default router;