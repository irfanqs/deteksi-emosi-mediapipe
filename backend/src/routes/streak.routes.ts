import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getStreakData } from '../controllers/streak.controller';

/**
 * Streak Routes
 * All routes require authentication
 * Requirements: 6.1, 6.7, 8.1
 */

const router = Router();

// All streak routes require authentication
router.use(authenticate);

/**
 * GET /api/streaks
 * Retrieve user streak data
 * Requirements: 6.1, 6.7
 */
router.get('/', getStreakData);

export default router;
