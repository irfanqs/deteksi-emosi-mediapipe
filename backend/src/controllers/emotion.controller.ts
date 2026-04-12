import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EmotionScores, EmotionType, VALID_EMOTIONS } from '../types/emotion.types';
import { validateEmotionScores } from '../utils/validation';
import { calculateStreak } from '../utils/streak';
import { updateGoalProgress } from '../utils/goalProgress';

const prisma = new PrismaClient();

/**
 * Emotion Controller
 * Handles emotion entry creation, retrieval, and deletion
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

/**
 * Calculate dominant emotion from emotion scores
 * Returns the emotion with the highest score
 * Requirements: 2.2
 */
export const calculateDominantEmotion = (scores: EmotionScores): EmotionType => {
  const emotions: Array<{ emotion: EmotionType; score: number }> = [
    { emotion: 'happy', score: scores.happy },
    { emotion: 'sad', score: scores.sad },
    { emotion: 'angry', score: scores.angry },
    { emotion: 'fearful', score: scores.fearful },
    { emotion: 'disgusted', score: scores.disgusted },
    { emotion: 'surprised', score: scores.surprised },
    { emotion: 'neutral', score: scores.neutral },
  ];

  const dominant = emotions.reduce((max, current) =>
    current.score > max.score ? current : max
  );

  return dominant.emotion;
};

/**
 * POST /api/emotions
 * Create a new emotion entry
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
export const createEmotionEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!; // Set by authenticate middleware
    const { emotionScores, timestamp } = req.body;

    // Validate emotion scores exist
    if (!emotionScores) {
      res.status(400).json({ error: 'Emotion scores are required' });
      return;
    }

    // Validate emotion scores
    const validation = validateEmotionScores(emotionScores);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Calculate dominant emotion
    const dominantEmotion = calculateDominantEmotion(emotionScores);

    // Create emotion entry with timestamp
    const entry = await prisma.emotionEntry.create({
      data: {
        userId,
        dominantEmotion,
        happyScore: emotionScores.happy,
        sadScore: emotionScores.sad,
        angryScore: emotionScores.angry,
        fearfulScore: emotionScores.fearful,
        disgustedScore: emotionScores.disgusted,
        surprisedScore: emotionScores.surprised,
        neutralScore: emotionScores.neutral,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    // Update streak after successful emotion entry creation
    // Requirements: 6.1, 6.7
    await calculateStreak(userId, entry.timestamp);

    // Update goal progress after successful emotion entry creation
    // Requirements: 5.5, 5.6, 5.7, 5.8
    await updateGoalProgress(userId, entry);

    res.status(201).json({
      id: entry.id,
      userId: entry.userId,
      dominantEmotion: entry.dominantEmotion,
      emotionScores: {
        happy: entry.happyScore,
        sad: entry.sadScore,
        angry: entry.angryScore,
        fearful: entry.fearfulScore,
        disgusted: entry.disgustedScore,
        surprised: entry.surprisedScore,
        neutral: entry.neutralScore,
      },
      timestamp: entry.timestamp,
      createdAt: entry.createdAt,
    });
  } catch (error) {
    console.error('Error creating emotion entry:', error);
    res.status(500).json({ error: 'Failed to create emotion entry' });
  }
};

/**
 * GET /api/emotions
 * Retrieve emotion history with filtering and pagination
 * Requirements: 2.6, 2.7
 */
export const getEmotionHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, limit = '50', offset = '0' } = req.query;

    // Build filter conditions
    const where: any = { userId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate as string);
      }
    }

    // Parse pagination parameters
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    // Fetch emotion entries
    const entries = await prisma.emotionEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limitNum,
      skip: offsetNum,
    });

    // Get total count for pagination
    const total = await prisma.emotionEntry.count({ where });

    // Transform response
    const formattedEntries = entries.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      dominantEmotion: entry.dominantEmotion,
      emotionScores: {
        happy: entry.happyScore,
        sad: entry.sadScore,
        angry: entry.angryScore,
        fearful: entry.fearfulScore,
        disgusted: entry.disgustedScore,
        surprised: entry.surprisedScore,
        neutral: entry.neutralScore,
      },
      timestamp: entry.timestamp,
      createdAt: entry.createdAt,
    }));

    res.json({
      entries: formattedEntries,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    console.error('Error fetching emotion history:', error);
    res.status(500).json({ error: 'Failed to fetch emotion history' });
  }
};

/**
 * DELETE /api/emotions/:id
 * Delete an emotion entry
 * Requirements: 2.1
 */
export const deleteEmotionEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify the entry exists and belongs to the user
    const entry = await prisma.emotionEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      res.status(404).json({ error: 'Emotion entry not found' });
      return;
    }

    if (entry.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete the entry (cascade will delete associated journal)
    await prisma.emotionEntry.delete({
      where: { id },
    });

    res.json({ message: 'Emotion entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting emotion entry:', error);
    res.status(500).json({ error: 'Failed to delete emotion entry' });
  }
};
