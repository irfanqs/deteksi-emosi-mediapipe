import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getStreakData } from '../streak.controller';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    streak: {
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('Streak Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      userId: 'test-user-id',
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    jest.clearAllMocks();
  });

  describe('getStreakData', () => {
    it('should return streak data for user', async () => {
      const mockStreakData = {
        id: 'streak-id',
        userId: 'test-user-id',
        currentStreak: 5,
        longestStreak: 10,
        lastCheckIn: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.streak.findUnique as jest.Mock).mockResolvedValue(mockStreakData);

      await getStreakData(mockRequest as Request, mockResponse as Response);

      expect(prisma.streak.findUnique).toHaveBeenCalledWith({
        where: { userId: 'test-user-id' },
      });

      expect(responseJson).toHaveBeenCalledWith({
        currentStreak: 5,
        longestStreak: 10,
        lastCheckIn: new Date('2024-01-15'),
      });
    });

    it('should return default values if no streak data exists', async () => {
      (prisma.streak.findUnique as jest.Mock).mockResolvedValue(null);

      await getStreakData(mockRequest as Request, mockResponse as Response);

      expect(responseJson).toHaveBeenCalledWith({
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
      });
    });

    it('should handle database errors', async () => {
      (prisma.streak.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await getStreakData(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Failed to fetch streak data',
      });
    });
  });
});
