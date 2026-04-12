'use client';

/**
 * Journal Page
 * 
 * Example page demonstrating the MoodJournal component usage.
 * In production, this would be integrated with the emotion entry flow.
 */

import { useState, Suspense } from 'react';
import MoodJournal from '@/components/MoodJournal';
import { JournalData } from '@/types/journal.types';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function JournalContent() {
  const [savedJournal, setSavedJournal] = useState<JournalData | null>(null);
  const searchParams = useSearchParams();
  
  // Real ID fetched directly from the emotion scan flow or URL
  const emotionEntryId = searchParams.get('id');

  const handleSaveSuccess = (journal: JournalData) => {
    console.log('Journal saved successfully:', journal);
    setSavedJournal(journal);
  };

  const handleCancel = () => {
    console.log('Journal entry cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jurnal Mood</h1>
          <p className="text-gray-600">
            Tambahkan rekaman emosimu dengan teks, catatan suara, atau foto
          </p>
        </div>

        {!savedJournal ? (
          emotionEntryId ? (
            <MoodJournal
              emotionEntryId={emotionEntryId}
              onSaveSuccess={handleSaveSuccess}
              onCancel={handleCancel}
            />
          ) : (
            <div className="bg-red-50 p-6 rounded-lg text-center max-w-2xl mx-auto border border-red-200">
              <h3 className="text-xl font-bold text-red-800 mb-2">Tidak Ada Data Emosi Ditemukan</h3>
              <p className="text-red-700 mb-4">Harap lakukan pemindaian wajah terlebih dahulu untuk membuat jurnal berdasarkan emosi Anda saat ini.</p>
              <Link href="/" className="inline-block bg-white text-red-700 font-medium px-4 py-2 rounded shadow hover:bg-red-50 transition">
                Kembali ke Beranda
              </Link>
            </div>
          )
        ) : (
          <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <svg
                className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-green-800 mb-2">Jurnal Berhasil Disimpan!</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Jurnal mood kamu berhasil direkam dengan baik.
                </p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">ID Entri:</span>{' '}
                    <span className="text-gray-600">{savedJournal.id}</span>
                  </div>
                  
                  {savedJournal.textContent && (
                    <div>
                      <span className="font-medium text-gray-700">Konten Teks:</span>
                      <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">
                        {savedJournal.textContent}
                      </p>
                    </div>
                  )}
                  
                  {savedJournal.voiceNoteUrl && (
                    <div>
                      <span className="font-medium text-gray-700">Catatan Suara:</span>
                      <p className="text-gray-600">✓ Terekam</p>
                    </div>
                  )}
                  
                  {savedJournal.photoUrl && (
                    <div>
                      <span className="font-medium text-gray-700">Foto:</span>
                      <p className="text-gray-600">✓ Terunggah</p>
                    </div>
                  )}
                </div>

                <Link
                  href="/"
                  className="mt-6 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  onClick={() => setSavedJournal(null)}
                >
                  Buat Pemindaian Baru
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat...</div>}>
      <JournalContent />
    </Suspense>
  )
}
