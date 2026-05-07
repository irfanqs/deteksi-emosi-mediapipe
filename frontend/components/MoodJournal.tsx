'use client';

/**
 * MoodJournal Component
 * 
 * Provides text editor, voice recording, and photo capture functionality
 * for adding context to emotion entries.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

import { useState, useRef } from 'react';
import apiClient from '@/lib/api-client';
import { JournalData, CreateJournalRequest } from '@/types/journal.types';

interface MoodJournalProps {
  emotionEntryId: string;
  onSaveSuccess?: (journal: JournalData) => void;
  onCancel?: () => void;
}

export default function MoodJournal({ emotionEntryId, onSaveSuccess, onCancel }: MoodJournalProps) {
  // Text content state
  const [textContent, setTextContent] = useState('');
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setVoiceNoteUrl(url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      setSaveError('Gagal mengakses mikrofon. Silakan izinkan akses mikrofon.');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // Delete voice recording
  const deleteVoiceNote = () => {
    if (voiceNoteUrl) {
      URL.revokeObjectURL(voiceNoteUrl);
      setVoiceNoteUrl(null);
    }
    setRecordingDuration(0);
  };

  // Handle photo selection
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSaveError('Harap pilih file gambar yang valid.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('Ukuran file gambar harus kurang dari 5MB.');
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      setSaveError(null);
    }
  };

  // Delete photo
  const deletePhoto = () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
      setPhotoUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format recording duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Save journal entry
  const handleSave = async () => {
    // Validate at least one field is filled
    if (!textContent.trim() && !voiceNoteUrl && !photoUrl) {
      setSaveError('Harap isi setidaknya satu entri jurnal (teks, suara, atau foto).');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Prepare request payload
      // Note: For now, we accept file URLs as strings (task 13.2 will handle actual file upload)
      const payload: CreateJournalRequest = {
        emotionEntryId,
        textContent: textContent.trim() || undefined,
        voiceNoteUrl: voiceNoteUrl || undefined,
        photoUrl: photoUrl || undefined
      };
      
      // Call backend API
      const response = await apiClient.post<JournalData>('/api/journals', payload);
      
      setIsSaving(false);
      
      // Notify parent component
      onSaveSuccess?.(response.data);
      
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      
      let errorMessage = 'Gagal menyimpan entri jurnal. Silakan coba lagi.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setSaveError(errorMessage);
      setIsSaving(false);
    }
  };

  // Cleanup on unmount
  useState(() => {
    return () => {
      if (voiceNoteUrl) {
        URL.revokeObjectURL(voiceNoteUrl);
      }
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Jurnal Mood</h2>
      
      <div className="space-y-6">
        {/* Text Editor */}
        <div>
          <label htmlFor="journal-text" className="block text-sm font-medium text-gray-700 mb-2">
            Tulis pikiranmu
          </label>
          <textarea
            id="journal-text"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Bagaimana perasaanmu? Apa yang sedang kamu pikirkan?"
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
          />
          <div className="mt-1 text-sm text-gray-500 text-right">
            {textContent.length} karakter
          </div>
        </div>

        {/* Voice Recording */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan Suara
          </label>
          
          {!voiceNoteUrl ? (
            <div className="flex items-center gap-3">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <rect x="6" y="6" width="8" height="8" rx="1" />
                    </svg>
                    <span>Hentikan Rekaman</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Mulai Merekam</span>
                  </>
                )}
              </button>
              
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="font-mono text-sm">{formatDuration(recordingDuration)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <svg className="w-8 h-8 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Catatan Suara Direkam</div>
                <div className="text-sm text-gray-500">Durasi: {formatDuration(recordingDuration)}</div>
                <audio src={voiceNoteUrl} controls className="mt-2 w-full" />
              </div>
              <button
                onClick={deleteVoiceNote}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete voice note"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Photo Capture/Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto
          </label>
          
          {!photoUrl ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Unggah Foto</span>
              </label>
              <p className="mt-2 text-sm text-gray-500">
                Ukuran maksimum: 5MB. Format didukung: JPG, PNG, GIF
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Foto Jurnal"
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={deletePhoto}
                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
                title="Delete photo"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Eror</h3>
                <p className="text-sm text-red-700 mt-1">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Simpan Catatan Jurnal</span>
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
