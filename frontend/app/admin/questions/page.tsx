import DashboardNav from '@/components/DashboardNav';
import AdminSidebar from '@/components/AdminSidebar';
import AdminQuestionsClient from './AdminQuestionsClient';

export default async function AdminQuestionsPage() {
  const user = { name: "Mock Admin", email: "admin@example.com", role: "ADMIN" };

  const questions = [
    {
      id: '1',
      title: 'Mock Question 1',
      content: 'This is a mocked question content.',
      createdAt: new Date(),
      user: { id: 'u1', name: 'John Doe', email: 'john@example.com' },
      _count: { answers: 5 }
    }
  ] as any;

  return (
    <div className="min-h-screen bg-[#111111] text-[#FAFAFA] font-sans">
      <DashboardNav />
      <AdminSidebar />

      <div className="lg:ml-64 max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        {/* Terminal Header */}
        <div className="mb-12 border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] text-emerald-500 uppercase tracking-[0.2em] font-medium mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Root Access Granted
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">Protocol Ledger</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Global query overview and moderation index.
            </p>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">
            Node Status: <span className="text-emerald-500">ONLINE</span>
          </div>
        </div>

        <AdminQuestionsClient questions={questions} />
      </div>
    </div>
  );
}
