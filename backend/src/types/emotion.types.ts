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

export interface CreateEmotionEntryRequest {
  userId: string;
  dominantEmotion: EmotionType;
  emotionScores: EmotionScores;
  timestamp?: Date;
}

export interface EmotionEntry {
  id: string;
  userId: string;
  dominantEmotion: EmotionType;
  happyScore: number;
  sadScore: number;
  angryScore: number;
  fearfulScore: number;
  disgustedScore: number;
  surprisedScore: number;
  neutralScore: number;
  timestamp: Date;
  createdAt: Date;
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
