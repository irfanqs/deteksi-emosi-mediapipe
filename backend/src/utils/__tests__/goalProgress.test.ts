import { PrismaClient } from '@prisma/client';
import { updateGoalProgress, getStartOfWeek, getEndOfWeek } from '../goalProgress';

const prisma = new PrismaClient();

describe('Goal Progress Calculation', () => {
  const testUserId = 'test-user-goal-id';
  const testUserEmail = 'test-goal@example.com';

  beforeEach(async () => {
    // Clean up test data
    await prisma.emotionEntry.deleteMany({ where: { userId: testUserId } });
    await prisma.goal.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { email: testUserEmail } });
    
    // Create test user
    await prisma.user.create({
      data: {
        id: testUserId,
        email: testUserEmail,
        name: 'Test User',
      },
    });
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.emotionEntry.deleteMany({ where: { userId: testUserId } });
    await prisma.goal.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { email: testUserEmail } });
  });

  describe('getStartOfWeek', () => {
    it('should return Monday for a date in the middle of the week', () => {
      const wednesday = new Date('2024-01-17T15:30:00Z'); // Wednesday
      const monday = getStartOfWeek(wednesday);
      
      expect(monday.getDay()).toBe(1); // Monday
      expect(monday.getDate()).toBe(15); // Jan 15, 2024 is Monday
      expect(monday.getHours()).toBe(0);
      expect(monday.getMinutes()).toBe(0);
      expect(monday.getSeconds()).toBe(0);
    });

    it('should return the same Monday if date is already Monday', () => {
      const monday = new Date('2024-01-15T15:30:00Z'); // Monday
      const result = getStartOfWeek(monday);
      
      expect(result.getDay()).toBe(1);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
    });

    it('should return previous Monday for Sunday', () => {
      const sunday = new Date('2024-01-21T15:30:00Z'); // Sunday
      const monday = getStartOfWeek(sunday);
      
      expect(monday.getDay()).toBe(1);
      expect(monday.getDate()).toBe(15); // Previous Monday
    });
  });

  describe('getEndOfWeek', () => {
    it('should return Sunday for a date in the middle of the week', () => {
      const wednesday = new Date('2024-01-17T15:30:00Z'); // Wednesday
      const sunday = getEndOfWeek(wednesday);
      
      expect(sunday.getDay()).toBe(0); // Sunday
      expect(sunday.getDate()).toBe(21); // Jan 21, 2024 is Sunday
      expect(sunday.getHours()).toBe(23);
      expect(sunday.getMinutes()).toBe(59);
      expect(sunday.getSeconds()).toBe(59);
    });

    it('should return the same Sunday if date is already Sunday', () => {
      const sunday = new Date('2024-01-21T15:30:00Z'); // Sunday
      const result = getEndOfWeek(sunday);
      
      expect(result.getDay()).toBe(0);
      expect(result.getDate()).toBe(21);
      expect(result.getHours()).toBe(23);
    });
  });

  describe('updateGoalProgress - No Matching Goals', () => {
    it('should return empty array when no active goals exist (Requirement 5.5)', async () => {
      // Create emotion entry
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toEqual([]);
    });

    it('should return empty array when goal emotion does not match (Requirement 5.5)', async () => {
      // Create goal for 'sad' emotion
      await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'sad',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
        },
      });

      // Create emotion entry with 'happy' emotion
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toEqual([]);
    });

    it('should return empty array when goal is inactive', async () => {
      // Create inactive goal
      await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: false,
        },
      });

      // Create emotion entry
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toEqual([]);
    });
  });

  describe('updateGoalProgress - Date Range Filtering', () => {
    it('should not update goal when emotion entry is before start date', async () => {
      // Create goal starting Jan 20
      await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-20T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
        },
      });

      // Create emotion entry on Jan 17 (before start date)
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toEqual([]);
    });

    it('should not update goal when emotion entry is after end date', async () => {
      // Create goal ending Jan 20
      await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-01T00:00:00Z'),
          endDate: new Date('2024-01-20T23:59:59Z'),
          isActive: true,
        },
      });

      // Create emotion entry on Jan 25 (after end date)
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-25T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toEqual([]);
    });
  });

  describe('updateGoalProgress - Progress Calculation', () => {
    it('should update progress to 1 for first matching emotion entry (Requirement 5.6, 5.8)', async () => {
      // Create goal
      const goal = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create emotion entry on Wednesday Jan 17
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(goal.id);
      expect(result[0].currentProgress).toBe(1);
    });

    it('should count all matching entries in current week (Requirement 5.7, 5.8)', async () => {
      // Create goal
      const goal = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 5,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create multiple emotion entries in the same week (Jan 15-21)
      await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-15T10:00:00Z'), // Monday
        },
      });

      await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.7,
          sadScore: 0.1,
          angryScore: 0.05,
          fearfulScore: 0.05,
          disgustedScore: 0.03,
          surprisedScore: 0.04,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-16T14:00:00Z'), // Tuesday
        },
      });

      // Create the new entry on Wednesday
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.75,
          sadScore: 0.08,
          angryScore: 0.05,
          fearfulScore: 0.03,
          disgustedScore: 0.03,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'), // Wednesday
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].currentProgress).toBe(3); // All 3 entries in the week
    });

    it('should only count entries from current week, not previous weeks (Requirement 5.7)', async () => {
      // Create goal
      const goal = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 5,
          startDate: new Date('2024-01-01T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create entries in previous week (Jan 8-14)
      await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-10T10:00:00Z'),
        },
      });

      await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-12T10:00:00Z'),
        },
      });

      // Create entry in current week (Jan 15-21)
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].currentProgress).toBe(1); // Only current week entry
    });

    it('should not count entries with different emotions (Requirement 5.8)', async () => {
      // Create goal for 'happy'
      const goal = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 5,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create 'sad' entry in the same week
      await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'sad',
          happyScore: 0.05,
          sadScore: 0.8,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-16T10:00:00Z'),
        },
      });

      // Create 'happy' entry
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].currentProgress).toBe(1); // Only 'happy' entry counted
    });
  });

  describe('updateGoalProgress - Multiple Goals', () => {
    it('should update multiple goals with same target emotion', async () => {
      // Create two goals for 'happy'
      const goal1 = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      const goal2 = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 5,
          startDate: new Date('2024-01-10T00:00:00Z'),
          endDate: new Date('2024-02-10T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create emotion entry
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(2);
      expect(result.find(g => g.id === goal1.id)?.currentProgress).toBe(1);
      expect(result.find(g => g.id === goal2.id)?.currentProgress).toBe(1);
    });

    it('should only update goals matching the emotion', async () => {
      // Create goals for different emotions
      const happyGoal = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      const sadGoal = await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'sad',
          targetFrequency: 2,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create 'happy' emotion entry
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-17T10:00:00Z'),
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(happyGoal.id);
      expect(result[0].currentProgress).toBe(1);

      // Verify sad goal was not updated
      const sadGoalAfter = await prisma.goal.findUnique({
        where: { id: sadGoal.id },
      });
      expect(sadGoalAfter?.currentProgress).toBe(0);
    });
  });

  describe('updateGoalProgress - Week Boundary Cases', () => {
    it('should count entries on Monday (start of week)', async () => {
      // Create goal
      await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create emotion entry on Monday
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-15T00:00:00Z'), // Monday
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].currentProgress).toBe(1);
    });

    it('should count entries on Sunday (end of week)', async () => {
      // Create goal
      await prisma.goal.create({
        data: {
          userId: testUserId,
          targetEmotion: 'happy',
          targetFrequency: 3,
          startDate: new Date('2024-01-15T00:00:00Z'),
          endDate: new Date('2024-01-31T23:59:59Z'),
          isActive: true,
          currentProgress: 0,
        },
      });

      // Create emotion entry on Sunday
      const emotionEntry = await prisma.emotionEntry.create({
        data: {
          userId: testUserId,
          dominantEmotion: 'happy',
          happyScore: 0.8,
          sadScore: 0.05,
          angryScore: 0.05,
          fearfulScore: 0.02,
          disgustedScore: 0.02,
          surprisedScore: 0.03,
          neutralScore: 0.03,
          timestamp: new Date('2024-01-21T23:59:59Z'), // Sunday
        },
      });

      const result = await updateGoalProgress(testUserId, emotionEntry);

      expect(result).toHaveLength(1);
      expect(result[0].currentProgress).toBe(1);
    });
  });
});
