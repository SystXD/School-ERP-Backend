import { Router } from "express";
import {
  getStudent,
  registerStudent,
} from "../../controllers/students/students.controllers";
import { verifyJWT } from "../../middleware/check-admin.middleware";
import { verifyJWTRefresh } from "../../middleware/validate-auth.middleware";
import { updateExamGrades } from "../../controllers/grade/grades.controllers";
const router = Router();

router.route("/students/:creds").get(verifyJWT, verifyJWTRefresh, getStudent);

router.route("/students").post(verifyJWT, verifyJWTRefresh, registerStudent);

router
  .route("/students/updateGrades")
  .post(verifyJWT, verifyJWTRefresh, updateExamGrades);

export default router;
