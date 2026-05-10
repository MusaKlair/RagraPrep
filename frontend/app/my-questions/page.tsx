'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import DashboardNav from '@/components/DashboardNav';
import Image from 'next/image';
import QuestionModal from '@/components/QuestionModal';

interface Question {
  id: string;
  title: string;
  type: string;
  description: string;
  images: string[];
  userId: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export default function MyQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchMyQuestions();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data.user) {
        setCurrentUser(data.user.id);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchMyQuestions = async () => {
    try {
      const { data } = await axios.get('/api/questions/my');
      setQuestions(data.questions || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error('Failed to load your queries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast.promise(
      axios.delete(`/api/questions/${id}`).then(() => fetchMyQuestions()),
      {
        loading: 'Purging query...',
        success: 'Query purged successfully',
        error: 'Failed to purge query',
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">Scanning Local Node...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-neutral-200 pb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-serif text-neutral-900 mb-2">My Queries</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Manage questions broadcasted from this node.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/questions"
              className="bg-white text-neutral-900 px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:border-neutral-900 transition-colors border border-neutral-300 flex-1 md:flex-none text-center"
            >
              Network View
            </Link>
            <Link
              href="/questions/new"
              className="bg-[#111111] text-white px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-[#111111] flex-1 md:flex-none text-center"
            >
              Execute Query
            </Link>
          </div>
        </div>

        {/* Ledger Grid */}
        <div className="bg-white border border-neutral-200">
          {/* Ledger Header */}
          <div className="hidden md:flex items-center px-6 py-4 border-b border-neutral-200 bg-[#FAFAFA]">
            <div className="w-2/3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">Query Protocol</div>
            <div className="w-1/3 font-mono text-[10px] uppercase tracking-widest text-neutral-500 pl-8 border-l border-neutral-200">Attached Data</div>
          </div>

          {questions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 border border-neutral-300 mx-auto flex items-center justify-center mb-6 bg-neutral-50 rotate-45">
                <div className="w-2 h-2 bg-neutral-900 rounded-full" />
              </div>
              <h3 className="font-serif text-xl text-neutral-900 mb-2">No Active Queries</h3>
              <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mb-6">This node has not broadcasted any questions.</p>
              <Link
                href="/questions/new"
                className="inline-block bg-[#111111] text-white px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-[#111111]"
              >
                Execute First Query
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {questions.map((question) => (
                <div
                  key={question.id}
                  onClick={() => {
                    setSelectedQuestion(question);
                    setIsModalOpen(true);
                  }}
                  className="flex flex-col md:flex-row group hover:bg-[#FAFAFA] transition-colors cursor-pointer relative"
                >
                  {/* Hover accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                  {/* Left Side: Query Details */}
                  <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 select-none">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1">
                          {question.type}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                          Node: YOU
                        </span>
                      </div>

                      {/* Embedded Delete Action to match the Ledger style instead of a red floating button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(question.id);
                        }}
                        className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Purge Protocol"
                      >
                        [PURGE]
                      </button>
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif text-neutral-900 mb-4 leading-snug group-hover:text-emerald-900 transition-colors">
                      {question.title}
                    </h2>

                    <div
                      className="text-neutral-600 font-light leading-relaxed mb-6 prose prose-sm prose-neutral line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: question.description }}
                    />

                    <div className="mt-auto pt-4 border-t border-neutral-100 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                      Logged: {new Date(question.createdAt).toLocaleDateString()} {new Date(question.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Right Side: Attached Images */}
                  <div className="w-full md:w-1/3 p-6 md:p-8 bg-neutral-50/50 border-t md:border-t-0 md:border-l border-neutral-200 flex flex-col justify-center">
                    {question.images.length > 0 ? (
                      <div className="space-y-4">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">
                          Visual Data Attached
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {question.images.slice(0, 2).map((url, index) => (
                            <div
                              key={index}
                              className="relative aspect-square border border-neutral-300 hover:border-emerald-500 transition-colors bg-white overflow-hidden"
                            >
                              <Image
                                src={url}
                                alt={`Attachment ${index + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                          ))}
                        </div>
                        {question.images.length > 2 && (
                          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 text-right">
                            +{question.images.length - 2} Additional Files
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-center opacity-50 grayscale">
                        <div className="w-8 h-8 border border-neutral-300 flex items-center justify-center mb-2 bg-white">
                          <span className="font-mono text-[10px] text-neutral-300">∅</span>
                        </div>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">No Visual Data</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <QuestionModal
        question={selectedQuestion}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuestion(null);
        }}
        onDelete={handleDelete}
        canDelete={true}
      />
    </div>
  );
}
