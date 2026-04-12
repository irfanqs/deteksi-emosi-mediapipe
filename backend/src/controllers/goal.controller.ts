import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { VALID_EMOTIONS } from '../types/emotion.types';

const prisma = new PrismaClient();

/**
 * Goal Controller
 * Handles goal creation, retrieval, update, and deletion
 * Requirements: 5.1, 5.4, 5.10
 */

/**
 * POST /api/goals
 * Create a new goal
 * Requirements: 5.1
 */
export const createGoal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!; // Set by authenticate middleware
    const {
      targetEmotion,
      targetFrequency,
      startDate,
      endDate,
      reminderEnabled,
      reminderTime,
    } = req.body;

    // Validate required fields
    if (!targetEmotion || !targetFrequency || !startDate || !endDate) {
      res.status(400).json({
        error: 'Target emotion, target frequency, start date, and end date are required',
      });
      return;
    }

    // Validate target emotion
    if (!VALID_EMOTIONS.includes(targetEmotion)) {
      res.status(400).json({
        error: `Invalid target emotion. Must be one of: ${VALID_EMOTIONS.join(', ')}`,
      });
      return;
    }

    // Validate target frequency is positive integer
    if (!Number.isInteger(targetFrequency) || targetFrequency <= 0) {
      res.status(400).json({
        error: 'Target frequency must be a positive integer',
      });
      return;
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        error: 'Invalid date format',
      });
      return;
    }

    // Validate end date is after start date
    if (end <= start) {
      res.status(400).json({
        error: 'End date must be after start date',
      });
      return;
    }

    // Validate reminder time format if provided
    if (reminderTime) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(reminderTime)) {
        res.status(400).json({
          error: 'Reminder time must be in HH:MM format (24-hour)',
        });
        return;
      }
    }

    // Create goal
    const goal = await prisma.goal.create({
      data: {
        userId,
        targetEmotion,
        targetFrequency,
        startDate: start,
        endDate: end,
        reminderEnabled: reminderEnabled || false,
        reminderTime: reminderTime || null,
        isActive: true,
        currentProgress: 0,
      },
    });

    res.status(201).json({
      id: goal.id,
      userId: goal.userId,
      targetEmotion: goal.targetEmotion,
      targetFrequency: goal.targetFrequency,
      currentProgress: goal.currentProgress,
      startDate: goal.startDate,
      endDate: goal.endDate,
      reminderEnabled: goal.reminderEnabled,
      reminderTime: goal.reminderTime,
      isActive: goal.isActive,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

/**
 * GET /api/goals
 * Retrieve user goals
 * Requirements: 5.1
 */
export const getGoals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { activeOnly } = req.query;

    // Build filter conditions
    const where: any = { userId };

    // Filter by active status if requested
    if (activeOnly === 'true') {
      where.isActive = true;
    }

    // Fetch goals
    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

/**
 * PUT /api/goals/:id
 * Update a goal
 * Requirements: 5.4
 */
export const updateGoal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const {
      targetEmotion,
      targetFrequency,
      startDate,
      endDate,
      reminderEnabled,
      reminderTime,
    } = req.body;

    // Verify the goal exists and belongs to the user
    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    if (goal.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Build update data object
    const updateData: any = {};

    // Validate and add target emotion if provided
    if (targetEmotion !== undefined) {
      if (!VALID_EMOTIONS.includes(targetEmotion)) {
        res.status(400).json({
          error: `Invalid target emotion. Must be one of: ${VALID_EMOTIONS.join(', ')}`,
        });
        return;
      }
      updateData.targetEmotion = targetEmotion;
    }

    // Validate and add target frequency if provided
    if (targetFrequency !== undefined) {
      if (!Number.isInteger(targetFrequency) || targetFrequency <= 0) {
        res.status(400).json({
          error: 'Target frequency must be a positive integer',
        });
        return;
      }
      updateData.targetFrequency = targetFrequency;
    }

    // Validate and add dates if provided
    let start = goal.startDate;
    let end = goal.endDate;

    if (startDate !== undefined) {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        res.status(400).json({ error: 'Invalid start date format' });
        return;
      }
      updateData.startDate = start;
    }

    if (endDate !== undefined) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid end date format' });
        return;
      }
      updateData.endDate = end;
    }

    // Validate end date is after start date
    if (end <= start) {
      res.status(400).json({
        error: 'End date must be after start date',
      });
      return;
    }

    // Validate and add reminder settings if provided
    if (reminderEnabled !== undefined) {
      updateData.reminderEnabled = reminderEnabled;
    }

    if (reminderTime !== undefined) {
      if (reminderTime) {
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(reminderTime)) {
          res.status(400).json({
            error: 'Reminder time must be in HH:MM format (24-hour)',
          });
          return;
        }
      }
      updateData.reminderTime = reminderTime;
    }

    // Update goal
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    res.json({
      id: updatedGoal.id,
      userId: updatedGoal.userId,
      targetEmotion: updatedGoal.targetEmotion,
      targetFrequency: updatedGoal.targetFrequency,
      currentProgress: updatedGoal.currentProgress,
      startDate: updatedGoal.startDate,
      endDate: updatedGoal.endDate,
      reminderEnabled: updatedGoal.reminderEnabled,
      reminderTime: updatedGoal.reminderTime,
      isActive: updatedGoal.isActive,
      createdAt: updatedGoal.createdAt,
      updatedAt: updatedGoal.updatedAt,
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

/**
 * DELETE /api/goals/:id
 * Soft delete a goal (mark as inactive)
 * Requirements: 5.10
 */
export const deleteGoal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify the goal exists and belongs to the user
    const goal = await prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    if (goal.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Soft delete by marking as inactive
    await prisma.goal.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};
