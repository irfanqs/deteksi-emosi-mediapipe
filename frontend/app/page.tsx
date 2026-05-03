'use client';

import FaceScan from '@/components/FaceScan';
import AyatOfTheDay from '@/components/AyatOfTheDay';
import IslamicDzikir from '@/components/IslamicDzikir';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col font-sans">

      {/* ── Hero + Ayat of the Day (horizontal) ── */}
      <section className="relative z-10 min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: hero text */}
          <div className="flex-1 min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white backdrop-blur-md text-sm font-bold text-emerald-700 mb-8 shadow-sm shadow-emerald-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              AI Mental Wellness Tracker Islami
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900 drop-shadow-sm">
              Kenali <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700">Hatimu.</span>
              <br /> Tenangkan Jiwamu.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-xl mb-10 leading-relaxed font-medium">
              Deteksi kondisi emosi melalui ekspresi wajah secara <strong className="text-slate-800">real-time</strong>. Dapatkan rekomendasi berlandaskan nilai Islami &amp; pedoman klinis untuk ketenangan batin Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
              <a
                href="#scan-section"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-teal-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Mulai Pindai Wajah
                <svg className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <Link
                href="/journal"
                className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 shadow-sm rounded-2xl font-bold backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                Lihat Jurnal
                <span>📖</span>
              </Link>
            </div>
          </div>

          {/* Right: Ayat of the Day card */}
          <div className="w-full lg:w-[480px] xl:w-[520px] flex-shrink-0">
            <AyatOfTheDay />
          </div>

        </div>
      </section>

      {/* ── Face Scan Section ── */}
      <section id="scan-section" className="relative z-10 min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
              <span>🔬</span> Muhasabah Emosi
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Pindai Kondisi Hatimu</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              Teknologi AI menganalisis 52 titik wajah untuk membantu mengenali suasana hatimu. 100% aman, data diproses lokal, dan senantiasa menjaga privasi Anda.
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-white shadow-[0_30px_100px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* MacOS decorative bar */}
            <div className="w-full h-12 bg-white/40 border-b border-slate-100 flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm"></div>
            </div>

            <div className="p-4 md:p-8">
              <FaceScan />
            </div>
          </div>
        </div>
      </section>

      {/* ── Islamic Features Section ── */}
      <section className="relative z-10 min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">
              <span>🌙</span> Amalan Harian
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Dzikir & Wirid Harian</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              Lengkapi ibadah harianmu dengan dzikir pagi petang, penghitung istighfar, dan sholawat. Karena hati yang dzikir adalah hati yang hidup.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <IslamicDzikir />
          </div>
        </div>
      </section>

      {/* ── Fitur Ketenangan Jiwa ── */}
      <section className="relative z-10 min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Fitur Ketenangan Jiwa</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              Panduan holistik dan alat bantu Islami untuk merawat kesehatan mental dan spiritual Anda setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: '🔍',
                title: 'Muhasabah Real-time',
                desc: 'Pemindaian instan 52 titik wajah untuk mengenali emosi dominan Anda. Kenali hati sebelum melangkah.',
                color: 'from-fuchsia-50 to-white',
                border: 'border-fuchsia-100',
                iconBg: 'bg-fuchsia-100',
                ayat: 'فَٱعْتَبِرُوا۟ يَٰٓأُولِى ٱلْأَبْصَٰرِ',
                ayatTr: 'Maka ambillah pelajaran wahai orang-orang yang mempunyai pandangan. (QS. Al-Hasyr: 2)',
              },
              {
                icon: '📿',
                title: 'Dzikir & Muhasabah',
                desc: 'Wirid pagi petang, penghitung istighfar dan sholawat, serta pengingat kehadiran Allah dalam setiap aktivitas.',
                color: 'from-amber-50 to-white',
                border: 'border-amber-100',
                iconBg: 'bg-amber-100',
                ayat: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
                ayatTr: "Hanya dengan mengingat Allah hati menjadi tentram. (QS. Ar-Ra'd: 28)",
              },
              {
                icon: '🌱',
                title: 'Tazkiyatun Nafs',
                desc: 'Intervensi Syariah berbasis SDKI, murottal Al-Qur\'an, dan nutrisi Thibbun Nabawi untuk menyucikan jiwa.',
                color: 'from-emerald-50 to-white',
                border: 'border-emerald-100',
                iconBg: 'bg-emerald-100',
                ayat: 'قَدْ أَفْلَحَ مَن زَكَّىٰهَا',
                ayatTr: 'Sungguh beruntung orang yang menyucikannya (jiwa). (QS. Asy-Syams: 9)',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white hover:${f.border} shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${f.iconBg} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500`}>
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium mb-4">{f.desc}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <p
                      className="text-right text-base text-slate-700 mb-1 leading-relaxed"
                      style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
                    >
                      {f.ayat}
                    </p>
                    <p className="text-[11px] text-slate-400 italic leading-relaxed">{f.ayatTr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ukhuwah CTA ── */}
      <section className="relative z-10 min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto w-full">
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-700 via-teal-700 to-green-800 p-10 md:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-300">
            {/* Decorative star */}
            <div className="absolute top-4 right-6 opacity-10 pointer-events-none" aria-hidden>
              <svg width="80" height="80" viewBox="0 0 100 100" fill="white">
                <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z"/>
              </svg>
            </div>
            <div className="absolute bottom-4 left-6 opacity-10 pointer-events-none rotate-12" aria-hidden>
              <svg width="60" height="60" viewBox="0 0 100 100" fill="white">
                <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z"/>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">🤲</div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Mulai Perjalanan Menuju Jiwa yang Sehat</h2>
              <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Integrasikan kecerdasan buatan dan spiritualitas Islam untuk merawat kesehatan mental Anda secara Parpurna.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="#scan-section"
                  className="px-8 py-3.5 bg-white text-emerald-700 font-extrabold rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  Muhasabah Sekarang
                </a>
                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold rounded-2xl transition-all backdrop-blur-sm hover:-translate-y-0.5"
                >
                  Lihat Dasbor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
