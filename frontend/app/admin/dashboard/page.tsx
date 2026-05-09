import DashboardNav from '@/components/DashboardNav';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';

export default async function AdminDashboard() {
  const user = { name: "Mock Admin", email: "admin@example.com", role: "ADMIN" };

  const totalStudents = 120;

  const recentStudents = [
    { id: '1', email: 'student1@example.com', name: 'John Doe', createdAt: new Date() },
    { id: '2', email: 'student2@example.com', name: 'Jane Smith', createdAt: new Date() }
  ];

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
            <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">System Overview</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Operator: {user.name || user.email}
            </p>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">
            Node Status: <span className="text-emerald-500">ONLINE</span>
          </div>
        </div>


        {/* Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 mb-12">

          <div className="bg-[#111111] p-6 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Registered Students</p>
                <p className="font-serif text-4xl text-white">{totalStudents}</p>
              </div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center bg-[#111111]">
                <span className="font-mono text-[10px] text-emerald-500">USR</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] p-6 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Admin Nodes</p>
                <p className="font-serif text-4xl text-white">1</p>
              </div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center bg-[#111111]">
                <span className="font-mono text-[10px] text-emerald-500">ADM</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] p-6 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Total System Load</p>
                <p className="font-serif text-4xl text-white">{totalStudents + 1}</p>
              </div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center bg-[#111111]">
                <span className="font-mono text-[10px] text-emerald-500">SYS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-[#111111] border border-neutral-800">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center gap-3">
            <div className="w-2 h-2 bg-neutral-600 rotate-45" />
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white">Recent Student Injections</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-[#111111]">
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Identifier</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Comms Vector</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {recentStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">No telemetry data available</span>
                    </td>
                  </tr>
                ) : (
                  recentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-neutral-900/50 transition-colors group">
                      <td className="py-4 px-6 text-xs text-white group-hover:text-emerald-400 transition-colors">
                        {student.name || 'UNKNOWN_ENTITY'}
                      </td>
                      <td className="py-4 px-6 text-xs text-neutral-400">{student.email}</td>
                      <td className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
