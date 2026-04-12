import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateRecommendations } from '../utils/recommendations';
import { VALID_EMOTIONS } from '../types/emotion.types';

const prisma = new PrismaClient();

/**
 * Recommendation Controller
 * Handles recommendation generation and completion tracking
 * Requirements: 4.1, 4.12
 */

/**
 * GET /api/recommendations
 * Generate recommendations based on emotion
 * Requirements: 4.1
 */
export const getRecommendations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!; // Set by authenticate middleware
    const { emotion, intensity } = req.query;

    // Validate emotion parameter
    if (!emotion || typeof emotion !== 'string') {
      res.status(400).json({ error: 'Emotion parameter is required' });
      return;
    }

    if (!VALID_EMOTIONS.includes(emotion as any)) {
      res.status(400).json({ 
        error: `Invalid emotion. Must be one of: ${VALID_EMOTIONS.join(', ')}` 
      });
      return;
    }

    // Parse and validate intensity (default to 0.5 if not provided)
    let emotionIntensity = 0.5;
    if (intensity) {
      emotionIntensity = parseFloat(intensity as string);
      if (isNaN(emotionIntensity) || emotionIntensity < 0 || emotionIntensity > 1) {
        res.status(400).json({ 
          error: 'Intensity must be a number between 0 and 1' 
        });
        return;
      }
    }

    // Generate recommendations
    const recommendations = await generateRecommendations(
      userId,
      emotion as any,
      emotionIntensity
    );

    res.json({
      emotion,
      intensity: emotionIntensity,
      recommendations,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

/**
 * POST /api/recommendations/complete
 * Mark recommendation as completed
 * Requirements: 4.12
 */
export const markRecommendationCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { recommendationId, recommendationType } = req.body;

    // Validate required fields
    if (!recommendationId || typeof recommendationId !== 'string') {
      res.status(400).json({ error: 'Recommendation ID is required' });
      return;
    }

    if (!recommendationType || typeof recommendationType !== 'string') {
      res.status(400).json({ error: 'Recommendation type is required' });
      return;
    }

    // Validate recommendation type
    const validTypes = ['meditation', 'exercise', 'journaling', 'breathing', 'music', 'article'];
    if (!validTypes.includes(recommendationType)) {
      res.status(400).json({ 
        error: `Invalid recommendation type. Must be one of: ${validTypes.join(', ')}` 
      });
      return;
    }

    // Create completion record
    const completion = await prisma.recommendationCompletion.create({
      data: {
        userId,
        recommendationId,
        recommendationType,
        completedAt: new Date()
      }
    });

    res.status(201).json({
      id: completion.id,
      userId: completion.userId,
      recommendationId: completion.recommendationId,
      recommendationType: completion.recommendationType,
      completedAt: completion.completedAt
    });
  } catch (error) {
    console.error('Error marking recommendation as completed:', error);
    res.status(500).json({ error: 'Failed to mark recommendation as completed' });
  }
};
