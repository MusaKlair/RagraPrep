'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import axios from 'axios';
import RichTextEditor from './RichTextEditor';

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

interface QuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export default function QuestionModal({
  question,
  isOpen,
  onClose,
  onDelete,
  canDelete = false,
}: QuestionModalProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerDescription, setAnswerDescription] = useState('');
  const [answerImages, setAnswerImages] = useState<string[]>([]);
  const [answerImageFiles, setAnswerImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (question) {
        fetchAnswers();
        fetchCurrentUser();
      }
    } else {
      document.body.style.overflow = 'unset';
      setShowAnswerForm(false);
      setAnswerDescription('');
      setAnswerImages([]);
      setAnswerImageFiles([]);
      setAnswers([]);
      setIsAdmin(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, question]);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data.user && data.user.role === 'ADMIN') {
        setIsAdmin(true);
      }
    } catch (error) {
      // User not logged in or not admin
      setIsAdmin(false);
    }
  };

  const fetchAnswers = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/questions/${question.id}/answers`);
      setAnswers(data.answers || []);
    } catch (error) {
      toast.error('Failed to load answers');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setAnswerImageFiles([...answerImageFiles, ...newFiles]);

    const previewUrls = newFiles.map(file => URL.createObjectURL(file));
    setAnswerImages([...answerImages, ...previewUrls]);
  };

  const removeAnswerImage = (index: number) => {
    setAnswerImages(answerImages.filter((_, i) => i !== index));
    setAnswerImageFiles(answerImageFiles.filter((_, i) => i !== index));
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) {
      return;
    }

    setDeletingAnswerId(answerId);
    try {
      await axios.delete(`/api/answers/${answerId}`);
      toast.success('Answer deleted successfully');
      // Remove answer from local state
      setAnswers(answers.filter((a) => a.id !== answerId));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete answer');
    } finally {
      setDeletingAnswerId(null);
    }
  };

  const getPlainText = (html: string) =>
    html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const handleGenerateRagAnswer = async () => {
    if (!question) return;
    setRagLoading(true);
    setShowAnswerForm(true);
    try {
      const query = `${question.title}\n\n${getPlainText(question.description)}`;
      const { data } = await axios.post('/api/rag/answer', { query });
      
      let newDescription = data.answer.replace(/\n/g, '<br/>');
      if (data.sources && data.sources.length > 0) {
        newDescription += '<br/><br/><b>Sources:</b><ul>';
        data.sources.forEach((s: any, i: number) => {
          newDescription += `<li>[Source ${i + 1}] ${s.source || 'Document'}</li>`;
        });
        newDescription += '</ul>';
      }
      
      setAnswerDescription(newDescription);
      toast.success('RAG analysis complete');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate RAG answer');
    } finally {
      setRagLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!question || !getPlainText(answerDescription)) {
      toast.error('Please provide an answer description');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      if (answerImageFiles.length > 0) {
        const uploadPromises = answerImageFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const { data } = await axios.post(
            `/api/questions/${question.id}/answers/upload`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );

          return data.url;
        });

        uploadedUrls = await Promise.all(uploadPromises);
      }

      await axios.post(`/api/questions/${question.id}/answers`, {
        description: answerDescription.trim(),
        images: uploadedUrls,
      });

      // Refetch answers to get the latest data
      await fetchAnswers();
      setShowAnswerForm(false);
      setAnswerDescription('');
      setAnswerImages([]);
      setAnswerImageFiles([]);
      toast.success('Answer posted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !question) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white border border-neutral-200 shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 flex items-start justify-between p-4 sm:p-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-500/20 font-mono text-[10px] uppercase tracking-widest">
                [{question.type}]
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                BY: <span className="text-neutral-600">{question.user ? (question.user.name || question.user.email.split('@')[0]) : 'Deleted User'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono uppercase tracking-tight text-neutral-900 break-words">
              {question.title}
            </h2>
          </div>
          <div className="flex-shrink-0 flex gap-1 sm:gap-2">
            {canDelete && onDelete && (
              <button
                onClick={() => {
                  onDelete(question.id);
                  onClose();
                }}
                className="p-1.5 sm:p-2 text-neutral-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-neutral-900 transition-colors font-mono text-[10px]"
              title="Close"
            >
              [ESC]
            </button>
          </div>
        </div>

        {/* Scrollable Content Area - Includes both question content and answers */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Question Content */}
          <div className="p-4 sm:p-8">
            <div className="mb-8">
              <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-4">Description</h3>
              <div
                className="prose prose-neutral max-w-none text-sm sm:text-base text-neutral-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />
            </div>

            {question.images.length > 0 && (
              <div className="mb-8">
                <h3 className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-4">
                  Visual Assets [{question.images.length}]
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {question.images.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden border border-neutral-200 group"
                    >
                      <Image
                        src={url}
                        alt={`Question image ${index + 1}`}
                        width={800}
                        height={600}
                        className="w-full h-full object-contain bg-neutral-50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  Posted {new Date(question.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Answers Section - Now inside scrollable area */}
          <div className="border-t border-neutral-200 p-4 sm:p-8 bg-neutral-50/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-8">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-900 border-l-2 border-emerald-500 pl-3">
                Knowledge Base / Answers [{answers.length}]
              </h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleGenerateRagAnswer}
                  disabled={ragLoading}
                  className="w-full sm:w-auto px-6 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors bg-[#111111] text-white border-[#111111] hover:bg-neutral-800 disabled:opacity-50"
                >
                  {ragLoading ? 'ANALYZING...' : '[GENERATE_RAG_ANSWER]'}
                </button>
                <button
                  onClick={() => setShowAnswerForm(!showAnswerForm)}
                  className={`w-full sm:w-auto px-6 py-2 border font-mono text-[10px] uppercase tracking-widest transition-colors ${showAnswerForm
                      ? 'border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                      : 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600'
                    }`}
                >
                  {showAnswerForm ? '[DISCARD_INPUT]' : '[ADD_TO_DATABASE]'}
                </button>
              </div>
            </div>

            {/* Answer Form */}
            {showAnswerForm && (
              <div className="mb-8 p-6 bg-white border border-neutral-200">
                <div className="mb-6">
                  <RichTextEditor
                    content={answerDescription}
                    onChange={setAnswerDescription}
                    placeholder="Contribute to this entry..."
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAnswerImageSelect}
                    className="hidden"
                    id="answer-image-upload"
                  />
                  <label
                    htmlFor="answer-image-upload"
                    className="inline-block px-4 py-2 border border-neutral-200 font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-emerald-500 hover:border-emerald-500/30 cursor-pointer transition-colors"
                  >
                    Add Attachments
                  </label>
                  {answerImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {answerImages.map((url, index) => (
                        <div key={index} className="relative aspect-square border border-neutral-200 overflow-hidden">
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                            unoptimized={url.startsWith('blob:')}
                          />
                          <button
                            onClick={() => removeAnswerImage(index)}
                            className="absolute top-1 right-1 bg-neutral-900 text-white p-1 hover:bg-red-500 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                  <button
                    onClick={() => setShowAnswerForm(false)}
                    className="w-full sm:w-auto px-6 py-2 border border-neutral-200 text-neutral-400 font-mono text-[10px] uppercase tracking-widest hover:text-neutral-900 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || uploading}
                    className="w-full sm:w-auto px-8 py-2 bg-emerald-500 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'PROCESSING...' : 'EXECUTE_POST'}
                  </button>
                </div>
              </div>
            )}

            {/* Answers List */}
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center text-gray-500 py-4 text-sm sm:text-base">Loading answers...</div>
              ) : answers.length === 0 ? (
                <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                  <p>No answers yet. Be the first to answer!</p>
                </div>
              ) : (
                answers.map((answer) => (
                  <div key={answer.id} className="bg-white border border-neutral-200 p-6 relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-neutral-100 flex items-center justify-center flex-shrink-0 border border-neutral-200">
                          <span className="text-neutral-600 font-mono text-xs">
                            {(answer.user.name || answer.user.email.split('@')[0])[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-900 truncate">
                            {answer.user.name || answer.user.email.split('@')[0]}
                          </p>
                          <p className="font-mono text-[9px] text-neutral-400">
                            ID: {answer.id.slice(0, 8)} | {new Date(answer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAnswer(answer.id)}
                          disabled={deletingAnswerId === answer.id}
                          className="p-1 px-3 border border-neutral-100 text-neutral-400 hover:text-red-500 hover:border-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono text-[9px] uppercase"
                          title="Purge answer"
                        >
                          {deletingAnswerId === answer.id ? 'PURGING...' : '[PURGE]'}
                        </button>
                      )}
                    </div>
                    <div
                      className="text-sm text-neutral-600 prose prose-neutral max-w-none mb-6 prose-p:text-neutral-600 prose-strong:text-neutral-900"
                      dangerouslySetInnerHTML={{ __html: answer.description }}
                    />
                    {answer.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 sm:mt-3">
                        {answer.images.map((url, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={url}
                              alt={`Answer image ${index + 1}`}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

