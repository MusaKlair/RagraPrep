'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'sonner';
import axios from 'axios';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  shareToken?: string | null;
  isPublic?: boolean;
}

const getPlainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [shareUrls, setShareUrls] = useState<Record<string, string>>({});
  const [sharingNoteId, setSharingNoteId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/notes');
      setNotes(data.notes || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Authentication Error: Cannot retrieve logs');
      } else {
        toast.error('System Error: Failed to load logs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiNote = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Input required for generation');
      return;
    }

    setAiLoading(true);
    try {
      const { data } = await axios.post('/api/ai/notes', {
        prompt: aiPrompt.trim(),
        subject: title.trim() || undefined,
      });

      if (!data?.content) {
        throw new Error('Empty AI response');
      }

      setContent(data.content);
      setAiPrompt('');
      toast.success('Log generated successfully');
      setShowAiPanel(false);
    } catch (error: any) {
      console.error('AI notes error', error);
      toast.error(error?.response?.data?.error || 'Generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      toast.error('Log title is required');
      return;
    }

    if (!getPlainText(content)) {
      toast.error('Log content is required');
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.post('/api/notes', {
        title: title.trim(),
        content,
      });

      setNotes((prev) => [data.note, ...prev]);
      setTitle('');
      setContent('');
      toast.success('Log recorded successfully');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Authentication required');
      } else {
        toast.error(error.response?.data?.error || 'Failed to record log');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
      setShareUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[id];
        return newUrls;
      });
      toast.success('Log purged');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to purge log');
    }
  };

  const handleShareNote = async (id: string) => {
    setSharingNoteId(id);
    try {
      const { data } = await axios.post(`/api/notes/${id}/share`);
      const shareUrl = data.shareUrl;
      setShareUrls((prev) => ({ ...prev, [id]: shareUrl }));

      await navigator.clipboard.writeText(shareUrl);
      toast.success('Access Link Copied');

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, shareToken: data.shareToken, isPublic: true }
            : note
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate link');
    } finally {
      setSharingNoteId(null);
    }
  };

  const handleStopSharing = async (id: string) => {
    try {
      await axios.delete(`/api/notes/${id}/share`);
      setShareUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[id];
        return newUrls;
      });

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? { ...note, shareToken: null, isPublic: false }
            : note
        )
      );

      toast.success('Access Revoked');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to revoke access');
    }
  };

  const formattedNotes = useMemo(
    () =>
      notes.map((note) => ({
        ...note,
        createdDate: new Date(note.createdAt).toLocaleDateString(),
        createdTime: new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })),
    [notes]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif text-neutral-900 mb-2">Research Logs</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Compile and synthesize academic data.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Total Records</p>
            <p className="font-serif text-2xl text-neutral-900 leading-none">{notes.length}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area - Notes List */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="space-y-0 border border-neutral-200 bg-white">
              {/* List Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FAFAFA]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Compiled Logs</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Status</span>
              </div>

              {loading ? (
                <div className="p-16 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 animate-pulse">Retrieving Logs...</span>
                </div>
              ) : formattedNotes.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-12 h-12 border border-neutral-300 mx-auto flex items-center justify-center mb-6 bg-neutral-50">
                    <div className="w-3 h-3 bg-neutral-200 rounded-none" />
                  </div>
                  <h3 className="font-serif text-xl text-neutral-900 mb-2">No Records Found</h3>
                  <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">
                    Initialize a new log from the control panel.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {formattedNotes.map((note) => {
                    const isExpanded = selectedNoteId === note.id;
                    return (
                      <div key={note.id} className="group hover:bg-[#FAFAFA] transition-colors relative">
                        {/* Hover accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="font-serif text-xl text-neutral-900 mb-3">{note.title}</h3>

                              <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-4">
                                <span>T-MINUS: {note.createdDate} {note.createdTime}</span>
                                {note.isPublic && <span className="text-emerald-500 border border-emerald-500/30 px-1.5 py-0.5 bg-emerald-50/50">Shared Access</span>}
                              </div>

                              <div
                                className={`prose prose-sm prose-neutral max-w-none text-neutral-600 font-light leading-relaxed ${isExpanded ? '' : 'line-clamp-3'
                                  }`}
                                dangerouslySetInnerHTML={{ __html: note.content }}
                              />
                            </div>

                            {/* Action Control Panel */}
                            <div className="flex flex-col gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity min-w-[120px]">
                              <button
                                onClick={() => setSelectedNoteId(isExpanded ? null : note.id)}
                                className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-neutral-900 hover:text-emerald-600 transition-colors py-1 border-b border-neutral-200 hover:border-emerald-600"
                              >
                                {isExpanded ? 'Collapse Data' : 'Expand Data'}
                              </button>

                              {shareUrls[note.id] || note.isPublic ? (
                                <>
                                  <button
                                    onClick={() => {
                                      const url = shareUrls[note.id] || `${window.location.origin}/notes/shared/${note.shareToken}`;
                                      navigator.clipboard.writeText(url);
                                      toast.success('Link copied');
                                    }}
                                    className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors py-1 border-b border-neutral-200 hover:border-emerald-700"
                                  >
                                    Copy Link
                                  </button>
                                  <button
                                    onClick={() => handleStopSharing(note.id)}
                                    className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors py-1 border-b border-neutral-200"
                                  >
                                    Revoke Access
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleShareNote(note.id)}
                                  disabled={sharingNoteId === note.id}
                                  className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors py-1 border-b border-neutral-200 disabled:opacity-50"
                                >
                                  {sharingNoteId === note.id ? 'Processing...' : 'Generate Link'}
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-red-600 transition-colors py-1"
                              >
                                Purge Log
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Input Panel */}
          <div className="w-full lg:w-96 order-1 lg:order-2 flex-shrink-0">
            <div className="sticky top-24 border border-neutral-200 bg-white p-6 shadow-2xl shadow-neutral-900/5">
              <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 pb-4">
                <div className="w-2 h-2 bg-[#111111] rotate-45" />
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-900">Compile Record</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                    Subject Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. System Architecture Summary"
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                    Data Payload
                  </label>
                  <div className="border border-neutral-300 bg-[#FAFAFA] focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition-colors h-64 overflow-y-auto">
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Input data protocol..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle('');
                      setContent('');
                    }}
                    className="flex-1 border border-neutral-300 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:bg-[#FAFAFA] hover:text-neutral-900 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={saving}
                    className="flex-[2] bg-[#111111] text-white py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors disabled:opacity-50 border border-[#111111]"
                  >
                    {saving ? 'Compiling...' : 'Save Record'}
                  </button>
                </div>
              </div>

              {/* AI Generator Panel */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-900">AI Synthesis</h3>
                  </div>
                  <button
                    onClick={() => setShowAiPanel(!showAiPanel)}
                    className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
                  >
                    {showAiPanel ? '[DEACTIVATE]' : '[ACTIVATE]'}
                  </button>
                </div>

                {showAiPanel && (
                  <div className="space-y-4 pt-4 border-t border-neutral-100 animate-in fade-in slide-in-from-top-2">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 leading-relaxed">
                      Deploy learning models to automatically construct formatted logs based on parameters.
                    </p>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors text-neutral-900 font-mono text-sm resize-none"
                      placeholder="e.g. Summarize the Krebs Cycle..."
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAiNote}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="w-full bg-white text-emerald-700 border border-emerald-500/30 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-colors disabled:opacity-50"
                    >
                      {aiLoading ? 'SYNTHESIZING...' : 'EXECUTE REQUEST'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
