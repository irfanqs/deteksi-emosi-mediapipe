'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MoodJournal from '@/components/MoodJournal';
import { JournalData } from '@/types/journal.types';
import apiClient from '@/lib/api-client';

// ── Types ─────────────────────────────────────────────────────────────────────

interface JournalEntry {
  id: string;
  textContent: string | null;
  voiceNoteUrl: string | null;
  photoUrl: string | null;
  createdAt: string;
  emotionEntry?: {
    dominantEmotion: string;
    timestamp: string;
  };
}

const EMOTION_LABELS: Record<string, string> = {
  happy: 'Bahagia',
  sad: 'Sedih',
  angry: 'Marah',
  fearful: 'Takut',
  disgusted: 'Jijik',
  surprised: 'Terkejut',
  neutral: 'Netral',
};

const EMOTION_COLORS: Record<string, string> = {
  happy: 'bg-amber-100 text-amber-800 border-amber-200',
  sad: 'bg-blue-100 text-blue-800 border-blue-200',
  angry: 'bg-red-100 text-red-800 border-red-200',
  fearful: 'bg-purple-100 text-purple-800 border-purple-200',
  disgusted: 'bg-green-100 text-green-800 border-green-200',
  surprised: 'bg-orange-100 text-orange-800 border-orange-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
};

const EMOTION_ICONS: Record<string, string> = {
  happy: '😄', sad: '😢', angry: '😠', fearful: '😨',
  disgusted: '🤢', surprised: '😲', neutral: '😐',
};

// ── Journal History Component ─────────────────────────────────────────────────

function JournalHistory({ onWrite }: { onWrite: () => void }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/api/journals?limit=50&offset=0');
        setEntries(res.data.journals ?? []);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          setError('Silakan login terlebih dahulu untuk melihat jurnal.');
        } else {
          setError('Gagal memuat jurnal. Pastikan backend sedang berjalan.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-400 border-t-transparent" />
        <p className="text-sm font-medium">Memuat jurnal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-700 font-semibold mb-4">{error}</p>
        {error.includes('login') && (
          <Link
            href="/auth/signin"
            className="inline-block bg-violet-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-violet-500 transition"
          >
            Login Sekarang
          </Link>
        )}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
        <span className="text-6xl">📔</span>
        <div>
          <h3 className="text-xl font-bold text-slate-700 mb-1">Belum Ada Jurnal</h3>
          <p className="text-slate-500 text-sm">Lakukan pemindaian wajah dulu, lalu simpan hasilnya ke jurnal.</p>
        </div>
        <Link
          href="/"
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg"
        >
          🔍 Mulai Pemindaian
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const emotion = entry.emotionEntry?.dominantEmotion ?? 'neutral';
        const colorClass = EMOTION_COLORS[emotion] ?? EMOTION_COLORS.neutral;
        const icon = EMOTION_ICONS[emotion] ?? '😐';
        const label = EMOTION_LABELS[emotion] ?? emotion;

        return (
          <div
            key={entry.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{icon}</span>
                <div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colorClass}`}>
                    {label}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(entry.emotionEntry?.timestamp ?? entry.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 text-xs text-slate-400">
                {entry.voiceNoteUrl && <span title="Ada catatan suara">🎙</span>}
                {entry.photoUrl && <span title="Ada foto">📷</span>}
              </div>
            </div>

            {/* Text content */}
            {entry.textContent ? (
              <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 leading-relaxed line-clamp-4">
                {entry.textContent}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">Tidak ada teks.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type View = 'list' | 'write' | 'done';

function JournalContent() {
  const searchParams = useSearchParams();
  const emotionEntryId = searchParams.get('id');

  // If arrived from FaceScan with an ID, go straight to write mode
  const [view, setView] = useState<View>(emotionEntryId ? 'write' : 'list');
  const [activeId, setActiveId] = useState<string | null>(emotionEntryId);
  const [savedJournal, setSavedJournal] = useState<JournalData | null>(null);

  const handleSaveSuccess = (journal: JournalData) => {
    setSavedJournal(journal);
    setView('done');
  };

  return (
    <div className="flex-grow pt-8 sm:pt-12 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-3xl font-extrabold text-slate-900">Jurnal Mood</h1>
            {view === 'list' && (
              <Link
                href="/"
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow"
              >
                + Pemindaian Baru
              </Link>
            )}
            {view === 'write' && (
              <button
                onClick={() => setView('list')}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                ← Kembali
              </button>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            {view === 'list'
              ? 'Riwayat catatan emosi kamu'
              : 'Tulis catatan untuk emosi yang terdeteksi'}
          </p>
        </div>

        {/* Views */}
        {view === 'list' && <JournalHistory onWrite={() => setView('write')} />}

        {view === 'write' && activeId && (
          <MoodJournal
            emotionEntryId={activeId}
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => setView('list')}
          />
        )}

        {view === 'write' && !activeId && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
            <span className="text-4xl mb-3 block">⚠️</span>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Perlu Data Emosi</h3>
            <p className="text-amber-700 text-sm mb-4">
              Lakukan pemindaian wajah terlebih dahulu agar jurnal terhubung dengan data emosi Anda.
            </p>
            <Link href="/" className="inline-block bg-violet-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-violet-500 transition">
              Mulai Pemindaian
            </Link>
          </div>
        )}

        {view === 'done' && savedJournal && (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-8 text-center">
            <span className="text-5xl mb-4 block">✅</span>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">Jurnal Tersimpan!</h2>
            <p className="text-slate-600 text-sm mb-6">Catatan emosi kamu berhasil direkam.</p>
            {savedJournal.textContent && (
              <div className="bg-slate-50 rounded-xl p-4 text-left text-sm text-slate-700 mb-6 leading-relaxed">
                {savedJournal.textContent}
              </div>
            )}
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => setView('list')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl transition"
              >
                Lihat Semua Jurnal
              </button>
              <Link
                href="/"
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl transition"
              >
                Pemindaian Baru
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-400 border-t-transparent" />
      </div>
    }>
      <JournalContent />
    </Suspense>
  );
}
