import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Streak Controller
 * Handles streak data retrieval
 * Requirements: 6.1, 6.7
 */

/**
 * GET /api/streaks
 * Retrieve user streak data
 * Requirements: 6.1, 6.7
 */
export const getStreakData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!; // Set by authenticate middleware

    // Fetch streak data for user
    const streakData = await prisma.streak.findUnique({
      where: { userId },
    });

    // If no streak data exists, return default values
    if (!streakData) {
      res.json({
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
      });
      return;
    }

    res.json({
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      lastCheckIn: streakData.lastCheckIn,
    });
  } catch (error) {
    console.error('Error fetching streak data:', error);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
};
