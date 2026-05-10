'use client';

import { useState } from 'react';

interface ResourceUploadValues {
  title: string;
  description: string;
  semester: string;
  subject: string;
  category: string;
  tags: string;
  file: File | null;
}

interface ResourceUploadModalProps {
  isOpen: boolean;
  isUploading: boolean;
  onClose: () => void;
  onSubmit: (values: ResourceUploadValues) => Promise<void>;
}

const ACCEPTED_TYPES = '.pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation';

export default function ResourceUploadModal({
  isOpen,
  isUploading,
  onClose,
  onSubmit,
}: ResourceUploadModalProps) {
  const [values, setValues] = useState<ResourceUploadValues>({
    title: '',
    description: '',
    semester: '',
    subject: '',
    category: '',
    tags: '',
    file: null,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-neutral-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-neutral-900">Upload Resource</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">PDF and PPTX only</p>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
            disabled={isUploading}
          >
            Close
          </button>
        </div>

        <form
          className="p-6 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(values);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                Title
              </label>
              <input
                type="text"
                value={values.title}
                onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 bg-[#FAFAFA] focus:bg-white focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                Semester
              </label>
              <input
                type="text"
                value={values.semester}
                onChange={(e) => setValues((prev) => ({ ...prev, semester: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 bg-[#FAFAFA] focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="e.g. Semester 6"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={values.subject}
                onChange={(e) => setValues((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 bg-[#FAFAFA] focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="e.g. Software Engineering"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                Category
              </label>
              <input
                type="text"
                value={values.category}
                onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 bg-[#FAFAFA] focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="Slides, Notes, Past Paper"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={values.tags}
                onChange={(e) => setValues((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 bg-[#FAFAFA] focus:bg-white focus:border-emerald-500 outline-none"
                placeholder="midterm, lecture, revision"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                Description
              </label>
              <textarea
                value={values.description}
                onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 bg-[#FAFAFA] focus:bg-white focus:border-emerald-500 outline-none min-h-[90px]"
                placeholder="Optional context about this resource"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 mb-2">
                File
              </label>
              <input
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  setValues((prev) => ({ ...prev, file: selected }));
                }}
                className="w-full px-4 py-3 border border-neutral-300 bg-white"
                required
              />
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">Max size: 25MB</p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-5 py-2.5 border border-neutral-300 text-neutral-600 font-mono text-[10px] uppercase tracking-widest hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-[#111111] border border-[#111111] text-white font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-900 disabled:opacity-60"
            >
              {isUploading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
