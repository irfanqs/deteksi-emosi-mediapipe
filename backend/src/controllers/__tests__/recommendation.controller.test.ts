import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  getRecommendations,
  markRecommendationCompleted
} from '../recommendation.controller';
import * as recommendationUtils from '../../utils/recommendations';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    recommendationCompletion: {
      create: jest.fn()
    }
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

// Mock recommendation utils
jest.mock('../../utils/recommendations');

const prisma = new PrismaClient();

describe('Recommendation Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    
    mockRequest = {
      userId: 'test-user-id',
      query: {},
      body: {}
    };
    
    mockResponse = {
      json: jsonMock,
      status: statusMock
    };

    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    it('should generate recommendations for valid emotion', async () => {
      // Arrange
      mockRequest.query = { emotion: 'happy', intensity: '0.7' };
      
      const mockRecommendations = {
        activities: [
          {
            id: 'act-001',
            type: 'meditation',
            title: 'Gratitude Meditation',
            description: 'Test description',
            duration: 10,
            tags: ['gratitude']
          }
        ],
        breathingExercises: [
          {
            id: 'breath-001',
            type: 'breathing',
            title: 'Energizing Breath',
            description: 'Test description',
            duration: 5,
            tags: ['celebration']
          }
        ],
        musicPlaylists: [
          {
            id: 'music-001',
            type: 'music',
            title: 'Celebration Vibes',
            description: 'Test description',
            url: 'https://example.com',
            tags: ['celebration']
          }
        ],
        articles: [
          {
            id: 'article-001',
            type: 'article',
            title: 'The Science of Gratitude',
            description: 'Test description',
            url: 'https://example.com',
            tags: ['gratitude']
          }
        ]
      };

      (recommendationUtils.generateRecommendations as jest.Mock).mockResolvedValue(
        mockRecommendations
      );

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(recommendationUtils.generateRecommendations).toHaveBeenCalledWith(
        'test-user-id',
        'happy',
        0.7
      );
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          emotion: 'happy',
          intensity: 0.7,
          recommendations: mockRecommendations,
          generatedAt: expect.any(Date)
        })
      );
    });

    it('should use default intensity of 0.5 when not provided', async () => {
      // Arrange
      mockRequest.query = { emotion: 'sad' };
      
      const mockRecommendations = {
        activities: [],
        breathingExercises: [],
        musicPlaylists: [],
        articles: []
      };

      (recommendationUtils.generateRecommendations as jest.Mock).mockResolvedValue(
        mockRecommendations
      );

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(recommendationUtils.generateRecommendations).toHaveBeenCalledWith(
        'test-user-id',
        'sad',
        0.5
      );
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          emotion: 'sad',
          intensity: 0.5
        })
      );
    });

    it('should return 400 if emotion is missing', async () => {
      // Arrange
      mockRequest.query = {};

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Emotion parameter is required'
      });
    });

    it('should return 400 if emotion is invalid', async () => {
      // Arrange
      mockRequest.query = { emotion: 'invalid-emotion' };

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: expect.stringContaining('Invalid emotion')
      });
    });

    it('should return 400 if intensity is out of range', async () => {
      // Arrange
      mockRequest.query = { emotion: 'happy', intensity: '1.5' };

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Intensity must be a number between 0 and 1'
      });
    });

    it('should return 400 if intensity is negative', async () => {
      // Arrange
      mockRequest.query = { emotion: 'happy', intensity: '-0.5' };

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Intensity must be a number between 0 and 1'
      });
    });

    it('should return 500 if recommendation generation fails', async () => {
      // Arrange
      mockRequest.query = { emotion: 'happy' };
      (recommendationUtils.generateRecommendations as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      // Act
      await getRecommendations(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to generate recommendations'
      });
    });
  });

  describe('markRecommendationCompleted', () => {
    it('should mark recommendation as completed', async () => {
      // Arrange
      mockRequest.body = {
        recommendationId: 'act-001',
        recommendationType: 'meditation'
      };

      const mockCompletion = {
        id: 'completion-id',
        userId: 'test-user-id',
        recommendationId: 'act-001',
        recommendationType: 'meditation',
        completedAt: new Date('2024-01-01T12:00:00Z')
      };

      (prisma.recommendationCompletion.create as jest.Mock).mockResolvedValue(
        mockCompletion
      );

      // Act
      await markRecommendationCompleted(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(prisma.recommendationCompletion.create).toHaveBeenCalledWith({
        data: {
          userId: 'test-user-id',
          recommendationId: 'act-001',
          recommendationType: 'meditation',
          completedAt: expect.any(Date)
        }
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        id: 'completion-id',
        userId: 'test-user-id',
        recommendationId: 'act-001',
        recommendationType: 'meditation',
        completedAt: mockCompletion.completedAt
      });
    });

    it('should return 400 if recommendationId is missing', async () => {
      // Arrange
      mockRequest.body = {
        recommendationType: 'meditation'
      };

      // Act
      await markRecommendationCompleted(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Recommendation ID is required'
      });
    });

    it('should return 400 if recommendationType is missing', async () => {
      // Arrange
      mockRequest.body = {
        recommendationId: 'act-001'
      };

      // Act
      await markRecommendationCompleted(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Recommendation type is required'
      });
    });

    it('should return 400 if recommendationType is invalid', async () => {
      // Arrange
      mockRequest.body = {
        recommendationId: 'act-001',
        recommendationType: 'invalid-type'
      };

      // Act
      await markRecommendationCompleted(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: expect.stringContaining('Invalid recommendation type')
      });
    });

    it('should return 500 if database operation fails', async () => {
      // Arrange
      mockRequest.body = {
        recommendationId: 'act-001',
        recommendationType: 'meditation'
      };

      (prisma.recommendationCompletion.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      // Act
      await markRecommendationCompleted(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Failed to mark recommendation as completed'
      });
    });

    it('should accept all valid recommendation types', async () => {
      // Arrange
      const validTypes = ['meditation', 'exercise', 'journaling', 'breathing', 'music', 'article'];
      
      for (const type of validTypes) {
        jest.clearAllMocks();
        
        mockRequest.body = {
          recommendationId: 'test-id',
          recommendationType: type
        };

        const mockCompletion = {
          id: 'completion-id',
          userId: 'test-user-id',
          recommendationId: 'test-id',
          recommendationType: type,
          completedAt: new Date()
        };

        (prisma.recommendationCompletion.create as jest.Mock).mockResolvedValue(
          mockCompletion
        );

        // Act
        await markRecommendationCompleted(
          mockRequest as Request,
          mockResponse as Response
        );

        // Assert
        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith(
          expect.objectContaining({
            recommendationType: type
          })
        );
      }
    });
  });
});
