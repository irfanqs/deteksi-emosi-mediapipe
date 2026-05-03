'use client';

import FaceScan from '@/components/FaceScan';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col font-sans">
      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-28 md:pt-40 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white backdrop-blur-md text-sm font-bold text-fuchsia-600 mb-8 mx-auto mt-4 shadow-sm shadow-fuchsia-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-500"></span>
          </span>
          AI Mental Wellness Tracker
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900 drop-shadow-sm">
          Kenali <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600">Hatimu.</span>
          <br className="hidden md:block" /> Tenangkan Jiwamu.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Deteksi kondisi emosi melalui ekspresi wajah secara <strong className="text-slate-800">real-time</strong>. Dapatkan rekomendasi berlandaskan nilai Islami & pedoman klinis untuk ketenangan batin Anda.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#scan-section" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white rounded-2xl font-bold shadow-xl shadow-violet-200 hover:shadow-2xl hover:shadow-fuchsia-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Mulai Pindai Wajah
            <svg className="w-5 h-5 text-fuchsia-200 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
          <Link 
            href="/journal" 
            className="w-full sm:w-auto px-8 py-4 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 shadow-sm rounded-2xl font-bold backdrop-blur-sm transition-all flex items-center justify-center gap-2"
          >
            Lihat Jurnal
            <span>📖</span>
          </Link>
        </div>
      </section>

      {/* ── Face Scan Section ── */}
      <section id="scan-section" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Muhasabah Emosi & Batin</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Teknologi AI menganalisis 52 titik wajah untuk membantu mengenali suasana hatimu. 100% aman, data diproses lokal, dan senantiasa menjaga privasi Anda.</p>
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

      {/* ── Glassmorphism Features Section ── */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Fitur Ketenangan Jiwa</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Panduan dan alat bantu holistik untuk merawat kesehatan mental dan spiritual Anda setiap hari.</p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: '✨', title: 'Muhasabah Real-time', desc: 'Pemindaian instan untuk mengenali emosi dominan yang sedang Anda rasakan secara presisi.', color: 'from-fuchsia-50 to-white', border: 'border-fuchsia-100', iconBg: 'bg-fuchsia-100' },
              { icon: '📓', title: 'Jurnal Perasaan', desc: 'Catat unek-unek harian Anda sebagai rekam jejak untuk lebih mengenali dan menata hati.', color: 'from-violet-50 to-white', border: 'border-violet-100', iconBg: 'bg-violet-100' },
              { icon: '🌱', title: 'Holistik & Spiritual', desc: 'Dapatkan rekomendasi medis berdasar Standar SDKI yang disempurnakan dengan pendekatan spiritual Islami.', color: 'from-indigo-50 to-white', border: 'border-indigo-100', iconBg: 'bg-indigo-100' }
            ].map((f, i) => (
              <div key={i} className={`relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white hover:${f.border} shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 group overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-b ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${f.iconBg} rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500`}>
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}
