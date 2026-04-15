import { Suspense } from 'react';
import TasksPageContent from './TasksPageContent';

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">Initializing Ledger...</div>}>
      <TasksPageContent />
    </Suspense>
  );
}
