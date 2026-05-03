'use client';

type EmotionSpectrum = 'sangat_positif' | 'positif' | 'netral' | 'negatif' | 'sangat_negatif';

interface IntervensiData {
  spectrum: string;
  kondisi: string;
  diagnosaSDKI: string;
  intervensiSyariah: {
    label: string;
    detail: string;
  };
  tindakanKlinis: string;
  murottal: {
    surah: string;
    maqam: string;
    alasan: string;
  };
  thibbunNabawi: {
    makanan: string;
    manfaat: string;
  };
  color: string;
  badge: string;
  icon: string;
}

const INTERVENSI_MAP: Record<EmotionSpectrum, IntervensiData> = {
  sangat_positif: {
    spectrum: 'Sangat Positif',
    kondisi: 'Bahagia, Puas, Ceria',
    diagnosaSDKI: 'Kesiapan Peningkatan Koping',
    intervensiSyariah: {
      label: 'Sujud Syukur',
      detail: 'Renungkan hakikat syukur agar tidak kufur nikmat. Perbanyak doa dan berbagi kebaikan kepada sesama.',
    },
    tindakanKlinis: 'Berbagi motivasi kebaikan kepada sesama. Manfaatkan energi positif untuk produktivitas.',
    murottal: {
      surah: 'Surah Ar-Rahman',
      maqam: 'Maqam Hijaz',
      alasan: 'Melambungkan rasa syukur dan keindahan nikmat-Nya.',
    },
    thibbunNabawi: {
      makanan: 'Madu Murni + Kurma Ajwa',
      manfaat: 'Memperkuat imunitas dan mempertahankan energi positif.',
    },
    color: 'from-amber-50 to-yellow-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    icon: '🌟',
  },
  positif: {
    spectrum: 'Positif',
    kondisi: 'Tenang, Damai, Optimis',
    diagnosaSDKI: 'Kesiapan Peningkatan Konsep Diri',
    intervensiSyariah: {
      label: 'Tahmid & Istiqamah',
      detail: 'Jaga istiqamah dengan memperbanyak bacaan Alhamdulillah. Renungkan nikmat Allah dalam ketenangan.',
    },
    tindakanKlinis: 'Pertahankan pola hidup sehat dan manajemen waktu yang baik.',
    murottal: {
      surah: 'Surah Al-Mulk',
      maqam: 'Maqam Saba',
      alasan: 'Mengokohkan ketenangan jiwa dan keimanan pada kekuasaan Allah.',
    },
    thibbunNabawi: {
      makanan: 'Zaitun + Talbinah',
      manfaat: 'Menstabilkan hormon serotonin dan menjaga kesehatan jantung.',
    },
    color: 'from-emerald-50 to-green-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    icon: '🌿',
  },
  netral: {
    spectrum: 'Netral',
    kondisi: 'Datar, Biasa Saja',
    diagnosaSDKI: 'Pemeliharaan Kesehatan Tidak Efektif (Risiko)',
    intervensiSyariah: {
      label: 'Muraqabah',
      detail: 'Ingat kehadiran Allah dalam setiap rutinitas harian. Lakukan muhasabah diri sebelum tidur.',
    },
    tindakanKlinis: 'Lakukan peregangan ringan, hidrasi cukup (minum air putih), dan atur jadwal tidur.',
    murottal: {
      surah: 'Surah Al-Kahfi',
      maqam: 'Maqam Rast',
      alasan: 'Membangkitkan semangat dan refleksi diri dari kisah-kisah Qur\'an.',
    },
    thibbunNabawi: {
      makanan: 'Air Zam-zam + Habbatussauda',
      manfaat: 'Menjaga vitalitas dan metabolisme tubuh secara alami.',
    },
    color: 'from-slate-50 to-blue-50 border-slate-200',
    badge: 'bg-slate-200 text-slate-700',
    icon: '💧',
  },
  negatif: {
    spectrum: 'Negatif',
    kondisi: 'Sedih, Cemas, Bingung',
    diagnosaSDKI: 'Ansietas / Duka Cita',
    intervensiSyariah: {
      label: 'Istighfar & Sabar',
      detail: 'Perbanyak istighfar dan bangun husnuzan (prasangka baik) kepada takdir Allah. Bacalah doa setelah sholat.',
    },
    tindakanKlinis: 'Teknik nafas dalam 4-7-8. Dengarkan lantunan ayat suci. Tidur cukup dan jaga pola makan (Sunnah & Medis).',
    murottal: {
      surah: 'Surah Al-Inshirah + Yusuf',
      maqam: 'Maqam Nahawand',
      alasan: 'Menenangkan hati yang gundah dan mengingatkan bahwa setiap kesulitan ada kemudahan.',
    },
    thibbunNabawi: {
      makanan: 'Madu + Jahe Hangat',
      manfaat: 'Menurunkan kadar kortisol (hormon stres) secara alami.',
    },
    color: 'from-blue-50 to-indigo-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    icon: '😮‍💨',
  },
  sangat_negatif: {
    spectrum: 'Sangat Negatif',
    kondisi: 'Marah, Putus Asa, Tertekan',
    diagnosaSDKI: 'Risiko Perilaku Kekerasan / Keputusasaan',
    intervensiSyariah: {
      label: "Ta'awudz & Doa",
      detail: "Larang diri dari berputus asa dari rahmat Allah. Baca ta'awudz (A'udzubillah). Ambil air wudhu untuk menenangkan diri.",
    },
    tindakanKlinis: 'Anjuran berwudhu, ubah posisi tubuh (berdiri → duduk → berbaring). Jika berlanjut, konsultasi dengan psikolog Muslim.',
    murottal: {
      surah: 'Surah Al-Fatihah + Al-Baqarah (awal)',
      maqam: 'Maqam Bayati',
      alasan: 'Membersihkan jiwa dari emosi negatif dan kembali pada ketenangan ilahi.',
    },
    thibbunNabawi: {
      makanan: 'Kurma + Susu Hangat',
      manfaat: 'Meningkatkan serotonin dan merilekskan sistem saraf.',
    },
    color: 'from-rose-50 to-red-50 border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    icon: '🛑',
  },
};

function emotionToSpectrum(emotion: string): EmotionSpectrum {
  if (emotion === 'happy') return 'sangat_positif';
  if (emotion === 'surprised') return 'positif';
  if (emotion === 'neutral') return 'netral';
  if (emotion === 'sad' || emotion === 'fearful') return 'negatif';
  if (emotion === 'angry' || emotion === 'disgusted') return 'sangat_negatif';
  return 'netral';
}

interface Props {
  dominantEmotion?: string;
}

export default function SyariahIntervensi({ dominantEmotion = 'neutral' }: Props) {
  const spectrum = emotionToSpectrum(dominantEmotion);
  const data = INTERVENSI_MAP[spectrum];

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${data.color} p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <span>🕌</span> Intervensi Syariah & Klinis
        </h3>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${data.badge}`}>
          {data.icon} {data.spectrum}
        </span>
      </div>

      {/* Kondisi & Diagnosa */}
      <div className="mb-4 p-3 bg-white/60 rounded-2xl border border-white backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Kondisi Emosi</div>
            <div className="text-sm font-bold text-slate-700">{data.kondisi}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Diagnosa (SDKI)</div>
            <div className="text-sm font-bold text-slate-700">{data.diagnosaSDKI}</div>
          </div>
        </div>
      </div>

      {/* Syariah Intervention */}
      <div className="mb-3 p-4 bg-white/70 rounded-2xl border border-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🌙</span>
          <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Intervensi Spiritual</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md ml-auto">{data.intervensiSyariah.label}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{data.intervensiSyariah.detail}</p>
      </div>

      {/* Clinical Action */}
      <div className="mb-3 p-4 bg-white/70 rounded-2xl border border-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🩺</span>
          <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Tindakan Klinis (SIKI)</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{data.tindakanKlinis}</p>
      </div>

      {/* Murottal */}
      <div className="mb-3 p-4 bg-white/70 rounded-2xl border border-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🎵</span>
          <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Murottal Al-Qur&apos;an</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-bold text-slate-700 text-sm">{data.murottal.surah}</div>
            <div className="text-xs text-slate-500">{data.murottal.alasan}</div>
          </div>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-lg flex-shrink-0">{data.murottal.maqam}</span>
        </div>
      </div>

      {/* Thibbun Nabawi */}
      <div className="p-4 bg-white/70 rounded-2xl border border-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🌿</span>
          <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Nutrisi Thibbun Nabawi</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-bold text-slate-700 text-sm">{data.thibbunNabawi.makanan}</div>
            <div className="text-xs text-slate-500">{data.thibbunNabawi.manfaat}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
