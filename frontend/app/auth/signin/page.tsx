"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * Sign In Page
 * Simple email-based authentication for Mental Wellness Tracker
 * Requirements: 8.1, 8.2
 */
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password: "dummy", // Not used but required by credentials provider
        redirect: false,
      });

      if (result?.error) {
        setError("Autentikasi gagal. Silakan coba lagi.");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success (using window.location to strictly refresh state)
      window.location.href = "/";
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md relative">
        {/* Background Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-20" />
        
        <div className="relative bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-4xl mb-4 border border-emerald-100 shadow-inner">
              🕌
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Mulai Muhasabah
            </h1>
            <p className="text-slate-600 font-medium leading-relaxed text-sm">
              Masuk dengan email untuk merekam jejak emosi dan menenangkan batin Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"
                placeholder="nama@email.com"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 text-white font-extrabold py-4 px-4 rounded-xl shadow-lg shadow-emerald-700/30 hover:shadow-xl hover:shadow-emerald-700/40 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : "Masuk Sekarang"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Tanpa ribet menggunakan kata sandi.<br />Kami membuatkan sesi akun untuk Anda secara otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
