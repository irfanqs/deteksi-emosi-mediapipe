'use client';

import FaceScan from '@/components/FaceScan';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 pt-16 md:pt-28 pb-20 md:pb-32">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] rounded-full bg-fuchsia-200 opacity-60 blur-3xl filter hidden sm:block"></div>
        <div className="absolute top-40 left-0 -ml-20 w-[300px] h-[300px] rounded-full bg-violet-200 opacity-60 blur-3xl filter"></div>
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-orange-100 opacity-60 blur-3xl filter"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-violet-100 shadow-sm text-sm font-semibold text-violet-700 mb-8 mx-auto mt-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
            </span>
            AI Pendeteksi Emosi Real-time
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm leading-tight">
            Pahami <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500">Emosi</span> Anda.
            <br className="hidden md:block" /> Kuasai Pikiran Anda.
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed px-2">
            Teman setia kesehatan mental Anda. Deteksi emosi secara real-time, catat perjalanan suasana hati harian Anda, dan raih hidup yang sejahtera.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <a 
              href="#scan-section" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Pindai Wajah Sekarang
              <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
            <Link 
              href="/journal" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              Buka Jurnal
              <span role="img" aria-label="book" className="text-xl">📖</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Face Scan Section */}
      <section id="scan-section" className="relative py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight">Pemindai Emosi AI</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">Tataplah ke kamera dan biarkan jaringan kecerdasan buatan kami mendeteksi kondisi emosional Anda secara instan dan aman.</p>
          </div>
          
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2rem] shadow-2xl p-4 md:p-8 lg:p-10 border border-slate-800 relative z-10 box-border">
             {/* MacOS style window controls */}
             <div className="absolute top-4 left-5 md:top-6 md:left-6 flex gap-2">
               <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] shadow-sm border border-black/20"></div>
               <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] shadow-sm border border-black/20"></div>
               <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-[#27c93f] shadow-sm border border-black/20"></div>
             </div>
             
             <div className="mt-8 md:mt-8 relative z-20">
               <FaceScan />
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight">Fitur Lengkap Perekam Mental</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk melacak, memahami, dan meningkatkan kesehatan mental Anda setiap hari.</p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 md:p-10 border border-slate-100 group">
              <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                ✨
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Analisis Wajah AI</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Kenali emosimu secara instan berkat teknologi pendeteksi wajah terkini langsung dari browser. Semua aman, tidak ada data yang keluar dari perangkatmu.</p>
            </div>
            
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 md:p-10 border border-slate-100 group">
              <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                📝
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Jurnal Berbasis Emosi</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Luapkan segala pikiran dan kepenatan di sini. Kaitkan setiap tulisan dengan emosi yang paling pekat untuk mengenali diri lebih dalam.</p>
            </div>
            
            <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8 md:p-10 border border-slate-100 group">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all">
                📈
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Melacak Kemajuan</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Saksikan fluktuasi perubahan dari waktu ke waktu melalui grafik tajam dan temukan makna tersembunyi dari pergerakan suasana hatimu.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 md:py-16 text-center text-slate-500">
        <p className="flex items-center justify-center gap-2 text-lg font-medium">Dibuat dengan <span className="text-red-500 animate-pulse text-xl">❤️</span> untuk kesehatan mental yang lebih baik.</p>
      </footer>
    </main>
  );
}
