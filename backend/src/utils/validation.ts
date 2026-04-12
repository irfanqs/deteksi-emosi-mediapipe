import { EmotionScores, EmotionType, VALID_EMOTIONS } from '../types/emotion.types';

/**
 * Validation utilities for emotion data
 * Requirements: 1.7, 1.8, 9.1, 9.2
 */

/**
 * Validate that all emotion scores are within range [0, 1]
 * Requirements: 1.7, 9.1
 */
export const validateEmotionScoresRange = (scores: EmotionScores): boolean => {
  const emotions: (keyof EmotionScores)[] = [
    'happy',
    'sad',
    'angry',
    'fearful',
    'disgusted',
    'surprised',
    'neutral',
  ];

  return emotions.every((emotion) => {
    const score = scores[emotion];
    return typeof score === 'number' && score >= 0 && score <= 1;
  });
};

/**
 * Validate that the sum of all emotion scores approximately equals 1.0
 * Tolerance: ±0.01
 * Requirements: 1.8
 */
export const validateEmotionScoresSum = (scores: EmotionScores): boolean => {
  const sum =
    scores.happy +
    scores.sad +
    scores.angry +
    scores.fearful +
    scores.disgusted +
    scores.surprised +
    scores.neutral;

  const tolerance = 0.01;
  return Math.abs(sum - 1.0) <= tolerance;
};

/**
 * Validate that dominant emotion is a valid emotion type
 * Requirements: 9.2
 */
export const validateDominantEmotion = (emotion: string): emotion is EmotionType => {
  return VALID_EMOTIONS.includes(emotion as EmotionType);
};

/**
 * Validate complete emotion scores object
 * Checks range, sum, and presence of all required fields
 * Requirements: 1.7, 1.8, 9.1
 */
export const validateEmotionScores = (
  scores: any
): { valid: boolean; error?: string } => {
  // Check if scores object exists
  if (!scores || typeof scores !== 'object') {
    return { valid: false, error: 'Emotion scores must be an object' };
  }

  // Check all required fields are present
  const requiredFields: (keyof EmotionScores)[] = [
    'happy',
    'sad',
    'angry',
    'fearful',
    'disgusted',
    'surprised',
    'neutral',
  ];

  for (const field of requiredFields) {
    if (typeof scores[field] !== 'number') {
      return {
        valid: false,
        error: `Missing or invalid emotion score: ${field}`,
      };
    }
  }

  // Validate range [0, 1]
  if (!validateEmotionScoresRange(scores)) {
    return {
      valid: false,
      error: 'All emotion scores must be between 0 and 1',
    };
  }

  // Validate sum ≈ 1.0
  if (!validateEmotionScoresSum(scores)) {
    return {
      valid: false,
      error: 'Sum of emotion scores must approximately equal 1.0 (±0.01)',
    };
  }

  return { valid: true };
};
