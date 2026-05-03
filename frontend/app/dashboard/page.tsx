import DashboardNav from '@/components/DashboardNav';
import Link from 'next/link';

interface Question {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  createdAt: string;
}

export default async function StudentDashboard() {
  const user = { id: 'student1', name: "Mock Student", email: "student@example.com", role: "STUDENT" };

  let taskCount = 5;
  let completedTaskCount = 2;
  let overdueCount = 1;
  let pendingCount = 3;
  let myQuestionsCount = 2;
  let myQuestions: Question[] = [
    { id: 'q1', title: 'Calculus Help', type: 'MATH', createdAt: new Date().toISOString() },
    { id: 'q2', title: 'React Hooks', type: 'CS', createdAt: new Date(Date.now() - 86400000).toISOString() }
  ];
  let myNotesCount = 2;
  let myNotes: Note[] = [
    { id: 'n1', title: 'Physics Chapter 4', createdAt: new Date().toISOString() },
    { id: 'n2', title: 'History Essay Draft', createdAt: new Date(Date.now() - 10000000).toISOString() }
  ];
  let nextTask = { id: 't1', title: 'Finish Assignment', deadline: new Date(Date.now() + 86400000) };
  let tasksDueTodayCount = 1;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(todayStart);
    date.setDate(todayStart.getDate() + i);
    return {
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      taskCount: i === 0 ? 1 : (i === 2 ? 3 : 0),
      isToday: i === 0,
    };
  });

  const firstName = user.name?.split(' ')[0] || user.email.split('@')[0];

  // Calculate Next Deadline Countdown
  let daysUntilNextDeadline: number | null = null;
  if (nextTask && nextTask.deadline) {
    const ms = new Date(nextTask.deadline).getTime() - new Date().getTime();
    daysUntilNextDeadline = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-neutral-900 selection:text-white pb-24">
      {/* 1. Top Navigation (Persistent) */}
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Header */}
        <header className="mb-10 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-3">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-neutral-900">
              Welcome back, {firstName}.
            </h1>
          </div>

          {/* 2. Performance Snapshot (Compact Metrics Strip) */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 border-t xl:border-t-0 border-neutral-200 pt-6 xl:pt-0">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Total Tasks</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-light text-neutral-900">{taskCount}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Completed</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-light text-neutral-900">{completedTaskCount}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Pending</span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-light text-neutral-900">{pendingCount}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>

            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Overdue</span>
              <div className="flex items-baseline gap-2">
                <span className={`font-mono text-2xl font-light ${overdueCount > 0 ? 'text-rose-600' : 'text-neutral-900'}`}>{overdueCount}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 1. Hero Section (Primary Focus Area) */}
        <section className="mb-16">
          <div className="group relative bg-[#111111] text-white p-8 md:p-12 border border-[#222222] shadow-2xl shadow-neutral-900/10 overflow-hidden">
            {/* Ambient lighting effect */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none transition-opacity duration-1000 opacity-50 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10">

              {/* Left: Dynamic Greeting & Countdown */}
              <div className="max-w-2xl flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Today's Focus
                  </span>

                  {overdueCount > 0 && (
                    <span className="font-mono text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 uppercase tracking-widest">
                      Attention: {overdueCount} Overdue
                    </span>
                  )}
                </div>

                {nextTask ? (
                  <>
                    <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-2 leading-tight">
                      {tasksDueTodayCount > 0
                        ? `You have ${tasksDueTodayCount} task${tasksDueTodayCount === 1 ? '' : 's'} due today.`
                        : "Focus locked. Ready to execute."}
                    </h2>
                    <p className="text-neutral-400 font-mono text-sm uppercase tracking-wider mb-8">
                      Next Objective: <span className="text-white">{nextTask.title}</span>
                    </p>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Next Deadline</span>
                        <div className="text-xl font-light font-mono text-emerald-400">
                          {daysUntilNextDeadline !== null
                            ? daysUntilNextDeadline === 0 ? 'Today' : `T-Minus ${daysUntilNextDeadline} Days`
                            : 'Unscheduled'}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <h2 className="text-3xl md:text-5xl font-serif tracking-tight mb-4 leading-tight">
                    You're all caught up for today.
                  </h2>
                )}
              </div>

              {/* Right: CTAs */}
              <div className="flex flex-col lg:items-end justify-center gap-4 shrink-0">
                {nextTask ? (
                  <>
                    <Link href={`/tasks/${nextTask.id}`} className="inline-flex justify-center items-center px-8 py-4 bg-white text-black font-mono text-xs font-semibold uppercase tracking-widest hover:bg-emerald-50 hover:scale-[1.02] active:scale-95 transition-all outline-none border-2 border-transparent">
                      Start Deep Work
                    </Link>
                    <Link href="/tasks/new" className="inline-flex justify-center items-center px-8 py-4 bg-transparent text-white font-mono text-xs font-semibold uppercase tracking-widest hover:bg-neutral-900 border border-neutral-700 hover:border-neutral-500 transition-colors">
                      Create New Task
                    </Link>
                  </>
                ) : (
                  <Link href="/tasks/new" className="inline-flex justify-center items-center px-8 py-4 bg-white text-black font-mono text-xs font-semibold uppercase tracking-widest hover:bg-emerald-50 hover:scale-[1.02] active:scale-95 transition-all outline-none border-2 border-transparent">
                    Create New Task
                  </Link>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* 3. Smart Activity Section (Collaboration + Action Zone) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Column – Recent Activity (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-16">

            {/* Recent Questions */}
            <section>
              <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4 mb-6">
                <h3 className="text-xl font-serif text-neutral-900 tracking-tight">Recent Questions</h3>
                <Link href="/questions" className="font-mono text-[10px] text-neutral-400 hover:text-emerald-700 uppercase tracking-[0.15em] transition-colors border-b border-transparent hover:border-emerald-700 pb-0.5">
                  View All &rarr;
                </Link>
              </div>

              {myQuestions.length === 0 ? (
                <div className="py-12 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center bg-neutral-50/50">
                  <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-4">No questions asked yet.</span>
                  <Link href="/questions" className="font-mono text-[10px] bg-white border border-neutral-200 px-4 py-2 hover:border-neutral-400 transition-colors uppercase tracking-widest text-neutral-900">
                    View Questions
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col border border-neutral-200 bg-white">
                  {myQuestions.map((q, index) => (
                    <Link key={q.id} href={`/questions/${q.id}`} className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-neutral-50 transition-all ${index !== myQuestions.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                      <div className="flex flex-col gap-2 mb-2 sm:mb-0">
                        <span className="text-neutral-900 font-medium group-hover:text-emerald-700 transition-colors md:text-lg">{q.title}</span>
                        <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                          <span className="bg-neutral-100 px-2 py-0.5 text-neutral-600">{q.type}</span>
                          <span className="text-neutral-300">&bull;</span>
                          <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                        View Thread &rarr;
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Notes */}
            <section>
              <div className="flex items-baseline justify-between border-b border-neutral-200 pb-4 mb-6">
                <h3 className="text-xl font-serif text-neutral-900 tracking-tight">Recent Notes</h3>
                <Link href="/notes" className="font-mono text-[10px] text-neutral-400 hover:text-emerald-700 uppercase tracking-[0.15em] transition-colors border-b border-transparent hover:border-emerald-700 pb-0.5">
                  View All &rarr;
                </Link>
              </div>

              {myNotes.length === 0 ? (
                <div className="py-12 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center bg-neutral-50/50">
                  <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest mb-4">No notes created yet.</span>
                  <Link href="/notes" className="font-mono text-[10px] bg-white border border-neutral-200 px-4 py-2 hover:border-neutral-400 transition-colors uppercase tracking-widest text-neutral-900">
                    View Notes
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myNotes.map((note) => (
                    <Link key={note.id} href={`/notes/${note.id}`} className="group p-6 bg-white border border-neutral-200 hover:border-emerald-500/30 transition-colors flex flex-col justify-between min-h-[140px] relative">
                      <span className="font-mono text-[10px] text-emerald-600 font-medium uppercase tracking-widest mb-3 block">{new Date(note.createdAt).toLocaleDateString()}</span>
                      <h4 className="text-neutral-900 font-medium text-lg leading-snug line-clamp-3 relative z-10 group-hover:text-emerald-700 transition-colors">{note.title}</h4>

                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                    </Link>
                  ))}
                </div>
              )}
            </section>

          </div>

          {/* Right Column – Quick Actions & Calendar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-10">

            <div className="sticky top-10">

              <h4 className="font-mono text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-4">Quick Actions</h4>
              <div className="flex flex-col gap-3 mb-10">
                <Link href="/tasks" className="group flex items-center justify-between p-5 bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wider font-mono">Create Task</span>
                    <span className="text-xs text-neutral-500">Plan your next study session</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </Link>

                <Link href="/questions" className="group flex items-center justify-between p-5 bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wider font-mono">Ask Question</span>
                    <span className="text-xs text-neutral-500">Get help from the community</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </Link>

                <Link href="/notes" className="group flex items-center justify-between p-5 bg-white border border-neutral-200 hover:border-neutral-900 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wider font-mono">Create Note</span>
                    <span className="text-xs text-neutral-500">Capture a new concept</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                </Link>
              </div>

              {/* 4. Mini Weekly Calendar */}
              <h4 className="font-mono text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-4">Weekly Outlook</h4>
              <div className="bg-white border border-neutral-200 p-1 flex justify-between gap-1 overflow-x-auto">
                {weekDays.map((day, i) => (
                  <Link
                    key={i}
                    href="/tasks"
                    className={`min-w-[40px] flex-1 flex flex-col items-center justify-center py-4 rounded-sm transition-all group hover:bg-neutral-50 cursor-pointer shrink-0
                      ${day.isToday ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-transparent text-neutral-900'}`}
                  >
                    <span className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${day.isToday ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      {day.dayName.charAt(0)}
                    </span>
                    <span className={`text-lg font-mono font-medium ${day.isToday ? 'text-white' : 'text-neutral-900'}`}>
                      {day.dayNumber}
                    </span>

                    {/* Task Count Badge indicator */}
                    <div className="h-4 mt-1 flex items-center justify-center">
                      {day.taskCount > 0 ? (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${day.isToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-200 text-neutral-600'}`}>
                          {day.taskCount}
                        </span>
                      ) : (
                        <span className="w-1 h-1 rounded-full bg-neutral-200 opacity-50 block"></span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
