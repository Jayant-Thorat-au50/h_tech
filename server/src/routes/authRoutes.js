import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, getMe, changePassword } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAdmin, getMe);
router.put('/password', requireAdmin, changePassword);

export default router;
