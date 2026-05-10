'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardNav from '@/components/DashboardNav';
import RichTextEditor from '@/components/RichTextEditor';
import CustomDatePicker from '@/components/DatePicker';

interface Task {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

type TabType = 'all' | 'overdue' | 'completed' | 'pending';

export default function TasksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'all'
  );
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['all', 'overdue', 'completed', 'pending'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data.tasks || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setTitle('');
    setContent('');
    setDeadline('');
    setShowModal(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setContent(task.content);
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
      const payload = {
        title: title.trim(),
        content: content || '',
        deadline: deadline || null,
      };

      if (editingTask) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }

      setShowModal(false);
      setEditingTask(null);
      setTitle('');
      setContent('');
      setDeadline('');
      fetchTasks();
      toast.success(editingTask ? 'Task updated successfully' : 'Task created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast.promise(
      axios.delete(`/api/tasks/${id}`).then(() => fetchTasks()),
      {
        loading: 'Deleting task...',
        success: 'Task deleted successfully',
        error: 'Failed to delete task',
      }
    );
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await axios.put(`/api/tasks/${task.id}`, { completed: !task.completed });
      fetchTasks();
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task marked as complete');
    } catch (error: any) {
      toast.error('Failed to update task');
    }
  };

  const filterTasks = (tasks: Task[], tab: TabType): Task[] => {
    const now = new Date();

    switch (tab) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'overdue':
        return tasks.filter(task => {
          if (task.completed || !task.deadline) return false;
          return new Date(task.deadline) < now;
        });
      case 'pending':
        return tasks.filter(task => {
          if (task.completed || !task.deadline) return false;
          return new Date(task.deadline) >= now;
        });
      case 'all':
      default:
        return tasks;
    }
  };

  const filteredTasks = filterTasks(tasks, activeTab);

  const getTabCount = (tab: TabType): number => {
    return filterTasks(tasks, tab).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">Loading Ledger...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif text-neutral-900 mb-2">Master Task Ledger</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Log, track, and execute your academic targets.</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-[#111111] text-white px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-[#111111]"
          >
            Create New Task
          </button>
        </div>

        {/* Tabs - Monospace Ledger Style */}
        <div className="mb-8 border-b border-neutral-200 overflow-x-auto">
          <nav className="flex space-x-8 min-w-max">
            {[
              { id: 'all' as TabType, label: 'All Tasks' },
              { id: 'pending' as TabType, label: 'Pending' },
              { id: 'overdue' as TabType, label: 'Overdue' },
              { id: 'completed' as TabType, label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2 ${activeTab === tab.id
                  ? 'border-neutral-900 text-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'
                  }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 border ${activeTab === tab.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-500'}`}>
                  {getTabCount(tab.id)}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-16 text-center max-w-2xl mx-auto mt-16">
            <div className="w-12 h-12 border border-neutral-300 mx-auto flex items-center justify-center mb-6 rotate-45 bg-neutral-50">
              <div className="w-2 h-2 bg-neutral-900 rounded-full" />
            </div>
            <h3 className="font-serif text-2xl text-neutral-900 mb-2">Ledger is Empty</h3>
            <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mb-8">No tasks match current filter parameters.</p>
            <button
              onClick={handleCreate}
              className="bg-white text-neutral-900 border border-neutral-300 px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:border-neutral-900 transition-colors"
            >
              Initialize First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200">
            {filteredTasks.map((task) => {
              const deadlineDate = task.deadline ? new Date(task.deadline) : null;
              const isOverdue = deadlineDate && deadlineDate < new Date() && !task.completed;
              const isDueSoon = deadlineDate && deadlineDate > new Date() && deadlineDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && !task.completed;

              return (
                <div
                  key={task.id}
                  className={`bg-white p-6 relative group transition-colors flex flex-col h-full ${task.completed ? 'opacity-50 grayscale' : 'hover:bg-[#FAFAFA]'
                    } ${isOverdue ? 'bg-red-50/20' : ''}`}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${task.completed ? 'bg-neutral-300' :
                    isOverdue ? 'bg-red-500' :
                      isDueSoon ? 'bg-amber-500' : 'bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500'
                    }`} />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 mt-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task)}
                          className="w-4 h-4 border-neutral-300 text-emerald-600 focus:ring-emerald-500 rounded-none cursor-pointer"
                        />
                      </div>
                      <h3
                        className={`font-serif text-lg leading-snug tracking-tight text-neutral-900 ${task.completed ? 'line-through text-neutral-500' : ''
                          }`}
                      >
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Snippet */}
                  <div className="flex-1 min-h-0 mb-6">
                    <div
                      className="text-neutral-600 text-sm font-light leading-relaxed line-clamp-3 prose prose-sm prose-neutral"
                      dangerouslySetInnerHTML={{ __html: task.content }}
                    />
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      {deadlineDate ? (
                        <div className={`font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-semibold' :
                          isDueSoon ? 'text-amber-600 font-semibold' : 'text-neutral-500'
                          }`}>
                          <span className={`w-1 h-1 rounded-full ${isOverdue ? 'bg-red-500 animate-pulse' : isDueSoon ? 'bg-amber-500' : 'bg-neutral-400'}`} />
                          {isOverdue ? 'OVERDUE: ' : isDueSoon ? 'DUE SOON: ' : 'T-MINUS '}
                          {deadlineDate.toLocaleDateString()} {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : (
                        <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                          No Deadline
                        </div>
                      )}
                      <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                        Logged: {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(task)}
                        className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors border-b border-transparent hover:border-neutral-900 pb-0.5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600 pb-0.5"
                      >
                        Drop
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal -> Control Panel Style */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setEditingTask(null);
                setTitle('');
                setContent('');
                setDeadline('');
              }
            }}
          >
            <div className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-hidden border border-neutral-300 shadow-2xl">

              {/* Header */}
              <div className="border-b border-neutral-200 px-8 py-6 bg-[#FAFAFA] flex justify-between items-start">
                <div>
                  <div className="font-mono text-[9px] text-emerald-600 uppercase tracking-[0.2em] font-medium mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    System Input Required
                  </div>
                  <h2 className="text-2xl font-serif text-neutral-900">
                    {editingTask ? 'Reconfigure Task Parameter' : 'Initialize New Task Parameter'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setTitle('');
                    setContent('');
                    setDeadline('');
                  }}
                  className="text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content Form */}
              <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                    Objective Title <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 font-mono text-sm"
                    placeholder="e.g., Complete System Architecture Review"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                    Execution Deadline
                  </label>
                  <CustomDatePicker
                    value={deadline}
                    onChange={setDeadline}
                    placeholder="YYYY-MM-DD HH:MM"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                    Detailed Protocol (Notes)
                  </label>
                  <div className="border border-neutral-300 bg-[#FAFAFA] focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition-colors">
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Define specific requirements and constraints..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-5 border-t border-neutral-200 bg-[#FAFAFA] flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                    setTitle('');
                    setContent('');
                    setDeadline('');
                  }}
                  className="px-6 py-2.5 bg-white text-neutral-900 border border-neutral-300 font-mono text-[10px] uppercase tracking-widest hover:border-neutral-900 transition-colors"
                >
                  Abort
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  className="px-6 py-2.5 bg-[#111111] text-white border border-[#111111] font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Saving...
                    </>
                  ) : editingTask ? 'Compile Update' : 'Execute Creation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
