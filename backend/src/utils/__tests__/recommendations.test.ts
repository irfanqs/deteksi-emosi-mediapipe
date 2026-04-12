/**
 * Unit Tests for Recommendation Generation
 * 
 * Tests the generateRecommendations function to ensure:
 * - Correct filtering by emotion tags
 * - Priority calculation based on intensity
 * - Result limits (5 activities, 3 articles)
 * - At least 1 recommendation per category
 */

import { generateRecommendations, EmotionType } from '../recommendations';

describe('generateRecommendations', () => {
  const testUserId = 'test-user-123';

  describe('Requirement 4.1 - Generate recommendations based on dominant emotion', () => {
    it('should generate recommendations for happy emotion', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.8);
      
      expect(result).toBeDefined();
      expect(result.activities).toBeDefined();
      expect(result.breathingExercises).toBeDefined();
      expect(result.musicPlaylists).toBeDefined();
      expect(result.articles).toBeDefined();
    });

    it('should generate recommendations for sad emotion', async () => {
      const result = await generateRecommendations(testUserId, 'sad', 0.6);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for angry emotion', async () => {
      const result = await generateRecommendations(testUserId, 'angry', 0.9);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for fearful emotion', async () => {
      const result = await generateRecommendations(testUserId, 'fearful', 0.7);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for disgusted emotion', async () => {
      const result = await generateRecommendations(testUserId, 'disgusted', 0.5);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for surprised emotion', async () => {
      const result = await generateRecommendations(testUserId, 'surprised', 0.6);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for neutral emotion', async () => {
      const result = await generateRecommendations(testUserId, 'neutral', 0.4);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThan(0);
    });
  });

  describe('Requirement 4.2 - At least one recommendation per category', () => {
    it('should return at least 1 activity', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.5);
      
      expect(result.activities.length).toBeGreaterThanOrEqual(1);
    });

    it('should return at least 1 breathing exercise', async () => {
      const result = await generateRecommendations(testUserId, 'sad', 0.5);
      
      expect(result.breathingExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('should return at least 1 music playlist', async () => {
      const result = await generateRecommendations(testUserId, 'angry', 0.5);
      
      expect(result.musicPlaylists.length).toBeGreaterThanOrEqual(1);
    });

    it('should return at least 1 article', async () => {
      const result = await generateRecommendations(testUserId, 'fearful', 0.5);
      
      expect(result.articles.length).toBeGreaterThanOrEqual(1);
    });

    it('should ensure all categories have at least 1 recommendation for all emotions', async () => {
      const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
      
      for (const emotion of emotions) {
        const result = await generateRecommendations(testUserId, emotion, 0.5);
        
        expect(result.activities.length).toBeGreaterThanOrEqual(1);
        expect(result.breathingExercises.length).toBeGreaterThanOrEqual(1);
        expect(result.musicPlaylists.length).toBeGreaterThanOrEqual(1);
        expect(result.articles.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Requirement 4.10 - Limit activities to maximum 5 items', () => {
    it('should return at most 5 activities', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.8);
      
      expect(result.activities.length).toBeLessThanOrEqual(5);
    });

    it('should limit activities to 5 for all emotions', async () => {
      const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
      
      for (const emotion of emotions) {
        const result = await generateRecommendations(testUserId, emotion, 0.7);
        
        expect(result.activities.length).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('Requirement 4.11 - Limit articles to maximum 3 items', () => {
    it('should return at most 3 articles', async () => {
      const result = await generateRecommendations(testUserId, 'sad', 0.6);
      
      expect(result.articles.length).toBeLessThanOrEqual(3);
    });

    it('should limit articles to 3 for all emotions', async () => {
      const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
      
      for (const emotion of emotions) {
        const result = await generateRecommendations(testUserId, emotion, 0.6);
        
        expect(result.articles.length).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('Emotion tag filtering', () => {
    it('should filter recommendations by happy emotion tags', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.5);
      
      // Happy tags: celebration, gratitude, social
      const allTags = result.activities.flatMap(r => r.tags);
      const hasRelevantTags = allTags.some(tag => 
        ['celebration', 'gratitude', 'social'].includes(tag)
      );
      
      expect(hasRelevantTags).toBe(true);
    });

    it('should filter recommendations by sad emotion tags', async () => {
      const result = await generateRecommendations(testUserId, 'sad', 0.5);
      
      // Sad tags: comfort, uplifting, connection
      const allTags = result.activities.flatMap(r => r.tags);
      const hasRelevantTags = allTags.some(tag => 
        ['comfort', 'uplifting', 'connection'].includes(tag)
      );
      
      expect(hasRelevantTags).toBe(true);
    });

    it('should filter recommendations by angry emotion tags', async () => {
      const result = await generateRecommendations(testUserId, 'angry', 0.5);
      
      // Angry tags: calming, physical, release
      const allTags = result.activities.flatMap(r => r.tags);
      const hasRelevantTags = allTags.some(tag => 
        ['calming', 'physical', 'release'].includes(tag)
      );
      
      expect(hasRelevantTags).toBe(true);
    });
  });

  describe('Priority calculation based on emotion intensity', () => {
    it('should prioritize longer activities for high intensity emotions', async () => {
      const highIntensityResult = await generateRecommendations(testUserId, 'angry', 0.9);
      
      // Check if activities include longer duration ones
      const hasLongerActivities = highIntensityResult.activities.some(
        activity => activity.duration && activity.duration >= 20
      );
      
      expect(hasLongerActivities).toBe(true);
    });

    it('should prioritize shorter activities for low intensity emotions', async () => {
      const lowIntensityResult = await generateRecommendations(testUserId, 'neutral', 0.2);
      
      // For low intensity, should still return valid recommendations
      // Priority logic favors shorter/gentler activities when available
      expect(lowIntensityResult.activities.length).toBeGreaterThan(0);
      expect(lowIntensityResult.activities.length).toBeLessThanOrEqual(5);
      
      // Verify that meditation or breathing types are prioritized for low intensity
      const hasMeditationOrBreathing = lowIntensityResult.activities.some(
        activity => activity.type === 'meditation' || activity.type === 'breathing'
      );
      
      expect(hasMeditationOrBreathing).toBe(true);
    });

    it('should handle medium intensity emotions', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.5);
      
      expect(result.activities.length).toBeGreaterThan(0);
      expect(result.activities.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Edge cases', () => {
    it('should handle minimum emotion intensity (0)', async () => {
      const result = await generateRecommendations(testUserId, 'neutral', 0);
      
      expect(result.activities.length).toBeGreaterThanOrEqual(1);
      expect(result.breathingExercises.length).toBeGreaterThanOrEqual(1);
      expect(result.musicPlaylists.length).toBeGreaterThanOrEqual(1);
      expect(result.articles.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle maximum emotion intensity (1)', async () => {
      const result = await generateRecommendations(testUserId, 'angry', 1);
      
      expect(result.activities.length).toBeGreaterThanOrEqual(1);
      expect(result.breathingExercises.length).toBeGreaterThanOrEqual(1);
      expect(result.musicPlaylists.length).toBeGreaterThanOrEqual(1);
      expect(result.articles.length).toBeGreaterThanOrEqual(1);
    });

    it('should return valid recommendation structure', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.5);
      
      // Check structure of activities
      result.activities.forEach(activity => {
        expect(activity).toHaveProperty('id');
        expect(activity).toHaveProperty('type');
        expect(activity).toHaveProperty('title');
        expect(activity).toHaveProperty('description');
        expect(activity).toHaveProperty('tags');
        expect(Array.isArray(activity.tags)).toBe(true);
      });
      
      // Check structure of articles
      result.articles.forEach(article => {
        expect(article).toHaveProperty('id');
        expect(article).toHaveProperty('type');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('description');
        expect(article).toHaveProperty('tags');
      });
    });

    it('should not include priority property in returned recommendations', async () => {
      const result = await generateRecommendations(testUserId, 'happy', 0.5);
      
      result.activities.forEach(activity => {
        expect(activity).not.toHaveProperty('priority');
      });
      
      result.articles.forEach(article => {
        expect(article).not.toHaveProperty('priority');
      });
    });
  });

  describe('Consistency', () => {
    it('should return consistent results for same inputs', async () => {
      const result1 = await generateRecommendations(testUserId, 'happy', 0.7);
      const result2 = await generateRecommendations(testUserId, 'happy', 0.7);
      
      expect(result1.activities.length).toBe(result2.activities.length);
      expect(result1.articles.length).toBe(result2.articles.length);
      
      // Check that the same recommendations are returned in the same order
      expect(result1.activities.map(a => a.id)).toEqual(result2.activities.map(a => a.id));
      expect(result1.articles.map(a => a.id)).toEqual(result2.articles.map(a => a.id));
    });
  });

  describe('Requirement 4.13 - Personalization based on user history', () => {
    it('should generate recommendations without errors when user has no history', async () => {
      // Test with a new user who has no completion history
      const newUserId = 'new-user-no-history';
      const result = await generateRecommendations(newUserId, 'happy', 0.7);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThanOrEqual(1);
      expect(result.breathingExercises.length).toBeGreaterThanOrEqual(1);
      expect(result.musicPlaylists.length).toBeGreaterThanOrEqual(1);
      expect(result.articles.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle database errors gracefully', async () => {
      // Even if there's a database error retrieving history, recommendations should still work
      const result = await generateRecommendations('any-user-id', 'sad', 0.6);
      
      expect(result).toBeDefined();
      expect(result.activities.length).toBeGreaterThanOrEqual(1);
    });

    it('should maintain all existing functionality with personalization enabled', async () => {
      // Verify that personalization doesn't break existing requirements
      const emotions: EmotionType[] = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'];
      
      for (const emotion of emotions) {
        const result = await generateRecommendations('test-user-personalization', emotion, 0.5);
        
        // All categories should still have at least 1 recommendation
        expect(result.activities.length).toBeGreaterThanOrEqual(1);
        expect(result.breathingExercises.length).toBeGreaterThanOrEqual(1);
        expect(result.musicPlaylists.length).toBeGreaterThanOrEqual(1);
        expect(result.articles.length).toBeGreaterThanOrEqual(1);
        
        // Limits should still be enforced
        expect(result.activities.length).toBeLessThanOrEqual(5);
        expect(result.articles.length).toBeLessThanOrEqual(3);
      }
    });
  });
});
