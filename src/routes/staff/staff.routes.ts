import { Router } from "express";
import {
  getStaff,
  loginAdmin,
  registerTeam,
  updateStaff,
} from "../../controllers/auth/admin.controllers";
import { verifyJWTRefresh } from "../../middleware/validate-auth.middleware";
import { verifyJWT } from "../../middleware/check-admin.middleware";
import { verifyAdmin } from '../../middleware/verify-admin.middleware'
import { logoutStaff } from "../../controllers/auth/base-auth.controllers";
const router = Router();

router
  .route("/staff")
  .get(getStaff)
  .post(verifyJWT, verifyJWTRefresh, registerTeam)
  .delete(logoutStaff)
router
  .route("/staff/:creds")
  .get(verifyJWT, verifyJWTRefresh, getStaff)
  .patch(verifyAdmin, verifyJWTRefresh, updateStaff);

  router
  .route('/staff/login')
  .post(loginAdmin)
export default router;
