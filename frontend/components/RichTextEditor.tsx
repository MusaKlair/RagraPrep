'use client';

import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const extensions = [
  StarterKit.configure({
    codeBlock: {},
  }),
];

function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        canCodeBlock: ctx.editor.can().chain().toggleCodeBlock().run() ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div className="border-b border-neutral-200 p-2 flex flex-wrap gap-1 bg-neutral-50">
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isBold ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isItalic ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isStrike ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isCode ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          disabled={!editorState.canClearMarks}
          className="px-2 py-1 border bg-white text-neutral-400 border-neutral-200 font-mono text-[9px] uppercase tracking-widest disabled:opacity-50 hover:text-neutral-900 transition-colors"
        >
          Clear marks
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-2 py-1 border bg-white text-neutral-400 border-neutral-200 font-mono text-[9px] uppercase tracking-widest hover:text-neutral-900 transition-colors"
        >
          Clear nodes
        </button>
        <div className="w-px h-4 bg-neutral-200 mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isParagraph
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          P
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isHeading1
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isHeading2
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isHeading3
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isBulletList
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isCodeBlock
            ? 'bg-emerald-500 text-white border-emerald-500'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          Code_Box
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 transition-colors border font-mono text-[9px] uppercase tracking-widest ${editorState.isBlockquote
            ? 'bg-neutral-900 text-white border-neutral-900'
            : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
            }`}
        >
          Quote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 border bg-white text-neutral-400 border-neutral-200 font-mono text-[9px] uppercase tracking-widest hover:text-neutral-900 transition-colors"
        >
          HR
        </button>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="px-2 py-1 border bg-white text-neutral-400 border-neutral-200 font-mono text-[9px] uppercase tracking-widest hover:text-neutral-900 transition-colors"
        >
          BR
        </button>
        <div className="w-px h-4 bg-neutral-200 mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className="px-2 py-1 border bg-white text-neutral-400 border-neutral-200 font-mono text-[9px] uppercase tracking-widest disabled:opacity-50 hover:text-neutral-900 transition-colors"
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className="px-2 py-1 border bg-white text-neutral-400 border-neutral-200 font-mono text-[9px] uppercase tracking-widest disabled:opacity-50 hover:text-neutral-900 transition-colors"
        >
          Redo
        </button>
      </div>
    </div>
  );
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-neutral max-w-none focus:outline-none min-h-[320px] p-6 text-neutral-600 font-mono text-sm leading-relaxed',
      },
    },
    immediatelyRender: false,
  });

  // Update editor content when prop changes (e.g., from AI generation)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="border border-neutral-200 min-h-[320px] p-6 bg-white flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 animate-pulse">Initializing Editor...</div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 focus-within:border-emerald-500/30 transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="bg-white" />
    </div>
  );
}


