// Journal Types

export interface JournalData {
  id: string;
  emotionEntryId: string;
  userId: string;
  textContent?: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJournalRequest {
  emotionEntryId: string;
  textContent?: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
}

export interface UpdateJournalRequest {
  textContent?: string;
  voiceNoteUrl?: string;
  photoUrl?: string;
}
