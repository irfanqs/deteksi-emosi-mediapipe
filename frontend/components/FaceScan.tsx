'use client';

/**
 * FaceScan Component — MediaPipe Face Landmarker
 * Detects 52 facial muscle blendshapes in real-time, fully local in browser.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  EmotionScores,
  EmotionType,
  EMOTION_LABELS,
  EMOTION_COLORS,
  CreateEmotionEntryRequest,
  EmotionEntry,
} from '@/types/emotion.types';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'error';

interface FaceScanProps {
  onReady?: () => void;
  onError?: (error: Error) => void;
  onEmotionDetected?: (emotions: EmotionScores) => void;
  onSaveSuccess?: (entry: EmotionEntry) => void;
}

// ── Blendshape helpers ──────────────────────────────────────────────────────

function blendshapesToEmotions(
  categories: { categoryName: string; score: number }[]
): EmotionScores {
  const g = (name: string) =>
    categories.find((c) => c.categoryName === name)?.score ?? 0;

  const smileL = g('mouthSmileLeft');
  const smileR = g('mouthSmileRight');
  const cheekL = g('cheekSquintLeft');
  const cheekR = g('cheekSquintRight');
  const eyeSquintL = g('eyeSquintLeft');
  const eyeSquintR = g('eyeSquintRight');

  const frownL = g('mouthFrownLeft');
  const frownR = g('mouthFrownRight');
  const browInner = g('browInnerUp');
  const pucker = g('mouthPucker');

  const browDownL = g('browDownLeft');
  const browDownR = g('browDownRight');
  const sneerL = g('noseSneerLeft');
  const sneerR = g('noseSneerRight');

  const eyeWideL = g('eyeWideLeft');
  const eyeWideR = g('eyeWideRight');
  const jawOpen = g('jawOpen');
  const mouthOpen = g('mouthOpen');

  const lowerDownL = g('mouthLowerDownLeft');
  const lowerDownR = g('mouthLowerDownRight');
  const rollLower = g('mouthRollLower');

  const happy = Math.min(
    1,
    (smileL + smileR) * 0.4 + (cheekL + cheekR) * 0.3 + (eyeSquintL + eyeSquintR) * 0.3
  );
  const sad = Math.min(
    1,
    (frownL + frownR) * 0.45 + browInner * 0.35 + pucker * 0.2
  );
  const angry = Math.min(
    1,
    (browDownL + browDownR) * 0.5 + (sneerL + sneerR) * 0.5
  );
  const eyeWide = (eyeWideL + eyeWideR) / 2;
  const fearful = Math.min(1, eyeWide * 0.5 + mouthOpen * 0.3 + (1 - happy) * 0.2);
  const surprised = Math.min(1, eyeWide * 0.4 + jawOpen * 0.4 + mouthOpen * 0.2);
  const disgusted = Math.min(
    1,
    (lowerDownL + lowerDownR) * 0.4 + rollLower * 0.3 + (sneerL + sneerR) * 0.3
  );

  const raw = { happy, sad, angry, fearful, surprised, disgusted };
  const total = Object.values(raw).reduce((a, b) => a + b, 0) || 0.001;
  const norm = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, v / total])
  ) as Omit<EmotionScores, 'neutral'>;

  const maxRaw = Math.max(...Object.values(raw));
  const neutral = Math.max(0, 1 - maxRaw * 1.5);
  const totalFinal =
    Object.values(norm).reduce((a, b) => a + b, 0) + neutral;

  return {
    happy: norm.happy / totalFinal,
    sad: norm.sad / totalFinal,
    angry: norm.angry / totalFinal,
    fearful: norm.fearful / totalFinal,
    surprised: norm.surprised / totalFinal,
    disgusted: norm.disgusted / totalFinal,
    neutral: neutral / totalFinal,
  };
}

function getDominantEmotion(e: EmotionScores): EmotionType {
  return (Object.keys(e) as EmotionType[]).reduce((a, b) =>
    e[a] > e[b] ? a : b
  );
}

function getRecommendation(emotion: EmotionType) {
  switch (emotion) {
    case 'happy':
      return {
        spectrum: 'Sangat Positif',
        diagnosis: 'Kesiapan Peningkatan Koping',
        action: 'Sharing: Motivasi untuk menebar kebaikan kepada sesama. Spiritual: Mensyukuri nikmat Tuhan.',
        icon: '🌟',
        color: 'bg-amber-50 text-amber-900 border-amber-200',
        badge: 'bg-amber-100 text-amber-800',
      };
    case 'surprised':
      return {
        spectrum: 'Positif',
        diagnosis: 'Kesiapan Peningkatan Konsep Diri',
        action: 'Edukasi: Mempertahankan pola hidup sehat dan manajemen waktu. Spiritual: Merenungkan dan mengambil hikmah dari keadaan sekitar.',
        icon: '💡',
        color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800',
      };
    case 'neutral':
      return {
        spectrum: 'Netral',
        diagnosis: 'Pemeliharaan Kesehatan Tidak Efektif (Risiko)',
        action: 'Aktivitas Fisik: Peregangan ringan dan hidrasi (minum air putih). Spiritual: Membaca zikir atau afirmasi positif.',
        icon: '💧',
        color: 'bg-slate-50 text-slate-800 border-slate-200',
        badge: 'bg-slate-200 text-slate-700',
      };
    case 'sad':
    case 'fearful':
      return {
        spectrum: 'Negatif',
        diagnosis: 'Ansietas / Duka Cita',
        action: 'Relaksasi: Teknik nafas dalam. Spiritual: Mendengarkan lantunan ayat suci / instrumen doa, dan berserah diri untuk ketenangan Hati.',
        icon: '😮‍💨',
        color: 'bg-blue-50 text-blue-900 border-blue-200',
        badge: 'bg-blue-100 text-blue-800',
      };
    case 'angry':
    case 'disgusted':
      return {
        spectrum: 'Sangat Negatif',
        diagnosis: 'Risiko Perilaku Kekerasan / Keputusasaan',
        action: 'Manajemen Marah: Mengubah posisi tubuh, mengambil air wudhu (cuci muka), atau konsultasi ahli. Spiritual: Banyak beristighfar dan tarik nafas pelan.',
        icon: '🛑',
        color: 'bg-rose-50 text-rose-900 border-rose-200',
        badge: 'bg-rose-100 text-rose-800',
      };
    default:
      return null;
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export default function FaceScan({
  onReady,
  onError,
  onEmotionDetected,
  onSaveSuccess,
}: FaceScanProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false); // controls the detection loop
  const router = useRouter();

  const [status, setStatus] = useState<
    'idle' | 'loading_model' | 'ready' | 'camera_starting' | 'detecting' | 'error'
  >('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [currentEmotions, setCurrentEmotions] = useState<EmotionScores | null>(null);
  const [noFaceDetected, setNoFaceDetected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Step 1: Load MediaPipe model on mount ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        setStatus('loading_model');
        setLoadingStep('Mengimpor library MediaPipe...');

        const { FaceLandmarker, FilesetResolver } =
          await import('@mediapipe/tasks-vision');

        if (cancelled) return;
        setLoadingStep('Mengunduh model Face Landmarker (±30MB, sekali saja)...');

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );

        if (cancelled) return;
        setLoadingStep('Menyiapkan model AI...');

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'CPU',
          },
          outputFaceBlendshapes: true,
          runningMode: 'VIDEO',
          numFaces: 1,
        });

        if (cancelled) return;
        landmarkerRef.current = landmarker;
        setLoadingStep('');
        setStatus('ready');
        onReady?.();
      } catch (err: any) {
        if (cancelled) return;
        console.error('[MediaPipe] Load error:', err);
        setError(
          `Gagal memuat model: ${err?.message ?? err}. Cek koneksi internet lalu refresh.`
        );
        setStatus('error');
        onError?.(err);
      }
    }

    loadModel();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step 2: Start camera ───────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      setStatus('camera_starting');
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = reject;
        video.play().catch(reject);
      });

      setPermissionState('granted');
      setStatus('detecting');
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setPermissionState('denied');
        setError('Izin kamera ditolak. Klik ikon kamera di address bar lalu izinkan.');
      } else {
        setPermissionState('error');
        setError('Gagal membuka kamera: ' + (err?.message ?? err));
      }
      setStatus('ready');
    }
  }, []);

  // ── Step 3: Detection loop (runs when status === 'detecting') ──────────
  useEffect(() => {
    if (status !== 'detecting') return;

    runningRef.current = true;

    function loop() {
      if (!runningRef.current) return;

      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (video && landmarker && video.readyState >= 2 && !video.paused) {
        try {
          const results = landmarker.detectForVideo(video, performance.now());
          const shapes = results?.faceBlendshapes?.[0]?.categories;

          if (shapes && shapes.length > 0) {
            const emotions = blendshapesToEmotions(shapes);
            setCurrentEmotions(emotions);
            setNoFaceDetected(false);
            onEmotionDetected?.(emotions);
          } else {
            setNoFaceDetected(true);
          }
        } catch (e) {
          // skip frame silently
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, onEmotionDetected]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Save ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!currentEmotions) {
      setSaveError('Belum ada emosi terdeteksi. Tunggu sebentar.');
      return;
    }
    setIsSaving(true);
    setSaveError(null);

    try {
      const payload: CreateEmotionEntryRequest = {
        dominantEmotion: getDominantEmotion(currentEmotions),
        emotionScores: currentEmotions,
      };
      const response = await apiClient.post('/api/emotions', payload);
      const entry: EmotionEntry = response.data;

      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());

      setSaveSuccess(true);
      setIsSaving(false);
      onSaveSuccess ? onSaveSuccess(entry) : router.push(`/journal?id=${entry.id}`);
    } catch (err) {
      console.error('Save error:', err);
      setSaveError('Gagal menyimpan. Pastikan sudah login dan backend berjalan.');
      setIsSaving(false);
    }
  };

  // ── Derived UI state ───────────────────────────────────────────────────
  const isDetecting = status === 'detecting';
  const showCameraFeed = permissionState === 'granted';
  const showOverlay = !currentEmotions || noFaceDetected;
  const dominant = currentEmotions ? getDominantEmotion(currentEmotions) : 'neutral';
  const recommendation = getRecommendation(dominant);
  const display: EmotionScores = currentEmotions ?? {
    happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 1,
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">

      {/* ── Left: Camera ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-slate-900"
          style={{ minHeight: '320px', aspectRatio: '4/3' }}
        >
          {/* Video element — always in DOM so ref stays valid */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${showCameraFeed ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Overlay: permission / loading screens */}
          {!showCameraFeed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
              {status === 'error' ? (
                <>
                  <span className="text-5xl">⚠️</span>
                  <p className="text-red-300 text-sm font-semibold max-w-xs">{error}</p>
                </>
              ) : status === 'loading_model' || status === 'camera_starting' ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-400 border-t-transparent" />
                  <p className="text-slate-300 text-sm font-medium max-w-xs">
                    {status === 'camera_starting' ? 'Membuka kamera...' : loadingStep}
                  </p>
                </>
              ) : status === 'ready' ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl">
                    📷
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">Model Siap</h3>
                    <p className="text-slate-400 text-sm">Aktifkan kamera untuk mulai deteksi emosi real-time</p>
                  </div>
                  <button
                    onClick={startCamera}
                    className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Mulai Kamera
                  </button>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet-400 border-t-transparent" />
                  <p className="text-slate-400 text-sm">Mempersiapkan...</p>
                </>
              )}
            </div>
          )}

          {/* No-face warning */}
          {showCameraFeed && noFaceDetected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-amber-100/90 text-amber-800 px-5 py-2.5 rounded-full shadow-xl border border-amber-300 flex items-center gap-2 animate-bounce backdrop-blur-sm">
                <span>🚨</span>
                <span className="font-bold text-sm">Wajah tidak terdeteksi</span>
              </div>
            </div>
          )}

          {/* Live indicator */}
          {showCameraFeed && isDetecting && !noFaceDetected && currentEmotions && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-white text-xs font-semibold">MediaPipe Live</span>
            </div>
          )}
        </div>

        {/* Error messages */}
        {status !== 'error' && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">⚠️ {error}</p>
          </div>
        )}
        {saveError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700">❌ {saveError}</p>
          </div>
        )}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-700">✅ Data emosi berhasil disimpan. Menuju Jurnal...</p>
          </div>
        )}
      </div>

      {/* ── Right: Analysis panel ────────────────────────────────────── */}
      <div className="relative w-full lg:w-80">
        {showOverlay && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-2xl">
            <div className="bg-slate-800 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span className="font-bold text-sm">Menunggu pemindaian...</span>
            </div>
          </div>
        )}

        <div className={`p-6 bg-white border border-slate-100 rounded-2xl shadow-md flex flex-col gap-5 transition-opacity duration-300 ${showOverlay ? 'opacity-40 grayscale-[50%]' : ''}`}>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">🧠 Analisis Emosional</h3>

          {/* Dominant badge */}
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: `${EMOTION_COLORS[dominant]}15`, borderColor: `${EMOTION_COLORS[dominant]}40` }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emosi Dominan</div>
            <div className="text-3xl font-extrabold capitalize" style={{ color: EMOTION_COLORS[dominant] }}>
              {EMOTION_LABELS[dominant]}
            </div>
          </div>

          {/* 5-spectrum bars */}
          <div className="space-y-3">
            {[
              { label: 'Sangat Positif', score: display.happy, color: EMOTION_COLORS.happy, active: ['happy'].includes(dominant) },
              { label: 'Positif', score: display.surprised, color: EMOTION_COLORS.surprised, active: ['surprised'].includes(dominant) },
              { label: 'Netral', score: display.neutral, color: EMOTION_COLORS.neutral, active: dominant === 'neutral' },
              { label: 'Negatif', score: Math.min(1, display.sad + display.fearful), color: EMOTION_COLORS.sad, active: ['sad', 'fearful'].includes(dominant) },
              { label: 'Sangat Negatif', score: Math.min(1, display.angry + display.disgusted), color: EMOTION_COLORS.angry, active: ['angry', 'disgusted'].includes(dominant) },
            ].map((item) => {
              const pct = Math.round(item.score * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${item.active ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{item.label}</span>
                    <span className={`text-sm tabular-nums ${item.active ? 'font-extrabold text-slate-800' : 'text-slate-400'}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendation */}
          {recommendation && (
            <div className={`p-4 rounded-xl border ${recommendation.color}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold flex items-center gap-1.5">{recommendation.icon} Rekomendasi Klinis</h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${recommendation.badge}`}>{recommendation.spectrum}</span>
              </div>
              <div className="mb-1.5">
                <div className="text-xs font-bold uppercase tracking-wide opacity-60 mb-0.5">Diagnosa (SDKI)</div>
                <div className="text-sm font-semibold">{recommendation.diagnosis}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide opacity-60 mb-0.5">Tindakan (SIKI)</div>
                <div className="text-sm font-semibold">{recommendation.action}</div>
              </div>
            </div>
          )}

          {/* Save button */}
          {!saveSuccess && (
            <button
              onClick={handleSave}
              disabled={isSaving || showOverlay || !isDetecting}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5"
            >
              {isSaving ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Menyimpan...</span></>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg><span>Simpan ke Jurnal</span></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
