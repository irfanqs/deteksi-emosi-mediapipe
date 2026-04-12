import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  createJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from '../journal.controller';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    journal: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    emotionEntry: {
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const prisma = new PrismaClient();

describe('Journal Controller', () => {
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

  describe('createJournalEntry', () => {
    it('should create journal entry with valid data', async () => {
      const emotionEntryId = 'emotion-entry-id';
      mockRequest.body = {
        emotionEntryId,
        textContent: 'Today was a great day!',
      };

      const mockEmotionEntry = {
        id: emotionEntryId,
        userId: 'test-user-id',
        dominantEmotion: 'happy',
      };

      const mockJournal = {
        id: 'journal-id',
        emotionEntryId,
        userId: 'test-user-id',
        textContent: 'Today was a great day!',
        voiceNoteUrl: null,
        photoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEmotionEntry);
      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.journal.create as jest.Mock).mockResolvedValue(mockJournal);

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'journal-id',
          emotionEntryId,
          textContent: 'Today was a great day!',
        })
      );
    });

    it('should create journal entry with voice note URL', async () => {
      const emotionEntryId = 'emotion-entry-id';
      mockRequest.body = {
        emotionEntryId,
        voiceNoteUrl: 'https://example.com/voice.mp3',
      };

      const mockEmotionEntry = {
        id: emotionEntryId,
        userId: 'test-user-id',
        dominantEmotion: 'sad',
      };

      const mockJournal = {
        id: 'journal-id',
        emotionEntryId,
        userId: 'test-user-id',
        textContent: null,
        voiceNoteUrl: 'https://example.com/voice.mp3',
        photoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEmotionEntry);
      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.journal.create as jest.Mock).mockResolvedValue(mockJournal);

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          voiceNoteUrl: 'https://example.com/voice.mp3',
        })
      );
    });

    it('should create journal entry with photo URL', async () => {
      const emotionEntryId = 'emotion-entry-id';
      mockRequest.body = {
        emotionEntryId,
        photoUrl: 'https://example.com/photo.jpg',
      };

      const mockEmotionEntry = {
        id: emotionEntryId,
        userId: 'test-user-id',
        dominantEmotion: 'happy',
      };

      const mockJournal = {
        id: 'journal-id',
        emotionEntryId,
        userId: 'test-user-id',
        textContent: null,
        voiceNoteUrl: null,
        photoUrl: 'https://example.com/photo.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEmotionEntry);
      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.journal.create as jest.Mock).mockResolvedValue(mockJournal);

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          photoUrl: 'https://example.com/photo.jpg',
        })
      );
    });

    it('should return 400 if emotion entry ID is missing', async () => {
      mockRequest.body = {
        textContent: 'Some text',
      };

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Emotion entry ID is required',
      });
    });

    it('should return 404 if emotion entry not found', async () => {
      mockRequest.body = {
        emotionEntryId: 'non-existent-id',
        textContent: 'Some text',
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(null);

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Emotion entry not found',
      });
    });

    it('should return 403 if user does not own emotion entry', async () => {
      mockRequest.body = {
        emotionEntryId: 'emotion-entry-id',
        textContent: 'Some text',
      };

      const mockEmotionEntry = {
        id: 'emotion-entry-id',
        userId: 'different-user-id',
        dominantEmotion: 'happy',
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEmotionEntry);

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Access denied',
      });
    });

    it('should return 400 if journal already exists for emotion entry', async () => {
      const emotionEntryId = 'emotion-entry-id';
      mockRequest.body = {
        emotionEntryId,
        textContent: 'Some text',
      };

      const mockEmotionEntry = {
        id: emotionEntryId,
        userId: 'test-user-id',
        dominantEmotion: 'happy',
      };

      const existingJournal = {
        id: 'existing-journal-id',
        emotionEntryId,
        userId: 'test-user-id',
      };

      (prisma.emotionEntry.findUnique as jest.Mock).mockResolvedValue(mockEmotionEntry);
      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(existingJournal);

      await createJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Journal entry already exists for this emotion entry',
      });
    });
  });

  describe('getJournalEntries', () => {
    it('should retrieve journal entries with pagination', async () => {
      const mockJournals = [
        {
          id: 'journal-1',
          emotionEntryId: 'emotion-1',
          userId: 'test-user-id',
          textContent: 'Entry 1',
          voiceNoteUrl: null,
          photoUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          emotionEntry: {
            dominantEmotion: 'happy',
            timestamp: new Date(),
          },
        },
      ];

      (prisma.journal.findMany as jest.Mock).mockResolvedValue(mockJournals);
      (prisma.journal.count as jest.Mock).mockResolvedValue(1);

      await getJournalEntries(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          journals: expect.arrayContaining([
            expect.objectContaining({
              id: 'journal-1',
              textContent: 'Entry 1',
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

    it('should support custom limit and offset', async () => {
      mockRequest.query = {
        limit: '10',
        offset: '5',
      };

      (prisma.journal.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.journal.count as jest.Mock).mockResolvedValue(20);

      await getJournalEntries(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.journal.findMany).toHaveBeenCalledWith(
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

    it('should order journals by creation date descending', async () => {
      (prisma.journal.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.journal.count as jest.Mock).mockResolvedValue(0);

      await getJournalEntries(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.journal.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
        })
      );
    });
  });

  describe('updateJournalEntry', () => {
    it('should update journal entry text content', async () => {
      mockRequest.params = { id: 'journal-id' };
      mockRequest.body = {
        textContent: 'Updated text',
      };

      const mockJournal = {
        id: 'journal-id',
        emotionEntryId: 'emotion-id',
        userId: 'test-user-id',
        textContent: 'Original text',
        voiceNoteUrl: null,
        photoUrl: null,
      };

      const updatedJournal = {
        ...mockJournal,
        textContent: 'Updated text',
        updatedAt: new Date(),
      };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(mockJournal);
      (prisma.journal.update as jest.Mock).mockResolvedValue(updatedJournal);

      await updateJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          textContent: 'Updated text',
        })
      );
    });

    it('should preserve emotionEntryId when updating', async () => {
      mockRequest.params = { id: 'journal-id' };
      mockRequest.body = {
        textContent: 'Updated text',
      };

      const mockJournal = {
        id: 'journal-id',
        emotionEntryId: 'emotion-id',
        userId: 'test-user-id',
        textContent: 'Original text',
        voiceNoteUrl: null,
        photoUrl: null,
      };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(mockJournal);
      (prisma.journal.update as jest.Mock).mockResolvedValue({
        ...mockJournal,
        textContent: 'Updated text',
        updatedAt: new Date(),
      });

      await updateJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.journal.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'journal-id' },
          data: expect.not.objectContaining({
            emotionEntryId: expect.anything(),
          }),
        })
      );
    });

    it('should return 404 if journal not found', async () => {
      mockRequest.params = { id: 'non-existent-id' };
      mockRequest.body = { textContent: 'Updated text' };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(null);

      await updateJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Journal entry not found',
      });
    });

    it('should return 403 if user does not own journal', async () => {
      mockRequest.params = { id: 'journal-id' };
      mockRequest.body = { textContent: 'Updated text' };

      const mockJournal = {
        id: 'journal-id',
        userId: 'different-user-id',
      };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(mockJournal);

      await updateJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Access denied',
      });
    });
  });

  describe('deleteJournalEntry', () => {
    it('should delete journal entry if user owns it', async () => {
      mockRequest.params = { id: 'journal-id' };

      const mockJournal = {
        id: 'journal-id',
        userId: 'test-user-id',
      };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(mockJournal);
      (prisma.journal.delete as jest.Mock).mockResolvedValue(mockJournal);

      await deleteJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.journal.delete).toHaveBeenCalledWith({
        where: { id: 'journal-id' },
      });
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Journal entry deleted successfully',
      });
    });

    it('should return 404 if journal not found', async () => {
      mockRequest.params = { id: 'non-existent-id' };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(null);

      await deleteJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Journal entry not found',
      });
    });

    it('should return 403 if user does not own journal', async () => {
      mockRequest.params = { id: 'journal-id' };

      const mockJournal = {
        id: 'journal-id',
        userId: 'different-user-id',
      };

      (prisma.journal.findUnique as jest.Mock).mockResolvedValue(mockJournal);

      await deleteJournalEntry(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Access denied',
      });
      expect(prisma.journal.delete).not.toHaveBeenCalled();
    });
  });
});
