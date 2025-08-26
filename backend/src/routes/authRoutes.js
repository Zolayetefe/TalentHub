import express from 'express';
import { registerUser, loginUser ,getMe,logoutUser} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../validators/userValidator.js';
import { validate } from '../middleware/validate.js';
const router = express.Router();

router.post('/register',registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.get('/me', verifyToken, getMe )
router.get('/logout', logoutUser);
export default router;

