import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from '../controllers/goal.controller';

/**
 * Goal Routes
 * All routes require authentication
 * Requirements: 5.1, 5.4, 5.10
 */

const router = Router();

// All goal routes require authentication
router.use(authenticate);

/**
 * POST /api/goals
 * Create a new goal
 * Requirements: 5.1
 */
router.post('/', createGoal);

/**
 * GET /api/goals
 * Retrieve user goals
 * Requirements: 5.1
 */
router.get('/', getGoals);

/**
 * PUT /api/goals/:id
 * Update a goal
 * Requirements: 5.4
 */
router.put('/:id', updateGoal);

/**
 * DELETE /api/goals/:id
 * Soft delete a goal (mark as inactive)
 * Requirements: 5.10
 */
router.delete('/:id', deleteGoal);

export default router;
