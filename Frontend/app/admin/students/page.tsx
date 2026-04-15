import DashboardNav from '@/components/DashboardNav';
import AdminSidebar from '@/components/AdminSidebar';
import UserManagementClient from '@/components/UserManagementClient';

export default async function AdminStudentsPage() {
  const user = { id: 'admin1', name: "Mock Admin", email: "admin@example.com", role: "ADMIN" };

  const allUsers: { id: string; email: string; name: string; role: 'ADMIN' | 'STUDENT'; createdAt: Date }[] = [
    { id: '1', email: 'student1@example.com', name: 'John Doe', role: 'STUDENT', createdAt: new Date() },
    { id: 'admin1', email: 'admin@example.com', name: 'Mock Admin', role: 'ADMIN', createdAt: new Date() }
  ];

  const students = allUsers.filter((u) => u.role === 'STUDENT');
  const admins = allUsers.filter((u) => u.role === 'ADMIN');
  const totalUsers = allUsers.length;

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
            <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">User Registry</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Manage local node permissions and registry records.
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
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Total Registry</p>
                <p className="font-serif text-4xl text-white">{totalUsers}</p>
              </div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center bg-[#111111]">
                <span className="font-mono text-[10px] text-emerald-500">ALL</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] p-6 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Student Nodes</p>
                <p className="font-serif text-4xl text-emerald-500">{students.length}</p>
              </div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center bg-[#111111]">
                <span className="font-mono text-[10px] text-emerald-500">STD</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] p-6 hover:bg-neutral-900 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Admin Nodes</p>
                <p className="font-serif text-4xl text-white">{admins.length}</p>
              </div>
              <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center bg-[#111111]">
                <span className="font-mono text-[10px] text-emerald-500">ADM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Ledger */}
        <div className="bg-[#111111] border border-neutral-800">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neutral-600 rotate-45" />
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white">Full Identity Roster</h2>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Modify clearances manually</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-[#111111]">
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Identifier</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Comms Vector</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Clearance</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal">Injection Date</th>
                  <th className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500 font-normal text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-600">No identities in registry</span>
                    </td>
                  </tr>
                ) : (
                  allUsers.map((userItem) => (
                    <tr
                      key={userItem.id}
                      className="hover:bg-neutral-900/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 border border-neutral-800 flex items-center justify-center text-xs text-neutral-500 bg-[#111111]">
                            {(userItem.name || userItem.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-white group-hover:text-emerald-400 transition-colors">
                            {userItem.name || 'UNKNOWN_ENTITY'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-neutral-400">{userItem.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest border ${userItem.role === 'ADMIN'
                            ? 'bg-neutral-900 text-white border-neutral-700'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            }`}
                        >
                          [{userItem.role}]
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[10px] uppercase tracking-widest text-neutral-500">
                        {new Date(userItem.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).toUpperCase()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <UserManagementClient
                          userId={userItem.id}
                          userRole={userItem.role}
                          currentUserId={user.id}
                        />
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
