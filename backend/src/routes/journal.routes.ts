import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  createJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from '../controllers/journal.controller';

/**
 * Journal Routes
 * All routes require authentication
 * Requirements: 3.1, 3.2, 3.6, 3.7
 */

const router = Router();

// All journal routes require authentication
router.use(authenticate);

/**
 * POST /api/journals
 * Create a new journal entry
 * Requirements: 3.1, 3.2
 */
router.post('/', createJournalEntry);

/**
 * GET /api/journals
 * Retrieve journal entries with pagination
 * Requirements: 3.6
 */
router.get('/', getJournalEntries);

/**
 * PUT /api/journals/:id
 * Update a journal entry
 * Requirements: 3.7
 */
router.put('/:id', updateJournalEntry);

/**
 * DELETE /api/journals/:id
 * Delete a journal entry
 * Requirements: 3.1
 */
router.delete('/:id', deleteJournalEntry);

export default router;
