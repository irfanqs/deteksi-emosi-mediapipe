import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  createEmotionEntry,
  getEmotionHistory,
  deleteEmotionEntry,
  calculateDominantEmotion,
} from '../emotion.controller';
import { EmotionScores } from '../../types/emotion.types';

// Mock calculateStreak function
jest.mock('../../utils/streak', () => ({
  calculateStreak: jest.fn().mockResolvedValue({
    id: 'streak-id',
    userId: 'test-user-id',
    currentStreak: 1,
    longestStreak: 1,
    lastCheckIn: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}));

// Mock updateGoalProgress function
jest.mock('../../utils/goalProgress', () => ({
  updateGoalProgress: jest.fn().mockResolvedValue([]),
}));

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    emotionEntry: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('Emotion Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      userId: 'test-user-id',
      body: {},
      query: {},
      params: {},
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    jest.clearAllMocks();
  });

  describe('calculateDominantEmotion', () => {
    it('should return emotion with highest score', () => {
      const scores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      const result = calculateDominantEmotion(scores);
      expect(result).toBe('happy');
    });

    it('should handle neutral as dominant emotion', () => {
      const scores: EmotionScores = {
        happy: 0.1,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1,
        neutral: 0.4,
      };

      const result = calculateDominantEmotion(scores);
      expect(result).toBe('neutral');
    });

    it('should handle equal scores by returning first maximum', () => {
      const scores: EmotionScores = {
        happy: 0.5,
        sad: 0.5,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
        neutral: 0,
      };

      const result = calculateDominantEmotion(scores);
      expect(result).toBe('happy'); // First in the array
    });
  });

  describe('createEmotionEntry', () => {
    it('should create emotion entry with valid data', async () => {
      const emotionScores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      mockRequest.body = { emotionScores };

      const mockEntry = {
        id: 'entry-id',
        userId: 'test-user-id',
        dominantEmotion: 'happy',
        happyScore: 0.7,
        sadScore: 0.1,
        angryScore: 0.05,
        fearfulScore: 0.05,
        disgustedScore: 0.03,
        surprisedScore: 0.02,
        neutralScore: 0.05,
        timestamp: new Date(),
        createdAt: new Date(),
      };

      (prisma.emotionEntry.create as jest.Mock).mockResolvedValue(mockEntry);

      await createEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'entry-id',
          userId: 'test-user-id',
          dominantEmotion: 'happy',
        })
      );
    });

    it('should return 400 if emotion scores are missing', async () => {
      mockRequest.body = {};

      await createEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Emotion scores are required',
      });
    });

    it('should return 400 if emotion scores are out of range', async () => {
      const invalidScores = {
        happy: 1.5, // Invalid: > 1
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      mockRequest.body = { emotionScores: invalidScores };

      await createEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'All emotion scores must be between 0 and 1',
      });
    });

    it('should return 400 if emotion scores sum is invalid', async () => {
      const invalidScores: EmotionScores = {
        happy: 0.5,
        sad: 0.1,
        angry: 0.1,
        fearful: 0.1,
        disgusted: 0.1,
        surprised: 0.1,
        neutral: 0.5, // Sum = 1.4, invalid
      };

      mockRequest.body = { emotionScores: invalidScores };

      await createEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Sum of emotion scores must approximately equal 1.0 (±0.01)',
      });
    });

    it('should use provided timestamp', async () => {
      const emotionScores: EmotionScores = {
        happy: 0.7,
        sad: 0.1,
        angry: 0.05,
        fearful: 0.05,
        disgusted: 0.03,
        surprised: 0.02,
        neutral: 0.05,
      };

      const customTimestamp = new Date('2024-01-15T10:00:00Z');
      mockRequest.body = { emotionScores, timestamp: customTimestamp.toISOString() };

      const mockEntry = {
        id: 'entry-id',
        userId: 'test-user-id',
        dominantEmotion: 'happy',
        happyScore: 0.7,
        sadScore: 0.1,
        angryScore: 0.05,
        fearfulScore: 0.05,
        disgustedScore: 0.03,
        surprisedScore: 0.02,
        neutralScore: 0.05,
        timestamp: customTimestamp,
        createdAt: new Date(),
      };

      (prisma.emotionEntry.create as jest.Mock).mockResolvedValue(mockEntry);

      await createEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.emotionEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            timestamp: customTimestamp,
          }),
        })
      );
    });
  });

  describe('getEmotionHistory', () => {
    it('should retrieve emotion history with pagination', async () => {
      const mockEntries = [
        {
          id: 'entry-1',
          userId: 'test-user-id',
          dominantEmotion: 'happy',
          happyScore: 0.7,
          sadScore: 0.1,
          angryScore: 0.05,
          fearfulScore: 0.05,
          disgustedScore: 0.03,
          surprisedScore: 0.02,
          neutralScore: 0.05,
          timestamp: new Date(),
          createdAt: new Date(),
        },
      ];

      (prisma.emotionEntry.findMany as jest.Mock).mockResolvedValue(mockEntries);
      (prisma.emotionEntry.count as jest.Mock).mockResolvedValue(1);

      await getEmotionHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          entries: expect.arrayContaining([
            expect.objectContaining({
              id: 'entry-1',
              dominantEmotion: 'happy',
            }),
          ]),
          pagination: expect.objectContaining({
            total: 1,
            limit: 50,
            offset: 0,
          }),
        })
      );
    });

    it('should filter by date range', async () => {
      mockRequest.query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      (prisma.emotionEntry.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.emotionEntry.count as jest.Mock).mockResolvedValue(0);

      await getEmotionHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.emotionEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            timestamp: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        })
      );
    });

    it('should support custom limit and offset', async () => {
      mockRequest.query = {
        limit: '10',
        offset: '5',
      };

      (prisma.emotionEntry.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.emotionEntry.count as jest.Mock).mockResolvedValue(20);

      await getEmotionHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.emotionEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 5,
        })
      );

      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            total: 20,
            limit: 10,
            offset: 5,
            hasMore: true,
          }),
        })
      );
    });
  });

  describe('deleteEmotionEntry', () => {
    it('should delete emotion entry if user owns it', async () => {
      mockRequest.params = { id: 'entry-id' };

      const mockEntry = {
        id: 'entry-id',
        userId: 'test-user-id',
        dominantEmotion: 'happy',
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEntry);
      (prisma.emotionEntry.delete as jest.Mock).mockResolvedValue(mockEntry);

      await deleteEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.emotionEntry.delete).toHaveBeenCalledWith({
        where: { id: 'entry-id' },
      });
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Emotion entry deleted successfully',
      });
    });

    it('should return 404 if entry not found', async () => {
      mockRequest.params = { id: 'non-existent-id' };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(null);

      await deleteEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Emotion entry not found',
      });
    });

    it('should return 403 if user does not own entry', async () => {
      mockRequest.params = { id: 'entry-id' };

      const mockEntry = {
        id: 'entry-id',
        userId: 'different-user-id', // Different user
        dominantEmotion: 'happy',
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEntry);

      await deleteEmotionEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Access denied',
      });
      expect(prisma.emotionEntry.delete).not.toHaveBeenCalled();
    });
  });
});
