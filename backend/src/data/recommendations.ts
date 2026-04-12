/**
 * Recommendation Templates and Data
 * 
 * This file contains all recommendation templates for the Mental Wellness Tracker.
 * Recommendations are categorized by type and tagged based on emotion mappings.
 * 
 * Emotion Tag Mappings:
 * - happy → celebration, gratitude, social
 * - sad → comfort, uplifting, connection
 * - angry → calming, physical, release
 * - fearful → grounding, safety, reassurance
 * - disgusted → cleansing, refresh, positive
 * - surprised → processing, reflection, grounding
 * - neutral → exploration, variety, discovery
 */

export type RecommendationType = 
  | 'meditation' 
  | 'exercise' 
  | 'journaling' 
  | 'breathing' 
  | 'music' 
  | 'article';

export type EmotionTag = 
  | 'celebration' | 'gratitude' | 'social'
  | 'comfort' | 'uplifting' | 'connection'
  | 'calming' | 'physical' | 'release'
  | 'grounding' | 'safety' | 'reassurance'
  | 'cleansing' | 'refresh' | 'positive'
  | 'processing' | 'reflection'
  | 'exploration' | 'variety' | 'discovery';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  duration?: number; // in minutes
  url?: string;
  tags: EmotionTag[];
}

// Emotion to Tag Mappings
export const EMOTION_TAG_MAP: Record<string, EmotionTag[]> = {
  happy: ['celebration', 'gratitude', 'social'],
  sad: ['comfort', 'uplifting', 'connection'],
  angry: ['calming', 'physical', 'release'],
  fearful: ['grounding', 'safety', 'reassurance'],
  disgusted: ['cleansing', 'refresh', 'positive'],
  surprised: ['processing', 'reflection', 'grounding'],
  neutral: ['exploration', 'variety', 'discovery']
};

// Activity Recommendations (Meditation, Exercise, Journaling)
export const ACTIVITY_RECOMMENDATIONS: Recommendation[] = [
  // Happy activities
  {
    id: 'act-001',
    type: 'meditation',
    title: 'Gratitude Meditation',
    description: 'Reflect on things you are grateful for and amplify positive emotions',
    duration: 10,
    tags: ['gratitude', 'celebration']
  },
  {
    id: 'act-002',
    type: 'exercise',
    title: 'Dance Session',
    description: 'Express your joy through movement and dancing to uplifting music',
    duration: 20,
    tags: ['celebration', 'social']
  },
  {
    id: 'act-003',
    type: 'journaling',
    title: 'Joy Journal',
    description: 'Write about what made you happy today and celebrate your wins',
    duration: 15,
    tags: ['gratitude', 'celebration']
  },
  {
    id: 'act-004',
    type: 'exercise',
    title: 'Social Walk',
    description: 'Take a walk with a friend or call someone you care about',
    duration: 30,
    tags: ['social', 'connection']
  },

  // Sad activities
  {
    id: 'act-005',
    type: 'meditation',
    title: 'Self-Compassion Meditation',
    description: 'Practice being kind to yourself during difficult moments',
    duration: 15,
    tags: ['comfort', 'uplifting']
  },
  {
    id: 'act-006',
    type: 'exercise',
    title: 'Gentle Yoga',
    description: 'Slow, nurturing yoga practice to reconnect with your body',
    duration: 25,
    tags: ['comfort', 'uplifting']
  },
  {
    id: 'act-007',
    type: 'journaling',
    title: 'Emotion Processing Journal',
    description: 'Write freely about your feelings without judgment',
    duration: 20,
    tags: ['comfort', 'processing']
  },
  {
    id: 'act-008',
    type: 'exercise',
    title: 'Nature Walk',
    description: 'Spend time in nature to lift your mood and gain perspective',
    duration: 30,
    tags: ['uplifting', 'grounding']
  },
  {
    id: 'act-009',
    type: 'meditation',
    title: 'Loving-Kindness Meditation',
    description: 'Send compassion to yourself and others to foster connection',
    duration: 12,
    tags: ['connection', 'comfort']
  },

  // Angry activities
  {
    id: 'act-010',
    type: 'exercise',
    title: 'High-Intensity Workout',
    description: 'Release anger through intense physical activity like boxing or running',
    duration: 30,
    tags: ['physical', 'release']
  },
  {
    id: 'act-011',
    type: 'meditation',
    title: 'Calming Breath Meditation',
    description: 'Focus on slow breathing to calm your nervous system',
    duration: 10,
    tags: ['calming', 'grounding']
  },
  {
    id: 'act-012',
    type: 'journaling',
    title: 'Anger Release Writing',
    description: 'Write out your frustrations without holding back, then reflect',
    duration: 15,
    tags: ['release', 'processing']
  },
  {
    id: 'act-013',
    type: 'exercise',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups to release physical tension',
    duration: 20,
    tags: ['calming', 'physical']
  },

  // Fearful activities
  {
    id: 'act-014',
    type: 'meditation',
    title: 'Grounding Meditation',
    description: 'Connect with the present moment to feel safe and centered',
    duration: 10,
    tags: ['grounding', 'safety']
  },
  {
    id: 'act-015',
    type: 'exercise',
    title: '5-4-3-2-1 Grounding Exercise',
    description: 'Use your senses to anchor yourself in the present moment',
    duration: 5,
    tags: ['grounding', 'safety']
  },
  {
    id: 'act-016',
    type: 'journaling',
    title: 'Fear Exploration Journal',
    description: 'Identify and challenge your fears with compassionate inquiry',
    duration: 20,
    tags: ['processing', 'reassurance']
  },
  {
    id: 'act-017',
    type: 'meditation',
    title: 'Safe Space Visualization',
    description: 'Visualize a place where you feel completely safe and protected',
    duration: 15,
    tags: ['safety', 'reassurance']
  },

  // Disgusted activities
  {
    id: 'act-018',
    type: 'exercise',
    title: 'Cleansing Shower Ritual',
    description: 'Take a mindful shower to symbolically wash away negative feelings',
    duration: 15,
    tags: ['cleansing', 'refresh']
  },
  {
    id: 'act-019',
    type: 'meditation',
    title: 'Renewal Meditation',
    description: 'Focus on releasing negativity and inviting fresh energy',
    duration: 12,
    tags: ['cleansing', 'positive']
  },
  {
    id: 'act-020',
    type: 'journaling',
    title: 'Positive Reframe Journal',
    description: 'Identify negative thoughts and reframe them positively',
    duration: 15,
    tags: ['positive', 'processing']
  },
  {
    id: 'act-021',
    type: 'exercise',
    title: 'Declutter Session',
    description: 'Organize your space to create a sense of freshness and control',
    duration: 30,
    tags: ['cleansing', 'refresh']
  },

  // Surprised activities
  {
    id: 'act-022',
    type: 'meditation',
    title: 'Mindful Observation',
    description: 'Observe your thoughts and feelings without trying to change them',
    duration: 10,
    tags: ['processing', 'reflection']
  },
  {
    id: 'act-023',
    type: 'journaling',
    title: 'Surprise Processing Journal',
    description: 'Write about the unexpected event and how it makes you feel',
    duration: 15,
    tags: ['processing', 'reflection']
  },
  {
    id: 'act-024',
    type: 'exercise',
    title: 'Grounding Walk',
    description: 'Take a slow walk focusing on each step to process the surprise',
    duration: 20,
    tags: ['grounding', 'processing']
  },

  // Neutral activities
  {
    id: 'act-025',
    type: 'meditation',
    title: 'Open Awareness Meditation',
    description: 'Explore your inner landscape without specific focus',
    duration: 15,
    tags: ['exploration', 'discovery']
  },
  {
    id: 'act-026',
    type: 'exercise',
    title: 'Try Something New',
    description: 'Engage in a new physical activity or sport you have not tried',
    duration: 30,
    tags: ['variety', 'discovery']
  },
  {
    id: 'act-027',
    type: 'journaling',
    title: 'Free-Flow Writing',
    description: 'Write whatever comes to mind without structure or judgment',
    duration: 15,
    tags: ['exploration', 'variety']
  },
  {
    id: 'act-028',
    type: 'exercise',
    title: 'Exploratory Walk',
    description: 'Walk a new route or explore a new area in your neighborhood',
    duration: 25,
    tags: ['exploration', 'discovery']
  }
];

// Breathing Exercise Recommendations
export const BREATHING_EXERCISES: Recommendation[] = [
  // Happy breathing
  {
    id: 'breath-001',
    type: 'breathing',
    title: 'Energizing Breath',
    description: 'Quick inhales and exhales to amplify positive energy (Breath of Fire)',
    duration: 5,
    tags: ['celebration', 'social']
  },
  {
    id: 'breath-002',
    type: 'breathing',
    title: 'Gratitude Breathing',
    description: 'Breathe in gratitude, breathe out appreciation - 4 counts each',
    duration: 5,
    tags: ['gratitude', 'celebration']
  },

  // Sad breathing
  {
    id: 'breath-003',
    type: 'breathing',
    title: 'Comforting Breath',
    description: 'Gentle 4-7-8 breathing: inhale 4, hold 7, exhale 8 counts',
    duration: 5,
    tags: ['comfort', 'uplifting']
  },
  {
    id: 'breath-004',
    type: 'breathing',
    title: 'Heart-Centered Breathing',
    description: 'Place hand on heart, breathe deeply into your chest with compassion',
    duration: 5,
    tags: ['comfort', 'connection']
  },

  // Angry breathing
  {
    id: 'breath-005',
    type: 'breathing',
    title: 'Cooling Breath (Sitali)',
    description: 'Curl tongue, inhale through mouth, exhale through nose to cool anger',
    duration: 5,
    tags: ['calming', 'release']
  },
  {
    id: 'breath-006',
    type: 'breathing',
    title: 'Box Breathing',
    description: 'Inhale 4, hold 4, exhale 4, hold 4 - repeat to calm nervous system',
    duration: 5,
    tags: ['calming', 'grounding']
  },

  // Fearful breathing
  {
    id: 'breath-007',
    type: 'breathing',
    title: 'Grounding Breath',
    description: 'Deep belly breathing - inhale 5 counts, exhale 7 counts',
    duration: 5,
    tags: ['grounding', 'safety']
  },
  {
    id: 'breath-008',
    type: 'breathing',
    title: 'Safety Breath',
    description: 'Breathe in safety, breathe out fear - visualize with each breath',
    duration: 5,
    tags: ['safety', 'reassurance']
  },

  // Disgusted breathing
  {
    id: 'breath-009',
    type: 'breathing',
    title: 'Cleansing Breath',
    description: 'Sharp exhales through mouth to release negativity, gentle inhales',
    duration: 5,
    tags: ['cleansing', 'release']
  },
  {
    id: 'breath-010',
    type: 'breathing',
    title: 'Refreshing Breath',
    description: 'Alternate nostril breathing to balance and refresh your energy',
    duration: 5,
    tags: ['refresh', 'positive']
  },

  // Surprised breathing
  {
    id: 'breath-011',
    type: 'breathing',
    title: 'Centering Breath',
    description: 'Equal breathing - inhale and exhale for same count (5-5)',
    duration: 5,
    tags: ['grounding', 'processing']
  },
  {
    id: 'breath-012',
    type: 'breathing',
    title: 'Observing Breath',
    description: 'Simply observe your natural breath without changing it',
    duration: 5,
    tags: ['reflection', 'processing']
  },

  // Neutral breathing
  {
    id: 'breath-013',
    type: 'breathing',
    title: 'Exploratory Breathing',
    description: 'Experiment with different breath patterns and notice the effects',
    duration: 5,
    tags: ['exploration', 'discovery']
  },
  {
    id: 'breath-014',
    type: 'breathing',
    title: 'Varied Breath Practice',
    description: 'Try 3 different breathing techniques for variety',
    duration: 5,
    tags: ['variety', 'exploration']
  }
];

// Music Playlist Recommendations
export const MUSIC_PLAYLISTS: Recommendation[] = [
  // Happy playlists
  {
    id: 'music-001',
    type: 'music',
    title: 'Celebration Vibes',
    description: 'Upbeat, joyful music to amplify your happiness',
    url: 'https://open.spotify.com/playlist/celebration',
    tags: ['celebration', 'social']
  },
  {
    id: 'music-002',
    type: 'music',
    title: 'Gratitude & Joy',
    description: 'Peaceful, uplifting songs that inspire gratitude',
    url: 'https://open.spotify.com/playlist/gratitude',
    tags: ['gratitude', 'celebration']
  },

  // Sad playlists
  {
    id: 'music-003',
    type: 'music',
    title: 'Comfort & Healing',
    description: 'Gentle, soothing music to comfort your heart',
    url: 'https://open.spotify.com/playlist/comfort',
    tags: ['comfort', 'uplifting']
  },
  {
    id: 'music-004',
    type: 'music',
    title: 'Uplifting Melodies',
    description: 'Gradually uplifting songs to gently raise your mood',
    url: 'https://open.spotify.com/playlist/uplifting',
    tags: ['uplifting', 'connection']
  },

  // Angry playlists
  {
    id: 'music-005',
    type: 'music',
    title: 'Calming Instrumentals',
    description: 'Peaceful instrumental music to soothe anger',
    url: 'https://open.spotify.com/playlist/calming',
    tags: ['calming', 'grounding']
  },
  {
    id: 'music-006',
    type: 'music',
    title: 'Release & Let Go',
    description: 'Cathartic music to help release intense emotions',
    url: 'https://open.spotify.com/playlist/release',
    tags: ['release', 'physical']
  },

  // Fearful playlists
  {
    id: 'music-007',
    type: 'music',
    title: 'Grounding Sounds',
    description: 'Nature sounds and ambient music for grounding',
    url: 'https://open.spotify.com/playlist/grounding',
    tags: ['grounding', 'safety']
  },
  {
    id: 'music-008',
    type: 'music',
    title: 'Safe & Secure',
    description: 'Reassuring, gentle music to create a sense of safety',
    url: 'https://open.spotify.com/playlist/safety',
    tags: ['safety', 'reassurance']
  },

  // Disgusted playlists
  {
    id: 'music-009',
    type: 'music',
    title: 'Cleansing Frequencies',
    description: 'Purifying sound frequencies and cleansing music',
    url: 'https://open.spotify.com/playlist/cleansing',
    tags: ['cleansing', 'refresh']
  },
  {
    id: 'music-010',
    type: 'music',
    title: 'Fresh Start',
    description: 'Refreshing, positive music for a new beginning',
    url: 'https://open.spotify.com/playlist/refresh',
    tags: ['refresh', 'positive']
  },

  // Surprised playlists
  {
    id: 'music-011',
    type: 'music',
    title: 'Reflective Instrumentals',
    description: 'Contemplative music for processing unexpected events',
    url: 'https://open.spotify.com/playlist/reflection',
    tags: ['reflection', 'processing']
  },
  {
    id: 'music-012',
    type: 'music',
    title: 'Grounding Rhythms',
    description: 'Steady, rhythmic music to help you feel centered',
    url: 'https://open.spotify.com/playlist/grounding-rhythms',
    tags: ['grounding', 'processing']
  },

  // Neutral playlists
  {
    id: 'music-013',
    type: 'music',
    title: 'Musical Exploration',
    description: 'Diverse genres and styles to discover new favorites',
    url: 'https://open.spotify.com/playlist/exploration',
    tags: ['exploration', 'discovery']
  },
  {
    id: 'music-014',
    type: 'music',
    title: 'Variety Mix',
    description: 'Eclectic mix of different moods and styles',
    url: 'https://open.spotify.com/playlist/variety',
    tags: ['variety', 'discovery']
  }
];

// Mental Health Article Recommendations
export const ARTICLE_RECOMMENDATIONS: Recommendation[] = [
  // Happy articles
  {
    id: 'article-001',
    type: 'article',
    title: 'The Science of Gratitude',
    description: 'How practicing gratitude can enhance your wellbeing and happiness',
    url: 'https://example.com/gratitude-science',
    tags: ['gratitude', 'celebration']
  },
  {
    id: 'article-002',
    type: 'article',
    title: 'Building Meaningful Connections',
    description: 'The importance of social bonds for mental health',
    url: 'https://example.com/social-connections',
    tags: ['social', 'connection']
  },
  {
    id: 'article-003',
    type: 'article',
    title: 'Sustaining Positive Emotions',
    description: 'Strategies to maintain and amplify positive feelings',
    url: 'https://example.com/positive-emotions',
    tags: ['celebration', 'gratitude']
  },

  // Sad articles
  {
    id: 'article-004',
    type: 'article',
    title: 'Self-Compassion in Difficult Times',
    description: 'Learning to be kind to yourself when you are struggling',
    url: 'https://example.com/self-compassion',
    tags: ['comfort', 'uplifting']
  },
  {
    id: 'article-005',
    type: 'article',
    title: 'Understanding Sadness',
    description: 'The role of sadness in emotional health and healing',
    url: 'https://example.com/understanding-sadness',
    tags: ['comfort', 'processing']
  },
  {
    id: 'article-006',
    type: 'article',
    title: 'Reaching Out for Support',
    description: 'How to connect with others when you are feeling down',
    url: 'https://example.com/reaching-out',
    tags: ['connection', 'uplifting']
  },

  // Angry articles
  {
    id: 'article-007',
    type: 'article',
    title: 'Healthy Anger Management',
    description: 'Constructive ways to process and release anger',
    url: 'https://example.com/anger-management',
    tags: ['release', 'calming']
  },
  {
    id: 'article-008',
    type: 'article',
    title: 'Physical Exercise for Emotional Release',
    description: 'Using movement to process intense emotions',
    url: 'https://example.com/exercise-emotions',
    tags: ['physical', 'release']
  },
  {
    id: 'article-009',
    type: 'article',
    title: 'Calming Your Nervous System',
    description: 'Science-backed techniques to reduce anger and stress',
    url: 'https://example.com/calming-nervous-system',
    tags: ['calming', 'grounding']
  },

  // Fearful articles
  {
    id: 'article-010',
    type: 'article',
    title: 'Grounding Techniques for Anxiety',
    description: 'Practical methods to feel safe and present',
    url: 'https://example.com/grounding-anxiety',
    tags: ['grounding', 'safety']
  },
  {
    id: 'article-011',
    type: 'article',
    title: 'Understanding Fear Responses',
    description: 'How your brain processes fear and what you can do',
    url: 'https://example.com/fear-responses',
    tags: ['reassurance', 'processing']
  },
  {
    id: 'article-012',
    type: 'article',
    title: 'Creating a Sense of Safety',
    description: 'Building internal and external safety resources',
    url: 'https://example.com/creating-safety',
    tags: ['safety', 'reassurance']
  },

  // Disgusted articles
  {
    id: 'article-013',
    type: 'article',
    title: 'Emotional Cleansing Practices',
    description: 'Rituals and practices to release negative emotions',
    url: 'https://example.com/emotional-cleansing',
    tags: ['cleansing', 'release']
  },
  {
    id: 'article-014',
    type: 'article',
    title: 'Reframing Negative Thoughts',
    description: 'Cognitive techniques to shift your perspective',
    url: 'https://example.com/reframing-thoughts',
    tags: ['positive', 'processing']
  },
  {
    id: 'article-015',
    type: 'article',
    title: 'Fresh Starts and New Beginnings',
    description: 'How to create positive change in your life',
    url: 'https://example.com/fresh-starts',
    tags: ['refresh', 'positive']
  },

  // Surprised articles
  {
    id: 'article-016',
    type: 'article',
    title: 'Processing Unexpected Events',
    description: 'How to navigate surprise and uncertainty',
    url: 'https://example.com/unexpected-events',
    tags: ['processing', 'reflection']
  },
  {
    id: 'article-017',
    type: 'article',
    title: 'Mindful Response to Change',
    description: 'Staying grounded when life surprises you',
    url: 'https://example.com/mindful-response',
    tags: ['grounding', 'reflection']
  },
  {
    id: 'article-018',
    type: 'article',
    title: 'The Gift of Surprise',
    description: 'Finding opportunity in unexpected moments',
    url: 'https://example.com/gift-surprise',
    tags: ['processing', 'positive']
  },

  // Neutral articles
  {
    id: 'article-019',
    type: 'article',
    title: 'Exploring Your Emotional Landscape',
    description: 'Understanding your full range of emotions',
    url: 'https://example.com/emotional-landscape',
    tags: ['exploration', 'discovery']
  },
  {
    id: 'article-020',
    type: 'article',
    title: 'Trying New Wellness Practices',
    description: 'A guide to discovering what works for you',
    url: 'https://example.com/new-practices',
    tags: ['variety', 'discovery']
  },
  {
    id: 'article-021',
    type: 'article',
    title: 'The Value of Emotional Neutrality',
    description: 'Finding peace in balanced emotional states',
    url: 'https://example.com/emotional-neutrality',
    tags: ['exploration', 'reflection']
  }
];

// Export all recommendations grouped by category
export const ALL_RECOMMENDATIONS = {
  activities: ACTIVITY_RECOMMENDATIONS,
  breathing: BREATHING_EXERCISES,
  music: MUSIC_PLAYLISTS,
  articles: ARTICLE_RECOMMENDATIONS
};

// Helper function to get recommendations by emotion
export function getRecommendationsByEmotion(emotion: string): {
  activities: Recommendation[];
  breathing: Recommendation[];
  music: Recommendation[];
  articles: Recommendation[];
} {
  const emotionTags = EMOTION_TAG_MAP[emotion] || [];
  
  return {
    activities: ACTIVITY_RECOMMENDATIONS.filter(rec => 
      rec.tags.some(tag => emotionTags.includes(tag))
    ),
    breathing: BREATHING_EXERCISES.filter(rec => 
      rec.tags.some(tag => emotionTags.includes(tag))
    ),
    music: MUSIC_PLAYLISTS.filter(rec => 
      rec.tags.some(tag => emotionTags.includes(tag))
    ),
    articles: ARTICLE_RECOMMENDATIONS.filter(rec => 
      rec.tags.some(tag => emotionTags.includes(tag))
    )
  };
}

// Helper function to get all tags for an emotion
export function getTagsForEmotion(emotion: string): EmotionTag[] {
  return EMOTION_TAG_MAP[emotion] || [];
}
