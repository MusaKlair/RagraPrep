import Link from 'next/link';

export default async function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-neutral-900 selection:text-white">

      {/* 1. Navigation Restyling */}
      <nav className="border-b border-neutral-200 bg-[#FAFAFA]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link href="/" className="flex items-center gap-3 text-neutral-900 group">
              <div className="w-7 h-7 bg-[#111111] rotate-45 flex items-center justify-center overflow-hidden border border-neutral-300 group-hover:bg-emerald-900 transition-colors">
                <div className="w-3 h-3 bg-white -rotate-45" />
              </div>
              <span className="font-serif font-semibold text-xl tracking-tight -mt-0.5">Ragra Prep</span>
            </Link>

            <div className="flex items-center gap-8">
              <Link
                href="/login"
                className="font-mono text-[10px] text-neutral-500 hover:text-neutral-900 uppercase tracking-widest transition-colors hidden sm:block"
              >
                Access Platform
              </Link>
              <Link
                href="/signup"
                className="bg-[#111111] text-white font-mono text-[10px] px-6 py-2.5 uppercase tracking-widest hover:bg-emerald-900 transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                Start Preparation
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* 2. The Hero Section (The "Terminal" Hook) */}
      <section className="relative overflow-hidden pt-24 pb-32 border-b border-neutral-200">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-[0.2em] font-medium border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
                  Elite Preparation Platform
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-serif text-neutral-900 mb-8 leading-[1.1] tracking-tight">
                Master your exams. <br className="hidden md:block" />
                <span className="italic text-neutral-500 font-light">Structure your success.</span>
              </h1>

              <p className="text-lg md:text-xl text-neutral-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                An intense, high-focus study environment. Stop using generic tools and leverage an engineered platform to track tasks, organize notes, and crush your deadlines.
              </p>

              <div className="flex justify-center lg:justify-start gap-4">
                <Link
                  href="/signup"
                  className="bg-neutral-900 text-white px-8 py-4 font-mono text-[11px] font-semibold uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-black"
                >
                  Create Master Ledger
                </Link>
                <Link
                  href="/login"
                  className="bg-white text-neutral-900 border border-neutral-300 px-8 py-4 font-mono text-[11px] font-semibold uppercase tracking-widest hover:border-neutral-900 transition-colors"
                >
                  Authenticate
                </Link>
              </div>
            </div>

            {/* Simulated Desktop/Terminal Graphic */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none relative">
              <div className="bg-[#111111] border border-neutral-800 shadow-2xl shadow-neutral-900/20 aspect-video overflow-hidden group">
                <div className="h-8 border-b border-neutral-800 flex items-center px-4 gap-2 bg-[#1A1A1A]">
                  <div className="w-2 h-2 rounded-full bg-neutral-700" />
                  <div className="w-2 h-2 rounded-full bg-neutral-700" />
                  <div className="w-2 h-2 rounded-full bg-neutral-700" />
                </div>
                <div className="p-8 relative h-full">
                  {/* Fake Data rendering */}
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[60px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />

                  <div className="flex justify-between items-end border-b border-neutral-800 pb-4 mb-6">
                    <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Next Exam Deadline
                    </div>
                    <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                      T-Minus 8 Days
                    </div>
                  </div>

                  <h3 className="font-serif text-3xl font-light text-white mb-6">Advanced Computer Architecture</h3>

                  <div className="flex items-center gap-4 border-t border-neutral-800 pt-6">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">Syllabus Completion</span>
                    <div className="w-full bg-neutral-800 h-px flex-1">
                      <div className="bg-emerald-500 w-[78%] h-px" />
                    </div>
                    <span className="font-mono text-[10px] text-emerald-500">78%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. System Telemetry (Stats Section) */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200 border-x border-neutral-200">
            {[
              { label: 'Active Students', val: '10K+' },
              { label: 'Exam Pass Rate', val: '95%' },
              { label: 'Questions Logged', val: '50K+' },
              { label: 'Community Support', val: '24/7' }
            ].map((stat, i) => (
              <div key={i} className="p-8 lg:p-12 text-center flex flex-col items-center justify-center">
                <div className="font-mono text-4xl lg:text-5xl font-light text-neutral-900 mb-2">{stat.val}</div>
                <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Capabilities (Features Section) */}
      <section className="py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6 tracking-tight">
              A Focused Study Environment
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl font-light">
              We eliminated the fluff. The Ragra Prep dashboard is designed exclusively to compress the time required to prepare, organize your notes, and connect with peers.
            </p>
          </div>

          {/* Architectural Feature Grid */}
          <div className="grid md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200">

            <div className="bg-white p-10 lg:p-12 group hover:bg-[#FAFAFA] transition-colors relative overflow-hidden">
              <div className="w-12 h-12 border border-neutral-300 bg-neutral-50 flex items-center justify-center mb-8 rotate-45 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              </div>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-900 mb-4">Master Task Ledger</h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Never miss an assignment. Log every task, homework, and exam target, and let the dashboard organize your priorities automatically.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </div>

            <div className="bg-white p-10 lg:p-12 group hover:bg-[#FAFAFA] transition-colors relative">
              <div className="w-12 h-12 border border-neutral-300 bg-neutral-50 flex items-center justify-center mb-8 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                <span className="font-mono text-[10px]">T-0</span>
              </div>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-900 mb-4">Deadline Telemetry</h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Instantly visualize your upcoming week. Our dashboard calculates remaining effort to deadlines and highlights overdue assignments.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </div>

            <div className="bg-white p-10 lg:p-12 group hover:bg-[#FAFAFA] transition-colors relative">
              <div className="w-12 h-12 border border-neutral-300 bg-neutral-50 flex items-center justify-center mb-8 rounded-full group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                <div className="w-4 h-4 border border-neutral-900 rounded-full" />
              </div>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-900 mb-4">Peer Review Network</h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                Avoid isolation during exam season. Seamlessly log questions to the community and synthesize complex concept notes alongside other students.
              </p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </div>

          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="bg-[#111111] text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.3em] font-medium mb-8">
            Final Preparation Step
          </div>
          <h2 className="text-5xl md:text-6xl font-serif mb-12 tracking-tight leading-[1.1]">
            Ready to crush your next exam?
          </h2>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-white text-[#111111] px-12 py-5 font-mono text-sm font-bold uppercase tracking-[0.2em] hover:bg-emerald-50 hover:scale-[1.02] active:scale-95 transition-all outline-none border-2 border-transparent shadow-[0_0_40px_rgba(52,211,153,0.15)] hover:shadow-[0_0_60px_rgba(52,211,153,0.3)]"
          >
            Engage System
          </Link>
        </div>
      </section>

      {/* 6. Footer (Stripped Down) */}
      <footer className="bg-white border-t border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 text-neutral-900 group mb-6 inline-flex">
                <div className="w-6 h-6 bg-[#111111] rotate-45 flex items-center justify-center border border-neutral-300">
                  <div className="w-2.5 h-2.5 bg-white -rotate-45" />
                </div>
                <span className="font-serif font-semibold text-lg tracking-tight -mt-0.5">Ragra Prep</span>
              </Link>
              <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest max-w-sm leading-relaxed">
                Elite Preparation Architecture. <br />
                Built for High-Velocity Exam Success.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-[10px] text-neutral-900 uppercase tracking-widest mb-6 border-b border-neutral-200 pb-2">Infrastructure</h4>
              <ul className="space-y-4 font-mono text-[10px] uppercase tracking-wider">
                <li><Link href="/login" className="text-neutral-500 hover:text-emerald-700 transition-colors">Authenticate</Link></li>
                <li><Link href="/signup" className="text-neutral-500 hover:text-emerald-700 transition-colors">Deploy Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] text-neutral-900 uppercase tracking-widest mb-6 border-b border-neutral-200 pb-2">Protocols</h4>
              <ul className="space-y-4 font-mono text-[10px] uppercase tracking-wider">
                <li><a href="#" className="text-neutral-500 hover:text-emerald-700 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-emerald-700 transition-colors">System Data</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-emerald-700 transition-colors">Privacy Shield</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              © {new Date().getFullYear()} Ragra Prep. All Systems Operational.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
