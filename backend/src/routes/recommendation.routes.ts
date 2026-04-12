import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getRecommendations,
  markRecommendationCompleted
} from '../controllers/recommendation.controller';

/**
 * Recommendation Routes
 * All routes require authentication
 * Requirements: 4.1, 4.12, 8.1
 */

const router = Router();

/**
 * GET /api/recommendations
 * Generate recommendations based on emotion
 * Query params: emotion (required), intensity (optional, default 0.5)
 * Requirements: 4.1, 8.1
 */
router.get('/', authenticate, getRecommendations);

/**
 * POST /api/recommendations/complete
 * Mark a recommendation as completed
 * Body: { recommendationId: string, recommendationType: string }
 * Requirements: 4.12, 8.1
 */
router.post('/complete', authenticate, markRecommendationCompleted);

export default router;
