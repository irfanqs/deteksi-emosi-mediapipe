import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Streak Data Interface
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export interface StreakData {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Calculate day difference between two dates using UTC
 * Requirements: 6.6
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (can be negative if date2 is before date1)
 */
export const calculateDaysDifference = (date1: Date, date2: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  
  // Convert to UTC to avoid timezone issues
  const utc1 = Date.UTC(
    date1.getUTCFullYear(),
    date1.getUTCMonth(),
    date1.getUTCDate()
  );
  
  const utc2 = Date.UTC(
    date2.getUTCFullYear(),
    date2.getUTCMonth(),
    date2.getUTCDate()
  );
  
  return Math.floor((utc2 - utc1) / msPerDay);
};

/**
 * Calculate and update user streak based on new check-in
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7
 * 
 * Preconditions:
 * - userId is valid UUID and exists in database
 * - newCheckInDate is valid Date object
 * - User has existing streak record or will create new one
 * 
 * Postconditions:
 * - Returns updated StreakData with current and longest streak
 * - currentStreak increments by 1 if check-in is consecutive day
 * - currentStreak resets to 1 if gap > 1 day
 * - longestStreak updates if currentStreak exceeds it
 * - lastCheckIn is updated to newCheckInDate
 * - Streak data is persisted in database
 * 
 * @param userId - User ID
 * @param newCheckInDate - Date of new check-in
 * @returns Updated streak data
 */
export const calculateStreak = async (
  userId: string,
  newCheckInDate: Date
): Promise<StreakData> => {
  // Step 1: Get existing streak data
  let streakData = await prisma.streak.findUnique({
    where: { userId },
  });

  // Step 2: Initialize if first check-in (Requirement 6.1)
  if (!streakData) {
    streakData = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCheckIn: newCheckInDate,
      },
    });
    return streakData;
  }

  // Step 3: Calculate day difference using UTC (Requirement 6.6)
  const lastCheckIn = new Date(streakData.lastCheckIn);
  const daysDifference = calculateDaysDifference(lastCheckIn, newCheckInDate);

  // Step 4: Update streak based on difference
  let newCurrentStreak: number;

  if (daysDifference === 0) {
    // Same day check-in, no change (Requirement 6.4)
    newCurrentStreak = streakData.currentStreak;
  } else if (daysDifference === 1) {
    // Consecutive day, increment streak (Requirement 6.2)
    newCurrentStreak = streakData.currentStreak + 1;
  } else {
    // Gap detected (> 1 day), reset streak (Requirement 6.3)
    newCurrentStreak = 1;
  }

  // Step 5: Update longest streak if needed (Requirement 6.5)
  const newLongestStreak = Math.max(
    streakData.longestStreak,
    newCurrentStreak
  );

  // Step 6: Save updated streak (Requirement 6.7)
  const updatedStreak = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastCheckIn: newCheckInDate,
    },
  });

  return updatedStreak;
};
