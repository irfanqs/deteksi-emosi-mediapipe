/**
 * Recommendation Generation Utility
 * 
 * This module provides the core logic for generating personalized recommendations
 * based on user emotion and intensity.
 * 
 * Requirements:
 * - 4.1: Generate recommendations based on dominant emotion
 * - 4.2: Include at least one recommendation per category
 * - 4.10: Limit activities to maximum 5 items
 * - 4.11: Limit articles to maximum 3 items
 * - 4.13: Personalize based on user completion history
 */

import { PrismaClient } from '@prisma/client';
import {
  Recommendation,
  EMOTION_TAG_MAP,
  ACTIVITY_RECOMMENDATIONS,
  BREATHING_EXERCISES,
  MUSIC_PLAYLISTS,
  ARTICLE_RECOMMENDATIONS,
  EmotionTag
} from '../data/recommendations';

const prisma = new PrismaClient();

export type EmotionType = 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'fearful' 
  | 'disgusted' 
  | 'surprised' 
  | 'neutral';

export interface RecommendationSet {
  activities: Recommendation[];
  breathingExercises: Recommendation[];
  musicPlaylists: Recommendation[];
  articles: Recommendation[];
}

interface RecommendationWithPriority extends Recommendation {
  priority: number;
}

/**
 * Generate personalized recommendations based on user emotion and intensity
 * 
 * @param userId - User ID for personalization based on completion history
 * @param currentEmotion - The dominant emotion detected
 * @param emotionIntensity - Intensity of the emotion (0-1 range)
 * @returns RecommendationSet with filtered and prioritized recommendations
 * 
 * Preconditions:
 * - currentEmotion is one of 7 valid emotion types
 * - emotionIntensity is in range [0, 1]
 * 
 * Postconditions:
 * - Returns RecommendationSet with at least 1 recommendation per category
 * - Recommendations are appropriate for currentEmotion
 * - Activities limited to 5 items
 * - Articles limited to 3 items
 * - All recommendations have valid structure
 * - Personalization applied based on user completion history
 */
export async function generateRecommendations(
  userId: string,
  currentEmotion: EmotionType,
  emotionIntensity: number
): Promise<RecommendationSet> {
  // Get relevant tags for the current emotion
  const relevantTags = EMOTION_TAG_MAP[currentEmotion] || [];
  
  // Retrieve user completion history for personalization
  const userHistory = await getUserCompletionHistory(userId);
  
  // Filter and prioritize activities
  const filteredActivities = filterAndPrioritize(
    ACTIVITY_RECOMMENDATIONS,
    relevantTags,
    emotionIntensity
  );
  
  // Filter and prioritize breathing exercises
  const filteredBreathing = filterAndPrioritize(
    BREATHING_EXERCISES,
    relevantTags,
    emotionIntensity
  );
  
  // Filter and prioritize music playlists
  const filteredMusic = filterAndPrioritize(
    MUSIC_PLAYLISTS,
    relevantTags,
    emotionIntensity
  );
  
  // Filter and prioritize articles
  const filteredArticles = filterAndPrioritize(
    ARTICLE_RECOMMENDATIONS,
    relevantTags,
    emotionIntensity
  );
  
  // Apply personalization based on user history
  const personalizedActivities = personalizeRecommendations(filteredActivities, userHistory);
  const personalizedBreathing = personalizeRecommendations(filteredBreathing, userHistory);
  const personalizedMusic = personalizeRecommendations(filteredMusic, userHistory);
  const personalizedArticles = personalizeRecommendations(filteredArticles, userHistory);
  
  // Sort by priority and apply limits
  const activities = personalizedActivities
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5)
    .map(removeProperty);
  
  const articles = personalizedArticles
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(removeProperty);
  
  // For breathing and music, take all matching items (no specific limit in requirements)
  const breathingExercises = personalizedBreathing
    .sort((a, b) => b.priority - a.priority)
    .map(removeProperty);
  
  const musicPlaylists = personalizedMusic
    .sort((a, b) => b.priority - a.priority)
    .map(removeProperty);
  
  // Ensure at least 1 recommendation per category
  const result: RecommendationSet = {
    activities: ensureMinimumRecommendations(activities, ACTIVITY_RECOMMENDATIONS, 1),
    breathingExercises: ensureMinimumRecommendations(breathingExercises, BREATHING_EXERCISES, 1),
    musicPlaylists: ensureMinimumRecommendations(musicPlaylists, MUSIC_PLAYLISTS, 1),
    articles: ensureMinimumRecommendations(articles, ARTICLE_RECOMMENDATIONS, 1)
  };
  
  return result;
}

/**
 * Filter recommendations by emotion tags and calculate priority scores
 * 
 * @param recommendations - Array of recommendations to filter
 * @param relevantTags - Tags associated with the current emotion
 * @param emotionIntensity - Intensity of the emotion (0-1)
 * @returns Array of recommendations with priority scores
 */
function filterAndPrioritize(
  recommendations: Recommendation[],
  relevantTags: EmotionTag[],
  emotionIntensity: number
): RecommendationWithPriority[] {
  return recommendations
    .filter(rec => hasMatchingTag(rec, relevantTags))
    .map(rec => ({
      ...rec,
      priority: calculatePriority(rec, relevantTags, emotionIntensity)
    }));
}

/**
 * Check if a recommendation has any matching tags
 * 
 * @param recommendation - Recommendation to check
 * @param relevantTags - Tags to match against
 * @returns True if recommendation has at least one matching tag
 */
function hasMatchingTag(
  recommendation: Recommendation,
  relevantTags: EmotionTag[]
): boolean {
  return recommendation.tags.some(tag => relevantTags.includes(tag));
}

/**
 * Calculate priority score for a recommendation
 * 
 * Priority is based on:
 * - Number of matching tags (more matches = higher priority)
 * - Emotion intensity (higher intensity may prefer certain types)
 * 
 * @param recommendation - Recommendation to score
 * @param relevantTags - Tags associated with current emotion
 * @param emotionIntensity - Intensity of the emotion (0-1)
 * @returns Priority score (higher is better)
 */
function calculatePriority(
  recommendation: Recommendation,
  relevantTags: EmotionTag[],
  emotionIntensity: number
): number {
  // Count matching tags
  const matchingTagCount = recommendation.tags.filter(tag => 
    relevantTags.includes(tag)
  ).length;
  
  // Base priority on matching tags
  let priority = matchingTagCount * 10;
  
  // Adjust priority based on emotion intensity
  // Higher intensity emotions may benefit from more intensive activities
  if (emotionIntensity > 0.7) {
    // Prefer longer duration activities for high intensity
    if (recommendation.duration && recommendation.duration >= 20) {
      priority += 5;
    }
    // Prefer physical activities for high intensity
    if (recommendation.type === 'exercise') {
      priority += 3;
    }
  } else if (emotionIntensity < 0.3) {
    // Prefer shorter, gentler activities for low intensity
    if (recommendation.duration && recommendation.duration <= 10) {
      priority += 5;
    }
    // Prefer meditation and breathing for low intensity
    if (recommendation.type === 'meditation' || recommendation.type === 'breathing') {
      priority += 3;
    }
  }
  
  return priority;
}

/**
 * Remove the priority property from recommendations
 * 
 * @param rec - Recommendation with priority
 * @returns Recommendation without priority
 */
function removeProperty(rec: RecommendationWithPriority): Recommendation {
  const { priority, ...recommendation } = rec;
  return recommendation;
}

/**
 * Ensure minimum number of recommendations in a category
 * If filtered results are insufficient, add fallback recommendations
 * 
 * @param recommendations - Filtered recommendations
 * @param allRecommendations - All available recommendations for fallback
 * @param minimum - Minimum number required
 * @returns Array with at least minimum recommendations
 */
function ensureMinimumRecommendations(
  recommendations: Recommendation[],
  allRecommendations: Recommendation[],
  minimum: number
): Recommendation[] {
  if (recommendations.length >= minimum) {
    return recommendations;
  }
  
  // Add fallback recommendations if needed
  const result = [...recommendations];
  const usedIds = new Set(recommendations.map(r => r.id));
  
  for (const rec of allRecommendations) {
    if (result.length >= minimum) {
      break;
    }
    if (!usedIds.has(rec.id)) {
      result.push(rec);
      usedIds.add(rec.id);
    }
  }
  
  return result;
}

/**
 * Retrieve user completion history from the database
 * 
 * @param userId - User ID to retrieve history for
 * @returns Map of recommendation IDs to their most recent completion date
 */
async function getUserCompletionHistory(
  userId: string
): Promise<Map<string, Date>> {
  try {
    // Query RecommendationCompletion table for user's completion history
    // Get the most recent 100 completions to avoid performance issues
    const completions = await prisma.recommendationCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: 100,
      select: {
        recommendationId: true,
        completedAt: true
      }
    });
    
    // Create a map of recommendation ID to most recent completion date
    const historyMap = new Map<string, Date>();
    
    for (const completion of completions) {
      // Only store the most recent completion for each recommendation
      if (!historyMap.has(completion.recommendationId)) {
        historyMap.set(completion.recommendationId, completion.completedAt);
      }
    }
    
    return historyMap;
  } catch (error) {
    // If there's an error retrieving history, return empty map
    // This ensures recommendation generation continues even if history retrieval fails
    console.error('Error retrieving user completion history:', error);
    return new Map();
  }
}

/**
 * Personalize recommendations based on user completion history
 * 
 * Strategy:
 * - Deprioritize recommendations completed recently (within last 7 days)
 * - Prioritize recommendations the user hasn't tried yet
 * - Keep the existing filtering and priority logic intact
 * 
 * @param recommendations - Recommendations with priority scores
 * @param userHistory - Map of recommendation IDs to completion dates
 * @returns Recommendations with adjusted priority scores
 */
function personalizeRecommendations(
  recommendations: RecommendationWithPriority[],
  userHistory: Map<string, Date>
): RecommendationWithPriority[] {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return recommendations.map(rec => {
    const completionDate = userHistory.get(rec.id);
    
    if (!completionDate) {
      // User hasn't tried this recommendation - prioritize it
      return {
        ...rec,
        priority: rec.priority + 10 // Boost priority for new recommendations
      };
    }
    
    // User has completed this recommendation before
    if (completionDate > sevenDaysAgo) {
      // Completed recently (within last 7 days) - deprioritize significantly
      return {
        ...rec,
        priority: rec.priority - 20 // Reduce priority for recent completions
      };
    } else {
      // Completed more than 7 days ago - slight deprioritization
      return {
        ...rec,
        priority: rec.priority - 5 // Small reduction for older completions
      };
    }
  });
}
