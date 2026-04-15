'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import LogoutButton from './LogoutButton';

export default function DashboardNav() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = pathname?.startsWith('/admin');

  const features = isAdmin
    ? []
    : [
      { href: '/tasks', label: 'Tasks' },
      { href: '/questions', label: 'Community' },
      { href: '/my-questions', label: 'My Questions' },
      { href: '/notes', label: 'Notes' },
      { href: '/quiz', label: 'Quiz' },
      { href: '/settings', label: 'Settings' },
    ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (isAdmin) {
    return (
      <nav className="border-b border-neutral-200 bg-white sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <Link href="/admin/dashboard" className="flex items-center gap-3 text-neutral-900 group">
            <div className="w-7 h-7 bg-white rotate-45 flex items-center justify-center overflow-hidden border border-neutral-300 group-hover:border-emerald-500 transition-colors">
              <div className="w-3 h-3 bg-emerald-500 -rotate-45 scale-0 group-hover:scale-100 transition-transform" />
            </div>
            <span className="font-serif font-semibold text-xl tracking-tight -mt-0.5">Terminal Root</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 hidden sm:block">
              CONNECTION: SECURE
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>
    );
  }

  const isFeatureActive = features.some(item => pathname === item.href);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 text-slate-900 group mr-6">
              <div className="w-7 h-7 bg-[#111111] rotate-45 flex items-center justify-center overflow-hidden border border-neutral-300 group-hover:bg-emerald-900 transition-colors">
                <div className="w-3 h-3 bg-white -rotate-45" />
              </div>
              <span className="font-serif font-semibold text-xl tracking-tight -mt-0.5">Ragra Prep</span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 text-sm transition-colors ${pathname === '/dashboard'
                  ? 'text-slate-900 font-medium'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                Dashboard
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5 ${isFeatureActive
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  Features
                  <svg
                    className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-slate-200 py-1 z-50 rounded-md">
                    {features.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`block px-3 py-1.5 text-[13px] transition-colors ${pathname === item.href
                          ? 'text-blue-600 bg-blue-50/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <div className="hidden md:block">
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-2 py-2 text-[13px] transition-colors ${pathname === '/dashboard' ? 'text-zinc-900 font-medium' : 'text-zinc-500'
                }`}
            >
              Dashboard
            </Link>
            {features.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-2 py-2 text-[13px] transition-colors ${pathname === item.href ? 'text-emerald-600' : 'text-zinc-500'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-zinc-100 px-2">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
