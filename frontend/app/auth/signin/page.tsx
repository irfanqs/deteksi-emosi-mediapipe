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

      // Redirect to journal on success (since dashboard doesn't exist)
      router.push("/journal");
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rekam Jejak Emosi
          </h1>
          <p className="text-gray-600">
            Jaga dan pahami kesehatan mentalmu melalui catatan harian.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm hover:border-violet-300"
              placeholder="email.anda@contoh.com"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? "Sedang login..." : "Masuk Sekarang"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Tanpa ribet menggunakan kata sandi. Kami membuatkan akun untukmu secara otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
