import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Journal Controller
 * Handles journal entry creation, retrieval, update, and deletion
 * Requirements: 3.1, 3.2, 3.6, 3.7
 */

/**
 * POST /api/journals
 * Create a new journal entry
 * Requirements: 3.1, 3.2
 */
export const createJournalEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!; // Set by authenticate middleware
    const { emotionEntryId, textContent, voiceNoteUrl, photoUrl } = req.body;

    // Validate required fields
    if (!emotionEntryId) {
      res.status(400).json({ error: 'Emotion entry ID is required' });
      return;
    }

    // Verify emotion entry exists and belongs to user
    const emotionEntry = await prisma.emotionEntry.findUnique({
      where: { id: emotionEntryId },
    });

    if (!emotionEntry) {
      res.status(404).json({ error: 'Emotion entry not found' });
      return;
    }

    if (emotionEntry.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Check if journal already exists for this emotion entry
    const existingJournal = await prisma.journal.findUnique({
      where: { emotionEntryId },
    });

    if (existingJournal) {
      res.status(400).json({ error: 'Journal entry already exists for this emotion entry' });
      return;
    }

    // Create journal entry
    const journal = await prisma.journal.create({
      data: {
        emotionEntryId,
        userId,
        textContent: textContent || null,
        voiceNoteUrl: voiceNoteUrl || null,
        photoUrl: photoUrl || null,
      },
    });

    res.status(201).json({
      id: journal.id,
      emotionEntryId: journal.emotionEntryId,
      userId: journal.userId,
      textContent: journal.textContent,
      voiceNoteUrl: journal.voiceNoteUrl,
      photoUrl: journal.photoUrl,
      createdAt: journal.createdAt,
      updatedAt: journal.updatedAt,
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
};

/**
 * GET /api/journals
 * Retrieve journal entries with pagination
 * Requirements: 3.6
 */
export const getJournalEntries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { limit = '50', offset = '0' } = req.query;

    // Parse pagination parameters
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    // Fetch journal entries ordered by creation date
    const journals = await prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limitNum,
      skip: offsetNum,
      include: {
        emotionEntry: {
          select: {
            dominantEmotion: true,
            timestamp: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await prisma.journal.count({ where: { userId } });

    res.json({
      journals,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

/**
 * PUT /api/journals/:id
 * Update a journal entry
 * Requirements: 3.7
 */
export const updateJournalEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { textContent, voiceNoteUrl, photoUrl } = req.body;

    // Verify the journal exists and belongs to the user
    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal) {
      res.status(404).json({ error: 'Journal entry not found' });
      return;
    }

    if (journal.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update journal entry (preserve emotionEntryId)
    const updatedJournal = await prisma.journal.update({
      where: { id },
      data: {
        textContent: textContent !== undefined ? textContent : journal.textContent,
        voiceNoteUrl: voiceNoteUrl !== undefined ? voiceNoteUrl : journal.voiceNoteUrl,
        photoUrl: photoUrl !== undefined ? photoUrl : journal.photoUrl,
      },
    });

    res.json({
      id: updatedJournal.id,
      emotionEntryId: updatedJournal.emotionEntryId,
      userId: updatedJournal.userId,
      textContent: updatedJournal.textContent,
      voiceNoteUrl: updatedJournal.voiceNoteUrl,
      photoUrl: updatedJournal.photoUrl,
      createdAt: updatedJournal.createdAt,
      updatedAt: updatedJournal.updatedAt,
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
};

/**
 * DELETE /api/journals/:id
 * Delete a journal entry
 * Requirements: 3.1
 */
export const deleteJournalEntry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify the journal exists and belongs to the user
    const journal = await prisma.journal.findUnique({
      where: { id },
    });

    if (!journal) {
      res.status(404).json({ error: 'Journal entry not found' });
      return;
    }

    if (journal.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete the journal entry
    await prisma.journal.delete({
      where: { id },
    });

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
};
