'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import QuestionModal from '@/components/QuestionModal';
import axios from 'axios';
import { toast } from 'sonner';

interface Answer {
  id: string;
  description: string;
  images: string[];
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Question {
  id: string;
  title: string;
  type: string;
  description: string;
  images: string[];
  userId: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  _count?: {
    answers: number;
  };
}

interface AdminQuestionsClientProps {
  questions: Question[];
}

export default function AdminQuestionsClient({ questions: initialQuestions }: AdminQuestionsClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [answersExpandedIds, setAnswersExpandedIds] = useState<Set<string>>(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, Answer[]>>({});
  const [loadingAnswers, setLoadingAnswers] = useState<Record<string, boolean>>({});
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const toggleAnswersExpand = async (questionId: string) => {
    const newExpanded = new Set(answersExpandedIds);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
      if (!questionAnswers[questionId]) {
        setLoadingAnswers(prev => ({ ...prev, [questionId]: true }));
        try {
          const { data } = await axios.get(`/api/questions/${questionId}/answers`);
          setQuestionAnswers(prev => ({ ...prev, [questionId]: data.answers || [] }));
        } catch (error) {
          console.error('Failed to load responses:', error);
        } finally {
          setLoadingAnswers(prev => ({ ...prev, [questionId]: false }));
        }
      }
    }
    setAnswersExpandedIds(newExpanded);
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion({
      ...question,
      createdAt: question.createdAt instanceof Date ? question.createdAt.toISOString() : question.createdAt,
    } as any);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('WARNING: Initiate permanent deletion protocol for this query branch? All attached responses will be wiped.')) {
      return;
    }

    setDeletingQuestionId(questionId);
    try {
      await axios.delete(`/api/questions/${questionId}`);
      toast.success('Query branch permanently purged');
      setQuestions(questions.filter((q) => q.id !== questionId));
      setQuestionAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
      setExpandedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
      setAnswersExpandedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Purge protocol failed');
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const handleDeleteAnswer = async (answerId: string, questionId: string) => {
    if (!confirm('WARNING: Purge this individual response?')) {
      return;
    }

    setDeletingAnswerId(answerId);
    try {
      await axios.delete(`/api/answers/${answerId}`);
      toast.success('Response purged');
      setQuestionAnswers(prev => ({
        ...prev,
        [questionId]: (prev[questionId] || []).filter((a) => a.id !== answerId),
      }));
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Purge protocol failed');
    } finally {
      setDeletingAnswerId(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-[#111111] border border-neutral-800 p-16 text-center">
        <div className="w-12 h-12 border border-neutral-800 mx-auto flex items-center justify-center mb-6 bg-[#111111] rotate-45">
          <div className="w-2 h-2 bg-neutral-600 rounded-full" />
        </div>
        <h3 className="font-serif text-xl text-white mb-2">Network is Empty</h3>
        <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">No queries currently in the global ledger.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#111111] border border-neutral-800 divide-y divide-neutral-800">
        {questions.map((question) => {
          const isExpanded = expandedIds.has(question.id);
          const isAnswersExpanded = answersExpandedIds.has(question.id);
          const createdAt = question.createdAt instanceof Date
            ? question.createdAt
            : new Date(question.createdAt);

          return (
            <div
              key={question.id}
              className="bg-[#111111] hover:bg-neutral-900/50 transition-colors group relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-4 select-none">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1">
                      {question.type}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                      Node: {question.user ? (question.user.name || question.user.email) : 'UNKNOWN'}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">
                      Logged: {createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <h3
                    className="text-xl md:text-2xl font-serif text-white mb-4 leading-snug cursor-pointer hover:text-emerald-400 transition-colors"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question.title}
                  </h3>

                  {isExpanded ? (
                    <div className="space-y-6">
                      <div
                        className="text-neutral-400 font-light leading-relaxed prose prose-sm prose-invert"
                        dangerouslySetInnerHTML={{ __html: question.description }}
                      />

                      {question.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {question.images.slice(0, 4).map((url, index) => (
                            <div
                              key={index}
                              className="relative aspect-square border border-neutral-800 overflow-hidden filter grayscale hover:grayscale-0 transition-all duration-500"
                            >
                              <Image
                                src={url}
                                alt={`Attachment ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {question.images.length > 4 && (
                            <div className="flex items-center justify-center aspect-square border border-neutral-800 bg-neutral-900 font-mono text-[10px] text-neutral-500">
                              +{question.images.length - 4} MORE
                            </div>
                          )}
                        </div>
                      )}

                      {/* Answers Section */}
                      <div className="mt-8 pt-6 border-t border-neutral-800">
                        <button
                          onClick={() => toggleAnswersExpand(question.id)}
                          className="flex items-center justify-between w-full mb-4 px-4 py-3 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-300">
                            Attached Responses [{questionAnswers[question.id]?.length ?? question._count?.answers ?? 0}]
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500">
                            {isAnswersExpanded ? '[-]' : '[+]'}
                          </span>
                        </button>

                        {isAnswersExpanded && (
                          <div className="space-y-4">
                            {loadingAnswers[question.id] ? (
                              <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 animate-pulse text-center py-4">Scanning responses...</div>
                            ) : questionAnswers[question.id]?.length === 0 ? (
                              <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 text-center py-4">No responses found</div>
                            ) : (
                              questionAnswers[question.id]?.map((answer) => (
                                <div
                                  key={answer.id}
                                  className="bg-[#111111] border border-neutral-800 p-6 relative group/answer"
                                >
                                  <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="font-mono text-[9px] uppercase tracking-widest text-emerald-500">
                                        RESP_ID: {(answer.user.name || answer.user.email.split('@')[0])}
                                      </div>
                                      <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">
                                        {new Date(answer.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => handleDeleteAnswer(answer.id, question.id)}
                                      disabled={deletingAnswerId === answer.id}
                                      className="font-mono text-[9px] uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover/answer:opacity-100"
                                      title="Purge Response"
                                    >
                                      {deletingAnswerId === answer.id ? 'PURGING...' : '[PURGE]'}
                                    </button>
                                  </div>

                                  <div
                                    className="text-neutral-400 font-light text-sm prose prose-sm prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: answer.description }}
                                  />

                                  {answer.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
                                      {answer.images.map((url, index) => (
                                        <div
                                          key={index}
                                          className="relative aspect-video border border-neutral-800 filter grayscale hover:grayscale-0 transition-all duration-500"
                                        >
                                          <Image
                                            src={url}
                                            alt={`Answer attachment ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            className="object-cover"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-neutral-500 font-light leading-relaxed prose prose-sm line-clamp-2 prose-invert"
                      dangerouslySetInnerHTML={{ __html: question.description }}
                    />
                  )}
                </div>

                {/* Action Controls */}
                <div className="flex md:flex-col items-center gap-4 flex-shrink-0 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 pl-0 md:pl-8">
                  <button
                    onClick={() => toggleExpand(question.id)}
                    className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors w-full text-center"
                  >
                    {isExpanded ? '[COLLAPSE]' : '[EXPAND]'}
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    disabled={deletingQuestionId === question.id}
                    className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors w-full text-center"
                  >
                    {deletingQuestionId === question.id ? 'PURGING...' : '[PURGE]'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <QuestionModal
        question={selectedQuestion ? {
          ...selectedQuestion,
          createdAt: selectedQuestion.createdAt instanceof Date
            ? selectedQuestion.createdAt.toISOString()
            : selectedQuestion.createdAt,
        } as any : null}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuestion(null);
        }}
        canDelete={false}
      />
    </>
  );
}
