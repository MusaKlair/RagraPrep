'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  tag: string;
}

const navItems: NavItem[] = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    tag: 'DSH',
  },
  {
    href: '/admin/questions',
    label: 'Questions',
    tag: 'QRY',
  },
  {
    href: '/admin/students',
    label: 'Students',
    tag: 'STD',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-emerald-500 text-white px-4 py-3 font-mono text-[10px] uppercase tracking-widest shadow-lg transition-colors hover:bg-emerald-600"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '[CLOSE MENU]' : '[OPEN MENU]'}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-neutral-900/40 z-[45] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Architectural Light Mode */}
      <aside className={`w-64 bg-white border-r border-neutral-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-[50] overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:z-30`}>
        <div className="p-6 border-b border-neutral-200 mb-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1">
            Admin Controls
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            System Active
          </div>
        </div>

        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 transition-colors group relative ${isActive
                  ? 'bg-neutral-50 border border-neutral-200'
                  : 'bg-transparent border border-transparent hover:border-neutral-200 hover:bg-neutral-50/50'
                  }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                )}
                <span className={`font-mono text-[10px] uppercase tracking-widest ${isActive ? 'text-emerald-600' : 'text-neutral-400 group-hover:text-emerald-500'
                  }`}>
                  [{item.tag}]
                </span>
                <span className={`font-mono text-[11px] uppercase tracking-widest ${isActive ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-900'
                  }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
