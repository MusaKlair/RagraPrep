'use client';

import Link from 'next/link';

export interface ResourceCardData {
  id: string;
  title: string;
  description: string | null;
  semester: string | null;
  subject: string | null;
  resourceType: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
  tags: Array<{ id: string; name: string }>;
}

interface ResourceCardProps {
  resource: ResourceCardData;
  onDelete: (id: string) => Promise<void>;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ResourceCard({ resource, onDelete }: ResourceCardProps) {
  return (
    <div className="group border border-neutral-200 bg-white p-6 hover:bg-[#FAFAFA] transition-colors relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 mb-3">
            {resource.resourceType}
          </span>
          <h3 className="font-serif text-xl text-neutral-900 group-hover:text-emerald-900 transition-colors">
            {resource.title}
          </h3>
        </div>

        <button
          onClick={() => onDelete(resource.id)}
          className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-red-500"
          title="Delete resource"
        >
          [DELETE]
        </button>
      </div>

      {resource.description ? (
        <p className="text-neutral-600 leading-relaxed text-sm mb-5">{resource.description}</p>
      ) : (
        <p className="text-neutral-400 leading-relaxed text-sm mb-5">No description provided.</p>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {resource.tags.length > 0 ? (
          resource.tags.slice(0, 5).map((tag) => (
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

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 mb-5">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Semester</div>
          <div className="text-sm text-neutral-700">{resource.semester || 'N/A'}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Subject</div>
          <div className="text-sm text-neutral-700">{resource.subject || 'N/A'}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">File Size</div>
          <div className="text-sm text-neutral-700">{formatBytes(resource.fileSize)}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Uploaded</div>
          <div className="text-sm text-neutral-700">{new Date(resource.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/resources/${resource.id}`}
          className="font-mono text-[10px] uppercase tracking-widest text-emerald-700 hover:text-emerald-900"
        >
          Open Viewer -&gt;
        </Link>
      </div>
    </div>
  );
}
