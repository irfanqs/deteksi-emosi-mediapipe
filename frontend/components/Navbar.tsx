'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/dashboard', label: 'Dasbor' },
    { href: '/journal', label: 'Jurnal' },
  ];  

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <Image 
                src="/images/logo/logo-emosyah 2.png" 
                alt="Logo Emosyah" 
                width={150} 
                height={70} 
                className="h-16 sm:h-20 w-auto object-contain transform group-hover:scale-105 transition-transform"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? 'text-violet-600 font-semibold'
                    : 'text-gray-600 hover:text-violet-600'
                } transition-colors duration-200 text-sm font-medium`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/journal"
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 hover:from-violet-500 to-fuchsia-600 hover:to-fuchsia-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Lihat Jurnal
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-violet-600 focus:outline-none p-2 rounded-lg hover:bg-violet-50 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white border-b border-gray-100 shadow-xl px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                pathname === link.href
                  ? 'text-violet-700 bg-violet-50 border border-violet-100'
                  : 'text-gray-600 hover:text-violet-700 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/journal"
            onClick={() => setIsOpen(false)}
            className="block mt-4 px-4 py-3 text-center text-base font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl shadow-md active:scale-95 transition-transform"
          >
            Lihat Jurnal
          </Link>
        </div>
      </div>
    </nav>
  );
}
