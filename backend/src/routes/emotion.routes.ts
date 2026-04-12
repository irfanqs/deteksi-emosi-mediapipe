import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createEmotionEntry,
  getEmotionHistory,
  deleteEmotionEntry,
} from '../controllers/emotion.controller';

/**
 * Emotion Routes
 * All routes require authentication
 * Requirements: 2.1, 2.6, 8.1
 */

const router = Router();

// All emotion routes require authentication
router.use(authenticate);

/**
 * POST /api/emotions
 * Create a new emotion entry
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
router.post('/', createEmotionEntry);

/**
 * GET /api/emotions
 * Retrieve emotion history with filtering and pagination
 * Requirements: 2.6, 2.7
 */
router.get('/', getEmotionHistory);

/**
 * DELETE /api/emotions/:id
 * Delete an emotion entry
 * Requirements: 2.1, 8.5
 */
router.delete('/:id', deleteEmotionEntry);

export default router;
