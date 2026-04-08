import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Heading2, Heading3, 
  Link as LinkIcon, Unlink, Table as TableIcon,
  Plus, Trash2, Undo, Redo, Type, ChevronDown, Check
} from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';

// Sub-components moved outside to prevent re-mounting on parent re-render
const ToolbarButton = ({ 
  onClick, 
  active = false, 
  children, 
  title,
  disabled = false
}: { 
  onClick: () => void; 
  active?: boolean; 
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 transition-all rounded-md flex items-center justify-center ${
      active 
        ? 'bg-[#C4714A] text-white shadow-inner' 
        : 'text-[#5C4A3A] hover:bg-[#F2EBE0] hover:text-[#C4714A]'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

interface ModernRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function ModernRichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start writing...',
  minHeight = '400px'
}: ModernRichTextEditorProps) {
  const [showTableMenu, setShowTableMenu] = useState(false);
  const editorRef = useRef<string>(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-terracotta underline cursor-pointer' },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      editorRef.current = html;
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none focus:outline-none px-6 py-8 font-sub text-[15px] leading-relaxed text-[#242118] overflow-auto',
      },
    },
  });

  // BULLETPROOF SYNC: Only update if value is different AND we are not focused.
  // We use a ref to track the last known state to avoid re-rendering loops.
  useEffect(() => {
    if (editor && value !== editorRef.current && !editor.isFocused) {
      editorRef.current = value;
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return (
    <div className="w-full h-32 flex items-center justify-center bg-[#FBF8F3] border border-[#E8E0D5] rounded-lg">
      <span className="text-[#B5A998] font-sub text-sm">Initializing Editor...</span>
    </div>
  );

  // Safe access to character count
  let charCount = editor.storage?.characterCount?.characters?.() ?? editor.storage?.characterCount?.characters ?? 0;
  if (typeof charCount === 'function') charCount = charCount();
  if (typeof charCount !== 'number') charCount = 0;

  return (
    <div className="w-full border border-[#E8E0D5] bg-[#FFFFFF] shadow-sm overflow-hidden flex flex-col group focus-within:ring-1 focus-within:ring-[#C4714A]/20 transition-all rounded-lg">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#E8E0D5] bg-[#FBF8F3]">
        <div className="flex items-center gap-1 border-r border-[#E8E0D5] pr-2 mr-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive('paragraph')}
            title="Paragraph"
          >
            <Type size={18} />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 border-r border-[#E8E0D5] pr-2 mr-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon size={18} />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 border-r border-[#E8E0D5] pr-2 mr-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote size={18} />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 border-r border-[#E8E0D5] pr-2 mr-1">
          <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link">
            <LinkIcon size={18} />
          </ToolbarButton>
        </div>

        <div className="relative flex items-center gap-1 border-r border-[#E8E0D5] pr-2 mr-1">
          <ToolbarButton 
            onClick={() => setShowTableMenu(!showTableMenu)} 
            active={showTableMenu || editor.isActive('table')}
            title="Table Tools"
          >
            <div className="flex items-center gap-1">
              <TableIcon size={18} />
              <ChevronDown size={12} className={`transition-transform duration-200 ${showTableMenu ? 'rotate-180' : ''}`} />
            </div>
          </ToolbarButton>
          
          {showTableMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-[#E8E0D5] shadow-xl rounded-lg p-1 z-[100] flex flex-col gap-1 min-w-[180px] origin-top-left animate-in slide-in-from-top-2 duration-200">
              <button 
                onClick={() => { editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); setShowTableMenu(false); }} 
                className="px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F2EBE0] rounded-md transition-colors flex items-center gap-2"
              >
                <Plus size={14} className="text-[#C4714A]" /> Insert Table (3x3)
              </button>
              <div className="h-[1px] bg-[#E8E0D5] my-1 mx-1" />
              <button onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false); }} disabled={!editor.isActive('table')} className="px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F2EBE0] rounded-md text-left disabled:opacity-30 disabled:pointer-events-none">Add Row After</button>
              <button onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false); }} disabled={!editor.isActive('table')} className="px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F2EBE0] rounded-md text-left disabled:opacity-30 disabled:pointer-events-none">Add Column After</button>
              <div className="h-[1px] bg-[#E8E0D5] my-1 mx-1" />
              <button onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false); }} disabled={!editor.isActive('table')} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 disabled:opacity-30">
                <Trash2 size={14} /> Delete Row
              </button>
              <button onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false); }} disabled={!editor.isActive('table')} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 font-medium disabled:opacity-30">
                <Trash2 size={14} /> Remove Table
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={16} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content Area */}
      <div 
        className="relative flex-1 bg-[#FBF8F3]/30 overflow-auto" 
        style={{ minHeight, cursor: 'text' }}
        onClick={() => !editor.isFocused && editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-top border-[#E8E0D5] bg-[#FBF8F3] text-[10px] uppercase tracking-widest text-[#B5A998]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span>Editor Ready</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{charCount} Characters</span>
          <div className="flex gap-2">
            {editor.isActive('bold') && <Check size={10} className="text-[#C4714A]" />}
            {editor.isActive('italic') && <Check size={10} className="text-[#C4714A]" />}
          </div>
        </div>
      </div>

      <style>{`
        .ProseMirror {
          min-height: ${minHeight};
          outline: none !important;
          color: #242118 !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #B5A998;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #C4714A;
          padding-left: 1.5rem;
          font-style: italic;
          color: #5C4A3A;
          margin: 1.5rem 0;
        }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin: 1.25rem 0; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1.25rem 0; }
        .ProseMirror h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.25rem; font-style: italic; margin-top: 2.5rem; margin-bottom: 1.25rem; color: #1C1812; line-height: 1.2; }
        .ProseMirror h3 { font-family: 'DM Sans', sans-serif; font-size: 1.125rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 1.75rem; margin-bottom: 1rem; color: #1C1812; }
        .ProseMirror a { color: #C4714A; text-decoration: underline; cursor: pointer; }
        
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 2rem 0;
          overflow: hidden;
        }
        .ProseMirror table td, .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #E8E0D5;
          padding: 10px 14px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          color: #242118;
        }
        .ProseMirror table th {
          font-weight: 600;
          text-align: left;
          background-color: #FBF8F3;
        }
        .ProseMirror .selectedCell:after {
          z-index: 2;
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(196, 113, 74, 0.05);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
