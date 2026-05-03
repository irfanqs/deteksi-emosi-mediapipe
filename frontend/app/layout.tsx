import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "EMO-SYAH | Mental Wellness Tracker Islami",
  description: "Deteksi emosi dan kesehatan mental dengan nilai-nilai Islami.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFD] min-h-screen text-slate-800 overflow-x-hidden selection:bg-amber-200 antialiased font-sans islamic-bg-pattern">
        {/* ── Global Background Gradients (Islamic warm mesh) ── */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-white">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-200/50 blur-[100px] mix-blend-multiply" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-200/40 blur-[90px] mix-blend-multiply" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-teal-100/60 blur-[110px] mix-blend-multiply" />
          <div className="absolute top-[40%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-yellow-100/40 blur-[120px] mix-blend-multiply" />
        </div>

        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="relative z-0 pt-16 sm:pt-20 flex-grow flex flex-col pb-20 md:pb-0">
              {children}
            </div>
            
            {/* Footer Desktop */}
            <footer className="hidden md:block w-full bg-white border-t border-slate-200 mt-auto z-40 relative text-slate-500">
              <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm font-medium">
                <div className="text-slate-400 text-xs">
                  &copy; {new Date().getFullYear()} EMO-SYAH. Dibuat dengan <span className="text-fuchsia-500">❤️</span> untuk kesehatan mental umat.
                </div>
                <div className="text-slate-300 text-xs italic" style={{ fontFamily: "'Amiri', serif" }}>
                  أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ
                </div>
              </div>
            </footer>

            {/* Bottom Nav Mobile */}
            <footer className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
              <div className="flex justify-around items-center px-2 py-3 text-[10px] font-bold text-slate-500">
                <a href="/" className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors">
                  <span className="text-2xl mb-0.5">🏠</span>
                  Beranda
                </a>
                <a href="/journal" className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors">
                  <span className="text-2xl mb-0.5">📖</span>
                  Riwayat
                </a>
                <a href="/dashboard" className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors">
                  <span className="text-2xl mb-0.5">🕌</span>
                  Dasbor
                </a>
                <a href="#" className="flex flex-col items-center gap-1 hover:text-emerald-700 transition-colors">
                  <span className="text-2xl mb-0.5">⚙️</span>
                  Pengaturan
                </a>
              </div>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
