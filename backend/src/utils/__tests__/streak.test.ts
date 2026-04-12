import { PrismaClient } from '@prisma/client';
import { calculateStreak, calculateDaysDifference } from '../streak';

const prisma = new PrismaClient();

describe('Streak Calculation', () => {
  const testUserId = 'test-user-id';
  const testUserEmail = 'test-streak@example.com';

  beforeEach(async () => {
    // Clean up test data
    await prisma.streak.deleteMany({ where: { userId: testUserId } });
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
    await prisma.streak.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { email: testUserEmail } });
  });

  describe('calculateDaysDifference', () => {
    it('should calculate 0 days for same date', () => {
      const date1 = new Date('2024-01-15T10:00:00Z');
      const date2 = new Date('2024-01-15T20:00:00Z');
      expect(calculateDaysDifference(date1, date2)).toBe(0);
    });

    it('should calculate 1 day for consecutive dates', () => {
      const date1 = new Date('2024-01-15T10:00:00Z');
      const date2 = new Date('2024-01-16T10:00:00Z');
      expect(calculateDaysDifference(date1, date2)).toBe(1);
    });

    it('should calculate multiple days difference', () => {
      const date1 = new Date('2024-01-15T10:00:00Z');
      const date2 = new Date('2024-01-20T10:00:00Z');
      expect(calculateDaysDifference(date1, date2)).toBe(5);
    });

    it('should handle negative difference (date2 before date1)', () => {
      const date1 = new Date('2024-01-20T10:00:00Z');
      const date2 = new Date('2024-01-15T10:00:00Z');
      expect(calculateDaysDifference(date1, date2)).toBe(-5);
    });

    it('should use UTC dates to avoid timezone issues', () => {
      // Test with different timezones
      const date1 = new Date('2024-01-15T23:00:00-05:00'); // 2024-01-16 04:00 UTC
      const date2 = new Date('2024-01-16T01:00:00-05:00'); // 2024-01-16 06:00 UTC
      expect(calculateDaysDifference(date1, date2)).toBe(0); // Same UTC day
    });
  });

  describe('calculateStreak - First Check-in', () => {
    it('should create new streak record with streak 1 for first check-in (Requirement 6.1)', async () => {
      const checkInDate = new Date('2024-01-15T10:00:00Z');
      
      const result = await calculateStreak(testUserId, checkInDate);

      expect(result.userId).toBe(testUserId);
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
      expect(result.lastCheckIn).toEqual(checkInDate);
    });
  });

  describe('calculateStreak - Consecutive Days', () => {
    it('should increment streak by 1 for consecutive day check-in (Requirement 6.2)', async () => {
      // First check-in
      const firstCheckIn = new Date('2024-01-15T10:00:00Z');
      await calculateStreak(testUserId, firstCheckIn);

      // Second check-in (next day)
      const secondCheckIn = new Date('2024-01-16T10:00:00Z');
      const result = await calculateStreak(testUserId, secondCheckIn);

      expect(result.currentStreak).toBe(2);
      expect(result.longestStreak).toBe(2);
      expect(result.lastCheckIn).toEqual(secondCheckIn);
    });

    it('should continue incrementing for multiple consecutive days', async () => {
      const dates = [
        new Date('2024-01-15T10:00:00Z'),
        new Date('2024-01-16T10:00:00Z'),
        new Date('2024-01-17T10:00:00Z'),
        new Date('2024-01-18T10:00:00Z'),
      ];

      let result;
      for (const date of dates) {
        result = await calculateStreak(testUserId, date);
      }

      expect(result!.currentStreak).toBe(4);
      expect(result!.longestStreak).toBe(4);
    });
  });

  describe('calculateStreak - Gap Detection', () => {
    it('should reset streak to 1 when gap > 1 day (Requirement 6.3)', async () => {
      // First check-in
      const firstCheckIn = new Date('2024-01-15T10:00:00Z');
      await calculateStreak(testUserId, firstCheckIn);

      // Second check-in (3 days later)
      const secondCheckIn = new Date('2024-01-18T10:00:00Z');
      const result = await calculateStreak(testUserId, secondCheckIn);

      expect(result.currentStreak).toBe(1);
      expect(result.lastCheckIn).toEqual(secondCheckIn);
    });

    it('should preserve longest streak when current resets', async () => {
      // Build up a streak of 5
      const dates = [
        new Date('2024-01-10T10:00:00Z'),
        new Date('2024-01-11T10:00:00Z'),
        new Date('2024-01-12T10:00:00Z'),
        new Date('2024-01-13T10:00:00Z'),
        new Date('2024-01-14T10:00:00Z'),
      ];

      for (const date of dates) {
        await calculateStreak(testUserId, date);
      }

      // Break the streak
      const afterGap = new Date('2024-01-20T10:00:00Z');
      const result = await calculateStreak(testUserId, afterGap);

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(5); // Preserved
    });
  });

  describe('calculateStreak - Same Day Check-in', () => {
    it('should not change streak for same day check-in (Requirement 6.4)', async () => {
      // First check-in
      const firstCheckIn = new Date('2024-01-15T10:00:00Z');
      await calculateStreak(testUserId, firstCheckIn);

      // Second check-in (same day, different time)
      const secondCheckIn = new Date('2024-01-15T20:00:00Z');
      const result = await calculateStreak(testUserId, secondCheckIn);

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
      expect(result.lastCheckIn).toEqual(secondCheckIn); // Last check-in updated
    });

    it('should not change streak for multiple same day check-ins', async () => {
      const checkIns = [
        new Date('2024-01-15T08:00:00Z'),
        new Date('2024-01-15T12:00:00Z'),
        new Date('2024-01-15T18:00:00Z'),
      ];

      let result;
      for (const checkIn of checkIns) {
        result = await calculateStreak(testUserId, checkIn);
      }

      expect(result!.currentStreak).toBe(1);
      expect(result!.longestStreak).toBe(1);
    });
  });

  describe('calculateStreak - Longest Streak Update', () => {
    it('should update longest streak when current exceeds it (Requirement 6.5)', async () => {
      // Build initial streak of 3
      const initialDates = [
        new Date('2024-01-10T10:00:00Z'),
        new Date('2024-01-11T10:00:00Z'),
        new Date('2024-01-12T10:00:00Z'),
      ];

      for (const date of initialDates) {
        await calculateStreak(testUserId, date);
      }

      // Break the streak
      await calculateStreak(testUserId, new Date('2024-01-20T10:00:00Z'));

      // Build a longer streak of 5
      const newDates = [
        new Date('2024-01-21T10:00:00Z'),
        new Date('2024-01-22T10:00:00Z'),
        new Date('2024-01-23T10:00:00Z'),
        new Date('2024-01-24T10:00:00Z'),
      ];

      let result;
      for (const date of newDates) {
        result = await calculateStreak(testUserId, date);
      }

      expect(result!.currentStreak).toBe(5);
      expect(result!.longestStreak).toBe(5); // Updated from 3 to 5
    });

    it('should not decrease longest streak', async () => {
      // Build streak of 10
      const dates = Array.from({ length: 10 }, (_, i) => 
        new Date(Date.UTC(2024, 0, 10 + i, 10, 0, 0))
      );

      for (const date of dates) {
        await calculateStreak(testUserId, date);
      }

      // Break and start new shorter streak
      await calculateStreak(testUserId, new Date('2024-02-01T10:00:00Z'));
      await calculateStreak(testUserId, new Date('2024-02-02T10:00:00Z'));
      const result = await calculateStreak(testUserId, new Date('2024-02-03T10:00:00Z'));

      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(10); // Still 10
    });
  });

  describe('calculateStreak - UTC Date Handling', () => {
    it('should use UTC dates to avoid timezone issues (Requirement 6.6)', async () => {
      // Check-in at 11 PM EST (4 AM UTC next day)
      const firstCheckIn = new Date('2024-01-15T23:00:00-05:00'); // 2024-01-16 04:00 UTC
      await calculateStreak(testUserId, firstCheckIn);

      // Check-in at 1 AM EST same calendar day (6 AM UTC same day)
      const secondCheckIn = new Date('2024-01-16T01:00:00-05:00'); // 2024-01-16 06:00 UTC
      const result = await calculateStreak(testUserId, secondCheckIn);

      // Should be same day in UTC, so streak should not change
      expect(result.currentStreak).toBe(1);
    });
  });

  describe('calculateStreak - Last Check-in Update', () => {
    it('should update last check-in date (Requirement 6.7)', async () => {
      const firstCheckIn = new Date('2024-01-15T10:00:00Z');
      await calculateStreak(testUserId, firstCheckIn);

      const secondCheckIn = new Date('2024-01-16T15:00:00Z');
      const result = await calculateStreak(testUserId, secondCheckIn);

      expect(result.lastCheckIn).toEqual(secondCheckIn);
    });
  });
});
