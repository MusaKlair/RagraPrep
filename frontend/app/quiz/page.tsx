'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import { toast } from 'sonner';
import axios from 'axios';

const QUIZ_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Quantum Physics',
  'Engineering',
  'Statistics',
  'Calculus',
  'Algebra',
  'Geometry',
  'Trigonometry',
  'Organic Chemistry',
  'Inorganic Chemistry',
  'Physical Chemistry',
  'Mechanics',
  'Electromagnetism',
  'Thermodynamics',
  'Data Structures',
  'Algorithms',
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing (NLP)',
  'Artificial Intelligence',
  'Neural Networks',
  'Computer Vision',
  'Data Science',
  'Python Programming',
  'JavaScript',
  'Web Development',
  'Database Systems',
  'Operating Systems',
  'Computer Networks',
  'Cybersecurity',
  'Software Engineering',
  'General Knowledge',
  'Other',
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const QUESTION_COUNTS = [3, 5, 10, 15, 20];

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  title: string;
  description: string;
  subject: string;
  questions: QuizQuestion[];
}

const QUIZ_STORAGE_KEY = 'ragra-quiz-state';

export default function QuizPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.quiz) {
          setQuiz(parsed.quiz);
          setSelectedAnswers(parsed.selectedAnswers || []);
          setShowResults(parsed.showResults || false);
          setPrompt(parsed.prompt || '');
          setSubject(parsed.subject || '');
          setDifficulty(parsed.difficulty || 'medium');
          setNumQuestions(parsed.numQuestions || 5);
        }
      }
    } catch (error) {
      console.error('Error loading quiz from localStorage:', error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      const stateToSave = {
        quiz,
        selectedAnswers,
        showResults,
        prompt,
        subject,
        difficulty,
        numQuestions,
      };
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving quiz to localStorage:', error);
    }
  }, [quiz, selectedAnswers, showResults, prompt, subject, difficulty, numQuestions, hydrated]);

  const handleGenerateQuiz = async () => {
    if (!prompt.trim()) {
      toast.error('Parameter required: describe quiz focus');
      return;
    }

    if (!subject) {
      toast.error('Parameter required: select subject field');
      return;
    }

    setLoading(true);
    setQuiz(null);
    setSelectedAnswers([]);
    setShowResults(false);

    try {
      const { data } = await axios.post('/api/ai/quiz', {
        prompt: prompt.trim(),
        subject,
        difficulty,
        numQuestions,
      });

      if (!data?.quiz) {
        throw new Error('Empty AI generation response');
      }

      const newAnswers = new Array(data.quiz.questions.length).fill(-1);
      setQuiz(data.quiz);
      setSelectedAnswers(newAnswers);

      try {
        const stateToSave = {
          quiz: data.quiz,
          selectedAnswers: newAnswers,
          showResults: false,
          prompt: prompt.trim(),
          subject,
          difficulty,
          numQuestions,
        };
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('State persistence failure:', error);
      }

      toast.success('Assessment synthesis complete');
    } catch (error: any) {
      console.error('Synthesis error:', error);
      toast.error(error?.response?.data?.error || 'Synthesis protocol failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);

    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved && quiz) {
        const parsed = JSON.parse(saved);
        parsed.selectedAnswers = newAnswers;
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('State persistence failure:', error);
    }
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswers.some(answer => answer === -1)) {
      toast.error('Complete all queries before submission');
      return;
    }
    setShowResults(true);

    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved && quiz) {
        const parsed = JSON.parse(saved);
        parsed.showResults = true;
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('State persistence failure:', error);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuiz(null);
    setPrompt('');
    setSubject('');
    setDifficulty('medium');
    setNumQuestions(5);
    setSelectedAnswers([]);
    setShowResults(false);

    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch (error) {
      console.error('State clearance failure:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 border-b border-neutral-200 pb-6">
          <div className="font-mono text-[9px] text-emerald-600 uppercase tracking-[0.2em] font-medium mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            AI Assessment Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-neutral-900 mb-3">
            Algorithmic Testing
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 max-w-2xl">
            Synthesize custom evaluations against specific domain parameters.
          </p>
        </div>

        {!quiz ? (
          <>
            {/* Quiz Generator Control Panel */}
            <div className="bg-white border border-neutral-300 shadow-xl max-w-3xl mx-auto">
              <div className="border-b border-neutral-200 px-8 py-6 bg-[#FAFAFA]">
                <h2 className="text-2xl font-serif text-neutral-900">
                  Configure Generation Parameters
                </h2>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                    Domain Subject <span className="text-emerald-500">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm appearance-none rounded-none"
                    style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '10px' }}
                  >
                    <option value="">AWAITING SELECTION...</option>
                    {QUIZ_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                    Specific Topic Focus <span className="text-emerald-500">*</span>
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder="Input learning objectives (e.g. quantum entanglement algorithms)..."
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 font-mono text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-neutral-200">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                      Complexity
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm appearance-none rounded-none uppercase"
                      style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '10px' }}
                    >
                      {DIFFICULTY_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-3">
                      Query Count
                    </label>
                    <select
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm appearance-none rounded-none uppercase"
                      style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '10px' }}
                    >
                      {QUESTION_COUNTS.map((count) => (
                        <option key={count} value={count}>
                          {count} Queries
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 mt-8 border-t border-neutral-200 flex justify-end">
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={loading || !prompt.trim() || !subject}
                    className="px-8 py-3 bg-[#111111] text-white border border-[#111111] font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Synthesizing...
                      </>
                    ) : (
                      'Execute Generation'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Active Quiz Evaluation Interface */}
            <div className="max-w-4xl mx-auto space-y-8">

              {/* Evaluation Header */}
              <div className="bg-white border border-neutral-300 p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="inline-block border border-neutral-300 px-3 py-1 mb-4 bg-[#FAFAFA]">
                      <span className="font-mono text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{quiz.subject}</span>
                    </div>
                    <h2 className="text-3xl font-serif text-neutral-900 mb-3">{quiz.title}</h2>
                    {quiz.description && (
                      <p className="text-neutral-600 font-light leading-relaxed">{quiz.description}</p>
                    )}
                  </div>

                  {showResults ? (
                    <div className="bg-[#111111] px-8 py-6 text-center border border-neutral-800">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-2">Final Evaluation</p>
                      <p className="font-mono text-4xl text-white mb-1">
                        {calculateScore()}<span className="text-neutral-600">/{quiz.questions.length}</span>
                      </p>
                      <p className="font-mono text-[10px] text-emerald-400">
                        SCORE: {Math.round((calculateScore() / quiz.questions.length) * 100)}%
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#FAFAFA] border border-neutral-200 px-6 py-4 flex flex-col items-center justify-center">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">Completion Status</p>
                      <p className="font-mono text-xl text-neutral-900">
                        {selectedAnswers.filter(a => a !== -1).length}<span className="text-neutral-400">/{quiz.questions.length}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {quiz.questions.map((question, qIndex) => {
                  const isCorrect = selectedAnswers[qIndex] === question.correctAnswer;
                  const isSelected = selectedAnswers[qIndex] !== -1;

                  return (
                    <div
                      key={qIndex}
                      className={`bg-white border transition-all ${showResults
                          ? isCorrect
                            ? 'border-emerald-500/50 bg-emerald-50/10'
                            : selectedAnswers[qIndex] !== question.correctAnswer && isSelected
                              ? 'border-red-500/50 bg-red-50/10'
                              : 'border-neutral-200'
                          : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                    >
                      {/* Status indicator bar (for results) */}
                      {showResults && (
                        <div className={`h-1 w-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      )}

                      <div className="p-6 md:p-8">
                        <div className="flex items-start gap-4 mb-8">
                          <div className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-widest pt-1 min-w-[3rem]`}>
                            Q—{(qIndex + 1).toString().padStart(2, '0')}
                          </div>
                          <h3 className="text-xl font-serif text-neutral-900 flex-1 leading-relaxed">
                            {question.question}
                          </h3>
                        </div>

                        <div className="ml-0 md:ml-16 space-y-3">
                          {question.options.map((option, oIndex) => {
                            const isSelectedOption = selectedAnswers[qIndex] === oIndex;
                            const isCorrectOption = oIndex === question.correctAnswer;

                            return (
                              <button
                                key={oIndex}
                                onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                disabled={showResults}
                                className={`w-full text-left px-5 py-4 border transition-all relative ${showResults
                                    ? isCorrectOption
                                      ? 'border-emerald-500 bg-emerald-50'
                                      : isSelectedOption && !isCorrectOption
                                        ? 'border-red-500/50 bg-red-50'
                                        : 'border-neutral-200 bg-[#FAFAFA] opacity-50'
                                    : isSelectedOption
                                      ? 'border-neutral-900 bg-neutral-900 text-white'
                                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                                  } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                {/* Left selection indicator */}
                                {isSelectedOption && !showResults && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
                                )}

                                <div className="flex items-center gap-4">
                                  <div className={`font-mono text-[10px] ${isSelectedOption && !showResults ? 'text-neutral-400' : 'text-neutral-500'
                                    }`}>
                                    [{String.fromCharCode(65 + oIndex)}]
                                  </div>
                                  <span className={`flex-1 text-sm ${isSelectedOption && !showResults ? 'text-white' : 'text-neutral-900'}`}>
                                    {option}
                                  </span>
                                  {showResults && isCorrectOption && (
                                    <span className="font-mono text-[10px] text-emerald-600 select-none">[CORRECT]</span>
                                  )}
                                  {showResults && isSelectedOption && !isCorrectOption && (
                                    <span className="font-mono text-[10px] text-red-600 select-none">[INCORRECT]</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {showResults && question.explanation && (
                          <div className={`mt-8 ml-0 md:ml-16 p-6 border bg-[#FAFAFA] ${isCorrect ? 'border-emerald-200' : 'border-neutral-200'
                            }`}>
                            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-3">System Explanation</p>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-neutral-200">
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-white text-neutral-900 border border-neutral-300 font-mono text-[10px] uppercase tracking-widest hover:border-neutral-900 transition-colors"
                >
                  Configure New
                </button>

                {!showResults ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={selectedAnswers.some(answer => answer === -1)}
                    className="px-8 py-3 bg-[#111111] text-white border border-[#111111] font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors disabled:opacity-50"
                  >
                    Submit Evaluation
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
                    }}
                    className="px-8 py-3 bg-[#111111] text-white border border-[#111111] font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors"
                  >
                    Reinitialize Evaluation
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
