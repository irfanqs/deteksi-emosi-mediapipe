'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { useSession } from 'next-auth/react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
}

interface Goal {
  id: string;
  targetEmotion: string;
  targetFrequency: number;
  currentProgress: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface EmotionEntry {
  id: string;
  dominantEmotion: string;
  timestamp: string;
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

const EMOTION_ICONS: Record<string, string> = {
  happy: '🌟', sad: '😢', angry: '😠', fearful: '😨',
  disgusted: '🤢', surprised: '😲', neutral: '😐',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Sahabat';

  const [streak, setStreak] = useState<StreakData | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recentEmotions, setRecentEmotions] = useState<EmotionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch Streak Data
        const streakRes = await apiClient.get('/api/streaks').catch(() => null);
        if (streakRes?.data) setStreak(streakRes.data);

        // Fetch Goals Data
        const goalsRes = await apiClient.get('/api/goals?activeOnly=true').catch(() => null);
        if (goalsRes?.data?.goals) setGoals(goalsRes.data.goals);

        // Fetch Recent Emotions History
        const emotionRes = await apiClient.get('/api/emotions?limit=5').catch(() => null);
        if (emotionRes?.data?.entries) setRecentEmotions(emotionRes.data.entries);

        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        if (err?.response?.status === 401) {
          setError('Sesi telah berakhir. Silakan login kembali.');
        } else {
          setError('Gagal memuat dasbor. Pastikan backend berjalan.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-400 border-t-transparent mb-4" />
        <p className="text-slate-500 font-medium">Memuat dasbor kesehatan mentalmu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center px-4">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-200 text-center max-w-md w-full shadow-sm">
          <span className="text-4xl block mb-4">⚠️</span>
          <p className="text-red-700 font-bold mb-6">{error}</p>
          <Link href="/auth/signin" className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-violet-500 transition-all inline-block shadow-md hover:shadow-lg">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow pt-8 sm:pt-12 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Assalamu'alaikum {userName},
            </h1>
            <p className="text-slate-500 font-medium">Bagaimana kondisi hati Anda hari ini?</p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Link href="/" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center flex items-center justify-center gap-2">
              <span>📷</span> Scan Ekspresi Wajah Anda
            </Link>
            <Link href="/journal" className="text-sm text-center text-slate-500 hover:text-violet-600 font-medium underline decoration-violet-200 underline-offset-4 transition-colors">
              Atau, isi survei suasana hati manual
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Streak Card - Spans 4 cols on Desktop */}
          <div className="md:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-50 group-hover:bg-orange-100 transition-colors" />
            <h3 className="text-slate-400 font-bold text-sm tracking-wider uppercase mb-2">Konsistensi Habit</h3>
            <span className="text-7xl mb-2 drop-shadow-sm">{streak?.currentStreak && streak.currentStreak > 0 ? '🔥' : '🌱'}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-slate-800">{streak?.currentStreak || 0}</span>
              <span className="text-slate-500 font-medium">Hari</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              Rekor terpanjang: <strong>{streak?.longestStreak || 0} hari</strong>
            </p>
          </div>

          {/* Active Goals Card - Spans 8 cols */}
          <div className="md:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <span>🎯</span> Target Emosional 
              </h3>
            </div>
            
            {goals.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-200 h-40 flex flex-col justify-center items-center text-slate-400">
                <span className="mb-2 text-2xl">🏆</span>
                <p className="text-sm">Belum ada target emosi yang aktif.</p>
                <p className="text-xs mt-1">(Fitur pembuatan Goal akan segera hadir!)</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map(goal => {
                  const progressPct = Math.min(100, Math.round((goal.currentProgress / goal.targetFrequency) * 100));
                  return (
                    <div key={goal.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Target Mood</div>
                          <div className="font-bold text-slate-700 flex items-center gap-2">
                            {EMOTION_LABELS[goal.targetEmotion] || goal.targetEmotion}
                            <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {goal.targetFrequency}x Seminggu
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-violet-600">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-violet-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section - Recent History and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* History Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <span>⏱️</span> Riwayat Mood Terbaru
              </h3>
              <Link href="/journal" className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition">Lihat Jurnal →</Link>
            </div>

            {recentEmotions.length === 0 ? (
              <div className="text-center text-slate-400 p-8 border border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm">Anda belum melakukan pindaian wajah.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentEmotions.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-slate-50 p-2 rounded-xl group-hover:bg-white transition">{EMOTION_ICONS[entry.dominantEmotion] || '😐'}</span>
                      <div>
                        <div className="font-bold text-slate-700">{EMOTION_LABELS[entry.dominantEmotion] || entry.dominantEmotion}</div>
                        <div className="text-xs text-slate-400">
                          {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(entry.timestamp))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Tracking Widget */}
          <div className="bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <span>🩺</span> Intervensi Islami & Klinis
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 flex flex-col gap-2">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Klinis Info</span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sistem sekarang akan mendata semua rekomendasi berdasarkan nilai-nilai spiritual Islami dan SDKI persis ketika Anda memindai wajah.
                </p>
                <div className="mt-2 bg-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Tugas Terakhir Selesai:</span>
                  <span className="font-bold text-violet-400">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
