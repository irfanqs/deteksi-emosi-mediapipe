import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AuraWell | Mental Wellness Tracker",
  description: "Track your emotions, log your mood, and improve your mental wellness with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen text-slate-900 overflow-x-hidden selection:bg-violet-200 selection:text-violet-900 antialiased">
        <SessionProvider>
          <Navbar />
          <div className="pt-16 sm:pt-20">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
