import { Router } from "express";
import {
  getStudent,
  registerStudent,
} from "../../controllers/students/students.controllers";
import { verifyJWT } from "../../middleware/check-admin.middleware";
import { verifyJWTRefresh } from "../../middleware/validate-auth.middleware";
const router = Router();

router
  .route("/school/students/:creds")
  .get(verifyJWT, verifyJWTRefresh, getStudent);

router
  .route("/school/students")
  .post(verifyJWT, verifyJWTRefresh, registerStudent);
export default router;
