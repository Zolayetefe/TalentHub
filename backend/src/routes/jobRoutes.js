import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  getJobsByEmployer,
  updateJobStatus,
  deleteJob
} from '../controllers/jobController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';
import { createJobValidation, updateJobStatusValidation } from '../validators/jobValidator.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/employer/:employerId', verifyToken, roleCheck('employer', 'admin'), getJobsByEmployer);

router.post(
  '/',
  verifyToken,
  roleCheck('employer', 'admin'),
  createJobValidation,
  validate,
  createJob
);

router.patch(
  '/:jobId',
  verifyToken,
  roleCheck('employer', 'admin'),
  updateJobStatusValidation,
  validate,
  updateJobStatus
);

router.delete('/:id', verifyToken, roleCheck('employer', 'admin'), deleteJob);

export default router;
