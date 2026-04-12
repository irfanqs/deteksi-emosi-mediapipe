// Emotion Types
export type EmotionType = 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised' | 'neutral';

export interface EmotionScores {
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
  neutral: number;
}

export interface EmotionEntry {
  id: string;
  userId: string;
  dominantEmotion: EmotionType;
  emotionScores: EmotionScores;
  timestamp: Date;
  createdAt: Date;
}

export interface CreateEmotionEntryRequest {
  dominantEmotion: EmotionType;
  emotionScores: EmotionScores;
  timestamp?: Date;
}

export const VALID_EMOTIONS: EmotionType[] = [
  'happy',
  'sad',
  'angry',
  'fearful',
  'disgusted',
  'surprised',
  'neutral'
];

export const EMOTION_LABELS: Record<EmotionType, string> = {
  happy: 'Bahagia',
  sad: 'Sedih',
  angry: 'Marah',
  fearful: 'Takut',
  disgusted: 'Jijik',
  surprised: 'Terkejut',
  neutral: 'Netral'
};

export const EMOTION_COLORS: Record<EmotionType, string> = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#DC143C',
  fearful: '#9370DB',
  disgusted: '#32CD32',
  surprised: '#FF8C00',
  neutral: '#808080'
};
