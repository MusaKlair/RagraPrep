'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import DashboardNav from '@/components/DashboardNav';

interface ResourceDetail {
  id: string;
  title: string;
  description: string | null;
  semester: string | null;
  subject: string | null;
  resourceType: string;
  mimeType: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  tags: Array<{ id: string; name: string }>;
  category: { id: string; name: string; description: string | null } | null;
}

function isPreviewableUrl(fileUrl: string): boolean {
  return /^https?:\/\//i.test(fileUrl) || fileUrl.startsWith('/');
}

function buildOfficePreviewUrl(fileUrl: string): string {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ResourceViewerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const pageAnchor = searchParams.get('page');
  const highlightAnchor = searchParams.get('highlight');

  const pdfViewerUrl = useMemo(() => {
    if (!resource?.fileUrl) return '';
    if (resource.resourceType !== 'PDF') return resource.fileUrl;

    const page = pageAnchor ? `page=${encodeURIComponent(pageAnchor)}` : '';
    const highlight = highlightAnchor ? `highlight=${encodeURIComponent(highlightAnchor)}` : '';
    const hash = [page, highlight].filter(Boolean).join('&');

    return hash ? `${resource.fileUrl}#${hash}` : resource.fileUrl;
  }, [resource, pageAnchor, highlightAnchor]);

  const documentPreviewUrl = useMemo(() => {
    if (!resource?.fileUrl) return '';

    if (resource.resourceType === 'PDF') {
      return pdfViewerUrl;
    }

    if (resource.resourceType === 'PPTX' && isPreviewableUrl(resource.fileUrl)) {
      return buildOfficePreviewUrl(resource.fileUrl);
    }

    return '';
  }, [resource, pdfViewerUrl]);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/resources/${id}`);
        setResource(data.resource);
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">Loading Resource Viewer...</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
        <DashboardNav />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="font-serif text-3xl mb-2">Resource Not Found</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-6">The requested document does not exist or is unavailable.</p>
          <Link
            href="/resources"
            className="inline-block bg-[#111111] text-white px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 border border-[#111111]"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-neutral-200 pb-5 flex flex-col md:flex-row justify-between gap-4 md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2">Resource Viewer</p>
            <h1 className="font-serif text-3xl text-neutral-900">{resource.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-neutral-800 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-neutral-300 hover:border-neutral-900"
            >
              View Original
            </a>
            <a
              href={resource.fileUrl}
              download
              className="bg-[#111111] text-white px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-[#111111] hover:bg-emerald-900"
            >
              Download
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 bg-white border border-neutral-200 p-5 h-fit">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">Metadata</h2>

            <div className="space-y-4 text-sm">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Type</div>
                <div className="text-neutral-800">{resource.resourceType}</div>
              </div>

              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Subject</div>
                <div className="text-neutral-800">{resource.subject || 'N/A'}</div>
              </div>

              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Semester</div>
                <div className="text-neutral-800">{resource.semester || 'N/A'}</div>
              </div>

              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Category</div>
                <div className="text-neutral-800">{resource.category?.name || 'N/A'}</div>
              </div>

              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">File Size</div>
                <div className="text-neutral-800">{formatBytes(resource.fileSize)}</div>
              </div>

              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Uploaded</div>
                <div className="text-neutral-800">{new Date(resource.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-100">
              <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {resource.tags.length > 0 ? (
                  resource.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 border border-neutral-200 px-2 py-1"
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">No tags</span>
                )}
              </div>
            </div>

            {resource.description && (
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-2">Description</div>
                <p className="text-sm text-neutral-700 leading-relaxed">{resource.description}</p>
              </div>
            )}
          </aside>

          <main className="lg:col-span-3 bg-white border border-neutral-200 min-h-[70vh]">
            {documentPreviewUrl ? (
              <iframe
                src={documentPreviewUrl}
                title={resource.title}
                className="w-full min-h-[70vh]"
              />
            ) : (
              <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-8">
                <h3 className="font-serif text-2xl text-neutral-900 mb-3">Preview Unavailable</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 max-w-lg mb-6">
                  This file cannot be embedded in the browser from its current URL. You can still open it in a new tab or download it explicitly.
                </p>
                <div className="flex gap-3">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-neutral-800 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-neutral-300 hover:border-neutral-900"
                  >
                    View File
                  </a>
                  <a
                    href={resource.fileUrl}
                    download
                    className="bg-[#111111] text-white px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest border border-[#111111] hover:bg-emerald-900"
                  >
                    Download File
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
