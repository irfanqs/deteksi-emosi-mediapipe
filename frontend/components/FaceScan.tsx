'use client';

/**
 * FaceScan Component
 * 
 * Performs emotion detection via webcam using face-api.js.
 * Handles camera permissions, video streaming, real-time emotion detection,
 * saving emotion entries, and resource cleanup.
 * 
 * Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.9, 2.1, 11.1, 11.3
 */

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { initializeFaceApi, FaceApiInitializationError, getDefaultFaceDetectorOptions } from '@/lib/faceApi';
import { EmotionScores, EmotionType, EMOTION_LABELS, EMOTION_COLORS, CreateEmotionEntryRequest, EmotionEntry } from '@/types/emotion.types';
import apiClient from '@/lib/api-client';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'error';

interface FaceScanProps {
  onReady?: () => void;
  onError?: (error: Error) => void;
  onEmotionDetected?: (emotions: EmotionScores) => void;
  onSaveSuccess?: (entry: EmotionEntry) => void;
}

export default function FaceScan({ onReady, onError, onEmotionDetected, onSaveSuccess }: FaceScanProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState<EmotionScores | null>(null);
  const [noFaceDetected, setNoFaceDetected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize face-api.js models
  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        setIsInitializing(true);
        await initializeFaceApi();
        
        if (mounted) {
          setModelsLoaded(true);
          setIsInitializing(false);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof FaceApiInitializationError
            ? err.message
            : 'Failed to initialize face detection models';
          
          setError(errorMessage);
          setIsInitializing(false);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      }
    };

    loadModels();

    return () => {
      mounted = false;
    };
  }, [onError]);

  // Request camera permission and start video stream
  useEffect(() => {
    if (!modelsLoaded) return;

    let mounted = true;

    const startCamera = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });

        if (!mounted) {
          // Component unmounted during async operation, cleanup
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // Store stream reference for cleanup
        streamRef.current = stream;

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setPermissionState('granted');
        onReady?.();
      } catch (err) {
        if (!mounted) return;

        // Handle permission denied or other errors
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setPermissionState('denied');
            setError('Camera access denied. Please grant camera permission to use emotion detection.');
          } else if (err.name === 'NotFoundError') {
            setPermissionState('error');
            setError('No camera found. Please connect a camera to use emotion detection.');
          } else {
            setPermissionState('error');
            setError(`Camera error: ${err.message}`);
          }
          onError?.(err);
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
    };
  }, [modelsLoaded, onReady, onError]);

  // Emotion detection function
  const detectEmotions = async (): Promise<EmotionScores | null> => {
    if (!videoRef.current || !modelsLoaded) {
      return null;
    }

    try {
      // Detect single face with TinyFaceDetector and expressions
      const detection = await faceapi
        .detectSingleFace(videoRef.current, getDefaultFaceDetectorOptions())
        .withFaceExpressions();

      // No face detected
      if (!detection) {
        return null;
      }

      // Extract emotion scores from face-api.js expressions
      const expressions = detection.expressions;
      
      const emotionScores: EmotionScores = {
        happy: expressions.happy,
        sad: expressions.sad,
        angry: expressions.angry,
        fearful: expressions.fearful,
        disgusted: expressions.disgusted,
        surprised: expressions.surprised,
        neutral: expressions.neutral
      };

      return emotionScores;
    } catch (err) {
      console.error('Emotion detection error:', err);
      return null;
    }
  };

  // Start continuous emotion detection loop (every 100ms)
  useEffect(() => {
    if (permissionState !== 'granted' || !modelsLoaded) {
      return;
    }

    // Wait for video to be ready
    const video = videoRef.current;
    if (!video) return;

    const startDetection = () => {
      setIsDetecting(true);

      // Detection loop - runs every 100ms
      detectionIntervalRef.current = setInterval(async () => {
        const emotions = await detectEmotions();

        if (emotions) {
          // Face detected - update emotions
          setCurrentEmotions(emotions);
          setNoFaceDetected(false);
          onEmotionDetected?.(emotions);
        } else {
          // No face detected
          setNoFaceDetected(true);
        }
      }, 100);
    };

    // Start detection when video is playing
    if (video.readyState >= 2) {
      // Video is ready
      startDetection();
    } else {
      // Wait for video to be ready
      video.addEventListener('loadeddata', startDetection);
    }

    return () => {
      // Cleanup detection loop
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      setIsDetecting(false);
      video?.removeEventListener('loadeddata', startDetection);
    };
  }, [permissionState, modelsLoaded, onEmotionDetected]);

  // Cleanup: Release camera resources on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, []);

  // Calculate dominant emotion
  const getDominantEmotion = (emotions: EmotionScores): EmotionType => {
    let maxEmotion: EmotionType = 'neutral';
    let maxScore = 0;

    (Object.keys(emotions) as EmotionType[]).forEach((emotion) => {
      if (emotions[emotion] > maxScore) {
        maxScore = emotions[emotion];
        maxEmotion = emotion;
      }
    });

    return maxEmotion;
  };

  // Stop detection loop
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
  };

  // Release camera resources
  const releaseCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Save emotion entry
  const handleSaveEmotionEntry = async () => {
    if (!currentEmotions) {
      setSaveError('No emotions detected. Please wait for detection to complete.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Calculate dominant emotion
      const dominantEmotion = getDominantEmotion(currentEmotions);

      // Prepare request payload
      const payload: CreateEmotionEntryRequest = {
        dominantEmotion,
        emotionScores: currentEmotions,
        timestamp: new Date()
      };

      // Call backend API
      const response = await apiClient.post<EmotionEntry>('/api/emotions', payload);

      // Stop detection loop
      stopDetection();

      // Release camera resources
      releaseCamera();

      // Show success feedback
      setSaveSuccess(true);
      setIsSaving(false);

      // Notify parent component
      onSaveSuccess?.(response.data);
    } catch (err) {
      console.error('Failed to save emotion entry:', err);
      
      let errorMessage = 'Failed to save emotion entry. Please try again.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setSaveError(errorMessage);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-center">
      {/* Left Column: Video */}
      <div className="relative w-full lg:flex-1 aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover mirror absolute inset-0"
        />
        
        {/* Loading Overlay */}
        {isInitializing && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
              <p className="font-medium text-slate-200">Memuat model AI...</p>
            </div>
          </div>
        )}

        {/* Permission Prompt Overlay */}
        {permissionState === 'prompt' && modelsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
            <div className="text-center text-white p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <div className="text-4xl mb-3">📷</div>
              <p className="font-medium text-slate-200">Meminta akses kamera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Status & Results */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">
        {/* Status Indicator */}
        {permissionState === 'granted' && !error && (
          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
            <div className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Kamera Aktif</span>
            {isDetecting && <span className="text-sm text-slate-500 font-medium ml-2 border-l pl-3 border-slate-200">Mendeteksi emosi...</span>}
          </div>
        )}

        {/* Error Messages */}
        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5 text-xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">Kamera Eror</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                {permissionState === 'denied' && (
                  <div className="text-sm text-red-600 mt-3 p-3 bg-red-100/50 rounded-lg">
                    <p className="font-semibold mb-1">Cara memperbaiki:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Klik ikon kamera di bilah URL browser Anda</li>
                      <li>Pilih "Izinkan" untuk akses kamera</li>
                      <li>Segarkan halaman ini</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save Error Message */}
        {saveError && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl mt-0.5">❌</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">Gagal Menyimpan</h3>
                <p className="text-sm text-red-700 mt-1">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-emerald-500 text-xl mt-0.5">✅</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-emerald-800">Berhasil!</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  Data emosi Anda berhasil disimpan. Kamera telah dimatikan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Emotion Display - Always rendered to prevent height jumps */}
        {(() => {
          const fallbackEmotions: EmotionScores = { happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0, neutral: 1 };
          const displayEmotions = currentEmotions || fallbackEmotions;
          const showOverlay = !currentEmotions || noFaceDetected;
          const dominantMode = getDominantEmotion(displayEmotions);
          
          const getRecommendation = (emotion: EmotionType) => {
            switch (emotion) {
              case 'happy':
                return {
                  spectrum: 'Sangat Positif',
                  diagnosis: 'Kesiapan Peningkatan Koping',
                  action: 'Sharing: Motivasi untuk menebar kebaikan kepada sesama.',
                  icon: '🌟',
                  color: 'bg-amber-50 text-amber-900 border-amber-200',
                  badge: 'bg-amber-100 text-amber-800'
                };
              case 'surprised':
                return {
                  spectrum: 'Positif',
                  diagnosis: 'Kesiapan Peningkatan Konsep Diri',
                  action: 'Edukasi: Mempertahankan pola hidup sehat dan manajemen waktu.',
                  icon: '💡',
                  color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
                  badge: 'bg-emerald-100 text-emerald-800'
                };
              case 'neutral':
                return {
                  spectrum: 'Netral',
                  diagnosis: 'Pemeliharaan Kesehatan Tidak Efektif (Risiko)',
                  action: 'Aktivitas Fisik: Peregangan ringan dan hidrasi (minum air putih).',
                  icon: '💧',
                  color: 'bg-slate-50 text-slate-800 border-slate-200',
                  badge: 'bg-slate-200 text-slate-700'
                };
              case 'sad':
              case 'fearful':
                return {
                  spectrum: 'Negatif',
                  diagnosis: 'Ansietas / Duka Cita',
                  action: 'Relaksasi: Teknik nafas dalam.',
                  icon: '😮‍💨',
                  color: 'bg-blue-50 text-blue-900 border-blue-200',
                  badge: 'bg-blue-100 text-blue-800'
                };
              case 'angry':
              case 'disgusted':
                return {
                  spectrum: 'Sangat Negatif',
                  diagnosis: 'Risiko Perilaku Kekerasan / Keputusasaan',
                  action: 'Manajemen Marah: Mengubah posisi tubuh, atau konsultasi ahli.',
                  icon: '🛑',
                  color: 'bg-rose-50 text-rose-900 border-rose-200',
                  badge: 'bg-rose-100 text-rose-800'
                };
              default:
                return null;
            }
          };

          const recommendation = getRecommendation(dominantMode);

          return (
            <div className="relative w-full flex flex-col gap-4">
              {/* Overlay for face not found */}
              {showOverlay && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[3px] rounded-2xl transition-all duration-300">
                  {noFaceDetected && isDetecting ? (
                    <div className="bg-amber-100 text-amber-800 px-6 py-4 rounded-full shadow-xl border border-amber-300 flex items-center gap-3 animate-bounce">
                      <span className="text-2xl">🚨</span>
                      <span className="font-extrabold tracking-wide">Wajah tidak terdeteksi dalam frame</span>
                    </div>
                  ) : (
                    <div className="bg-slate-800 text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="font-bold tracking-wide">Menunggu pemindaian...</span>
                    </div>
                  )}
                </div>
              )}

              <div className={`w-full p-6 bg-white border border-slate-100 rounded-2xl shadow-md flex-1 flex flex-col transition-opacity duration-300 ${showOverlay ? 'opacity-40 grayscale-[50%]' : 'opacity-100'}`}>
                <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <span>🧠</span> Analisis Emosional
                </h3>

                {/* Dominant Emotion */}
                <div className="mb-6 p-4 rounded-xl border transition-colors duration-300" style={{ backgroundColor: `${EMOTION_COLORS[dominantMode]}10`, borderColor: `${EMOTION_COLORS[dominantMode]}30` }}>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emosi Dominan</div>
                  <div className="text-3xl font-extrabold capitalize transition-colors duration-300" style={{ color: EMOTION_COLORS[dominantMode] }}>
                    {EMOTION_LABELS[dominantMode]}
                  </div>
                </div>

                {/* All Emotion Scores */}
                <div className="space-y-4 flex-1 mb-6">
                  {[
                    { label: 'Sangat Positif', score: displayEmotions.happy, color: EMOTION_COLORS.happy, isDominant: ['happy'].includes(dominantMode) },
                    { label: 'Positif', score: displayEmotions.surprised, color: EMOTION_COLORS.surprised, isDominant: ['surprised'].includes(dominantMode) },
                    { label: 'Netral', score: displayEmotions.neutral, color: EMOTION_COLORS.neutral, isDominant: ['neutral'].includes(dominantMode) },
                    { label: 'Negatif', score: Math.min(1, displayEmotions.sad + displayEmotions.fearful), color: EMOTION_COLORS.sad, isDominant: ['sad', 'fearful'].includes(dominantMode) },
                    { label: 'Sangat Negatif', score: Math.min(1, displayEmotions.angry + displayEmotions.disgusted), color: EMOTION_COLORS.angry, isDominant: ['angry', 'disgusted'].includes(dominantMode) },
                  ].map((item) => {
                    const percentage = Math.round(item.score * 100);

                    return (
                      <div key={item.label} className="group relative">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-sm transition-colors duration-300 ${item.isDominant ? 'font-bold text-slate-900' : 'font-medium text-slate-500 group-hover:text-slate-700'}`}>
                            {item.label}
                          </span>
                          <span className={`text-sm transition-colors duration-300 ${item.isDominant ? 'font-extrabold text-slate-800' : 'font-semibold text-slate-400'}`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300 ease-out"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clinical Recommendations */}
                {recommendation && (
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${recommendation.color}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold flex items-center gap-2">
                        <span>{recommendation.icon}</span> Rekomendasi Klinis
                      </h4>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${recommendation.badge}`}>
                        {recommendation.spectrum}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">Diagnosa Keperawatan (SDKI)</div>
                      <div className="text-sm font-semibold">{recommendation.diagnosis}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">Tindakan Kesehatan (Klinis/SIKI)</div>
                      <div className="text-sm font-semibold">{recommendation.action}</div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {!saveSuccess && (
                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button
                      onClick={handleSaveEmotionEntry}
                      disabled={isSaving || showOverlay}
                      className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Menyimpan ke Jurnal...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          <span>Simpan Emosi Saat Ini</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}
