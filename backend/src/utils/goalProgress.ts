import { PrismaClient, EmotionEntry } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get the start of the week (Monday) for a given date
 * Requirements: 5.7
 * 
 * @param date - Date to get week start for
 * @returns Date object representing Monday 00:00:00 of the week
 */
export const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  // Calculate difference to Monday (day 1)
  // If Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Get the end of the week (Sunday) for a given date
 * Requirements: 5.7
 * 
 * @param date - Date to get week end for
 * @returns Date object representing Sunday 23:59:59 of the week
 */
export const getEndOfWeek = (date: Date): Date => {
  const start = getStartOfWeek(date);
  const sunday = new Date(start);
  sunday.setDate(start.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
};

/**
 * Update goal progress based on emotion entry
 * Requirements: 5.5, 5.6, 5.7, 5.8
 * 
 * This function:
 * 1. Takes userId and emotionEntry as parameters
 * 2. Finds all active goals for the user where targetEmotion matches the emotion entry's dominantEmotion
 * 3. Counts emotion entries for the current week (Monday-Sunday) that match the goal's target emotion
 * 4. Updates the goal's currentProgress with the count
 * 
 * Preconditions:
 * - userId is valid UUID and exists in database
 * - emotionEntry is valid and persisted EmotionEntry
 * - Active goals exist for user (may be empty array)
 * 
 * Postconditions:
 * - Returns array of updated goals (may be empty)
 * - Progress is recalculated based on current week's entries
 * - Only goals matching emotion are updated
 * - Goals outside date range are ignored
 * - Database reflects updated progress
 * 
 * @param userId - User ID
 * @param emotionEntry - The emotion entry that was just saved
 * @returns Array of updated goals
 */
export const updateGoalProgress = async (
  userId: string,
  emotionEntry: EmotionEntry
): Promise<any[]> => {
  // Step 1: Get all active goals for user that match the emotion and are within date range
  // Requirements: 5.5, 5.6
  const activeGoals = await prisma.goal.findMany({
    where: {
      userId,
      isActive: true,
      targetEmotion: emotionEntry.dominantEmotion,
      startDate: { lte: emotionEntry.timestamp },
      endDate: { gte: emotionEntry.timestamp },
    },
  });

  // Step 2: If no matching goals, return empty array
  if (activeGoals.length === 0) {
    return [];
  }

  // Step 3: Calculate current week boundaries (Monday-Sunday)
  // Requirements: 5.7
  const weekStart = getStartOfWeek(emotionEntry.timestamp);
  const weekEnd = getEndOfWeek(emotionEntry.timestamp);

  // Step 4: Update progress for each matching goal
  const updatedGoals: any[] = [];

  for (const goal of activeGoals) {
    // Count emotion entries for current week that match the goal's target emotion
    // Requirements: 5.7, 5.8
    const weeklyEntries = await prisma.emotionEntry.count({
      where: {
        userId,
        dominantEmotion: goal.targetEmotion,
        timestamp: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Update the goal's current progress
    // Requirements: 5.6
    const updatedGoal = await prisma.goal.update({
      where: { id: goal.id },
      data: {
        currentProgress: weeklyEntries,
      },
    });

    updatedGoals.push(updatedGoal);
  }

  return updatedGoals;
};
