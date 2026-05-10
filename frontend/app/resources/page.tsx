'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import DashboardNav from '@/components/DashboardNav';
import ResourceUploadModal from '@/components/ResourceUploadModal';
import ResourceCard, { ResourceCardData } from '@/components/ResourceCard';

interface PaginatedResponse {
  resources: ResourceCardData[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [resourceType, setResourceType] = useState('');

  const [semesterSuggestions, setSemesterSuggestions] = useState<string[]>([]);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    if (search.trim()) params.set('search', search.trim());
    if (semester.trim()) params.set('semester', semester.trim());
    if (subject.trim()) params.set('subject', subject.trim());
    if (resourceType.trim()) params.set('resourceType', resourceType.trim());

    return params.toString();
  }, [page, pageSize, search, semester, subject, resourceType]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<PaginatedResponse>(`/api/resources?${queryParams}`);
      setResources(data.resources || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please login to access resources');
      } else {
        toast.error(error.response?.data?.error || 'Failed to load resources');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async (type: 'semester' | 'subject', query: string) => {
    try {
      const { data } = await axios.get('/api/resources/metadata', {
        params: { [type]: query },
      });

      if (type === 'semester') {
        setSemesterSuggestions(data.semesters || []);
      } else {
        setSubjectSuggestions(data.subjects || []);
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} suggestions:`, error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [queryParams]);

  const handleSemesterChange = (value: string) => {
    setSemester(value);
    setPage(1);
    setShowSemesterDropdown(true);
    if (value.trim()) {
      fetchMetadata('semester', value.trim());
    } else {
      setSemesterSuggestions([]);
    }
  };

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    setPage(1);
    setShowSubjectDropdown(true);
    if (value.trim()) {
      fetchMetadata('subject', value.trim());
    } else {
      setSubjectSuggestions([]);
    }
  };

  const handleUpload = async (values: {
    title: string;
    description: string;
    semester: string;
    subject: string;
    category: string;
    tags: string;
    file: File | null;
  }) => {
    if (!values.file) {
      toast.error('File is required');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', values.file);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('semester', values.semester);
      formData.append('subject', values.subject);
      formData.append('category', values.category);
      formData.append('tags', values.tags);

      await axios.post('/api/resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Resource uploaded successfully');
      setIsUploadOpen(false);
      setPage(1);
      await fetchResources();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this resource?')) {
      return;
    }

    try {
      await axios.delete(`/api/resources/${id}`);
      toast.success('Resource deleted');
      await fetchResources();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete resource');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif text-neutral-900 mb-2">Resources</h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              Document management layer for RAG-ready study assets.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-[#111111] text-white px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-[#111111]"
          >
            Upload Resource
          </button>
        </div>

        <div className="bg-white border border-neutral-200 p-5 mb-8 grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by title, tags, subject"
            className="md:col-span-2 px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:border-emerald-500 outline-none font-mono text-[11px]"
          />

          <div className="relative">
            <input
              value={semester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              onFocus={() => setShowSemesterDropdown(true)}
              onBlur={() => setTimeout(() => setShowSemesterDropdown(false), 100)}
              placeholder="Semester (partial match)"
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:border-emerald-500 outline-none font-mono text-[11px]"
            />
            {semester && (
              <button
                onClick={() => {
                  setSemester('');
                  setPage(1);
                  setSemesterSuggestions([]);
                }}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 text-[10px] font-mono"
              >
                ✕
              </button>
            )}
            {showSemesterDropdown && semesterSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-300 rounded shadow-sm z-10">
                {semesterSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSemester(s);
                      setShowSemesterDropdown(false);
                      setPage(1);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-50 font-mono text-[11px] border-b border-neutral-100 last:border-b-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              onFocus={() => setShowSubjectDropdown(true)}
              onBlur={() => setTimeout(() => setShowSubjectDropdown(false), 100)}
              placeholder="Subject (partial match)"
              className="w-full px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:border-emerald-500 outline-none font-mono text-[11px]"
            />
            {subject && (
              <button
                onClick={() => {
                  setSubject('');
                  setPage(1);
                  setSubjectSuggestions([]);
                }}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 text-[10px] font-mono"
              >
                ✕
              </button>
            )}
            {showSubjectDropdown && subjectSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-300 rounded shadow-sm z-10">
                {subjectSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSubject(s);
                      setShowSubjectDropdown(false);
                      setPage(1);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-50 font-mono text-[11px] border-b border-neutral-100 last:border-b-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={resourceType}
            onChange={(e) => {
              setPage(1);
              setResourceType(e.target.value);
            }}
            className="px-4 py-3 bg-[#FAFAFA] border border-neutral-300 focus:bg-white focus:border-emerald-500 outline-none font-mono text-[11px]"
          >
            <option value="">All Types</option>
            <option value="PDF">PDF</option>
            <option value="PPTX">PPTX</option>
          </select>
        </div>

        {loading ? (
          <div className="min-h-[260px] flex items-center justify-center bg-white border border-neutral-200">
            <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">Loading Resources...</div>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-16 text-center bg-white border border-neutral-200">
            <h3 className="font-serif text-xl text-neutral-900 mb-2">No Resources Found</h3>
            <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mb-5">Upload a PDF or PPTX to get started.</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-block bg-[#111111] text-white px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors border border-[#111111]"
            >
              Upload First Resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-5">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="px-4 py-2 border border-neutral-300 font-mono text-[10px] uppercase tracking-widest text-neutral-600 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-neutral-300 font-mono text-[10px] uppercase tracking-widest text-neutral-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <ResourceUploadModal
        isOpen={isUploadOpen}
        isUploading={uploading}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}
