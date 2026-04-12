import {
  validateEmotionScoresRange,
  validateEmotionScoresSum,
  validateDominantEmotion,
  validateEmotionScores,
} from '../validation';
import { EmotionScores } from '../../types/emotion.types';

describe('Validation Utilities', () => {
  describe('validateEmotionScoresRange', () => {
    it('should return true for valid scores in range [0, 1]', () => {
      const scores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      expect(validateEmotionScoresRange(scores)).toBe(true);
    });

    it('should return true for boundary values 0 and 1', () => {
      const scores: EmotionScores = {
        happy: 1.0,
        sad: 0.0,
        angry: 0.0,
        fearful: 0.0,
        disgusted: 0.0,
        surprised: 0.0,
        neutral: 0.0,
      };

      expect(validateEmotionScoresRange(scores)).toBe(true);
    });

    it('should return false for scores above 1', () => {
      const scores: EmotionScores = {
        happy: 1.5,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      expect(validateEmotionScoresRange(scores)).toBe(false);
    });

    it('should return false for negative scores', () => {
      const scores: EmotionScores = {
        happy: 0.7,
        sad: -0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      expect(validateEmotionScoresRange(scores)).toBe(false);
    });
  });

  describe('validateEmotionScoresSum', () => {
    it('should return true for sum exactly 1.0', () => {
      const scores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      expect(validateEmotionScoresSum(scores)).toBe(true);
    });

    it('should return true for sum within tolerance (1.0 + 0.01)', () => {
      const scores: EmotionScores = {
        happy: 0.505,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1,
        neutral: 0.005, // Sum = 1.01
      };

      expect(validateEmotionScoresSum(scores)).toBe(true);
    });

    it('should return true for sum within tolerance (1.0 - 0.01)', () => {
      const scores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.04, // Sum = 0.99
      };

      expect(validateEmotionScoresSum(scores)).toBe(true);
    });

    it('should return false for sum outside tolerance', () => {
      const scores: EmotionScores = {
        happy: 0.5,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1,
        neutral: 0.5, // Sum = 1.4
      };

      expect(validateEmotionScoresSum(scores)).toBe(false);
    });

    it('should return false for sum significantly below 1.0', () => {
      const scores: EmotionScores = {
        happy: 0.1,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1,
        neutral: 0.1, // Sum = 0.7
      };

      expect(validateEmotionScoresSum(scores)).toBe(false);
    });
  });

  describe('validateDominantEmotion', () => {
    it('should return true for valid emotion types', () => {
      expect(validateDominantEmotion('happy')).toBe(true);
      expect(validateDominantEmotion('sad')).toBe(true);
      expect(validateDominantEmotion('angry')).toBe(true);
      expect(validateDominantEmotion('fearful')).toBe(true);
      expect(validateDominantEmotion('disgusted')).toBe(true);
      expect(validateDominantEmotion('surprised')).toBe(true);
      expect(validateDominantEmotion('neutral')).toBe(true);
    });

    it('should return false for invalid emotion types', () => {
      expect(validateDominantEmotion('excited')).toBe(false);
      expect(validateDominantEmotion('confused')).toBe(false);
      expect(validateDominantEmotion('')).toBe(false);
      expect(validateDominantEmotion('HAPPY')).toBe(false);
    });
  });

  describe('validateEmotionScores', () => {
    it('should return valid for complete valid scores', () => {
      const scores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      const result = validateEmotionScores(scores);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return error for null scores', () => {
      const result = validateEmotionScores(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Emotion scores must be an object');
    });

    it('should return error for missing fields', () => {
      const incompleteScores = {
        happy: 0.7,
        sad: 0.1,
        // Missing other fields
      };

      const result = validateEmotionScores(incompleteScores);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing or invalid emotion score');
    });

    it('should return error for non-number values', () => {
      const invalidScores = {
        happy: '0.7', // String instead of number
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      const result = validateEmotionScores(invalidScores);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing or invalid emotion score');
    });

    it('should return error for out of range scores', () => {
      const outOfRangeScores = {
        happy: 1.5,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      const result = validateEmotionScores(outOfRangeScores);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('All emotion scores must be between 0 and 1');
    });

    it('should return error for invalid sum', () => {
      const invalidSumScores: EmotionScores = {
        happy: 0.5,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1,
        neutral: 0.5, // Sum = 1.4
      };

      const result = validateEmotionScores(invalidSumScores);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        'Sum of emotion scores must approximately equal 1.0 (±0.01)'
      );
    });
  });
});
