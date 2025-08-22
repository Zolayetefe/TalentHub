import express from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  getJobsByEmployer,
  deleteJob
} from '../controllers/jobController.js';
import { verifyToken, roleCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.get('/employer/:employerId', getJobsByEmployer);
router.post('/', verifyToken, roleCheck('employer', 'admin'), createJob);
router.delete('/:id', verifyToken, deleteJob);

export default router;
