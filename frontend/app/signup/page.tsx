'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.error || 'Signup failed';
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      toast.success('Account created successfully!');
      // Redirect to student dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const errorMsg = 'An error occurred. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAFA] text-[#111111] font-sans selection:bg-neutral-900 selection:text-white">

      {/* Left Column - Signup Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-24 border-r border-neutral-200 bg-white relative">
        <div className="w-full max-w-sm mx-auto">

          <Link href="/" className="inline-flex items-center gap-3 text-neutral-900 group mb-16">
            <div className="w-7 h-7 bg-[#111111] rotate-45 flex items-center justify-center overflow-hidden border border-neutral-300 group-hover:bg-emerald-900 transition-colors">
              <div className="w-3 h-3 bg-white -rotate-45" />
            </div>
            <span className="font-serif font-semibold text-xl tracking-tight -mt-0.5">Ragra Prep</span>
          </Link>

          <div className="mb-10">
            <h2 className="text-4xl font-serif text-neutral-900 mb-3 tracking-tight">Deploy Account</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Initialize your academic workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-mono tracking-wide">
                [ERROR]: {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                  Student Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 font-mono text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                  Student Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 font-mono text-sm"
                  placeholder="scholar@university.edu"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm tracking-widest"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] text-white py-4 font-mono text-[11px] font-semibold uppercase tracking-widest hover:bg-emerald-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#111111]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Deploying...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            Existing Student?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold border-b border-emerald-600/30 pb-0.5">
              Authenticate Here
            </Link>
          </p>

        </div>

        {/* Footnote */}
        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none hidden lg:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-300">
            End-to-end Encrypted Session
          </p>
        </div>
      </div>

      {/* Right Column - Brand Presentation */}
      <div className="hidden lg:flex flex-col justify-between bg-[#111111] py-12 px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <Link href="/" className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest border border-neutral-800 px-4 py-2 hover:bg-neutral-900 transition-colors bg-[#111111]">
            ← Return to Surface
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 mb-6 border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-[0.3em] font-medium">
              New Node Registration
            </span>
          </div>

          <h2 className="text-4xl font-serif text-white mb-6 leading-tight">
            "Relying on memory is a failure of organization. Standardize your process."
          </h2>

          <div className="w-12 h-px bg-neutral-800 mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">
              <span>Task Ledgers</span>
              <span className="text-emerald-500">Unrestricted</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">
              <span>Analytics</span>
              <span className="text-emerald-500">Available</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">
              <span>Peer Network</span>
              <span className="text-emerald-500">Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
