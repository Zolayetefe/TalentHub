import { Router } from "express";
import {
  applyToJob,
  getUserApplications,
  getJobApplicants,
  getAllApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { upload } from "../utils/upload.js";
import { roleCheck } from "../middleware/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken,roleCheck("applicant"),upload.single("resume"),applyToJob);
router.get("/user",verifyToken,roleCheck("applicant","admin"), getUserApplications);
router.get("/job/:jobId",verifyToken, roleCheck("employer","admin"),getJobApplicants);
router.get("/", verifyToken,roleCheck("admin"), getAllApplications);
router.patch("/:ApplicationId",verifyToken,roleCheck('employer', 'admin'),updateApplicationStatus)


export default router;
