import { Router } from 'express';
import { login, getProfile, updateProfile, loginValidation } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Authentication routes
 * Requirements: 8.1, 8.2
 */

// POST /api/auth/login - Login or create user
router.post('/login', loginValidation, login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', authenticate, getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put('/profile', authenticate, updateProfile);

export default router;
