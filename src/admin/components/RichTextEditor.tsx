import { useRef, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

const TOOLBAR_ITEMS = [
  { group: 'undo redo' },
  { group: 'formatting', items: [
    { action: 'bold', label: 'B', tag: 'strong' },
    { action: 'italic', label: 'I', tag: 'em' },
    { action: 'underline', label: 'U', tag: 'u' },
    { action: 'strikeThrough', label: 'S', tag: 's' },
  ]},
  { group: 'headings', items: [
    { action: 'formatBlock', value: 'h2', label: 'H2' },
    { action: 'formatBlock', value: 'h3', label: 'H3' },
    { action: 'formatBlock', value: 'p', label: '¶' },
  ]},
  { group: 'colors', items: [
    { action: 'foreColor', label: '🎨', type: 'color' },
    { action: 'hiliteColor', label: '🖍️', type: 'color' },
  ]},
  { group: 'align', items: [
    { action: 'justifyLeft', label: '⬅' },
    { action: 'justifyCenter', label: '⬌' },
    { action: 'justifyRight', label: '➡' },
    { action: 'justifyFull', label: '☰' },
  ]},
  { group: 'lists', items: [
    { action: 'insertUnorderedList', label: '• List' },
    { action: 'insertOrderedList', label: '1. List' },
    { action: 'outdent', label: '←' },
    { action: 'indent', label: '→' },
  ]},
  { group: 'insert', items: [
    { action: 'createLink', label: '🔗' },
    { action: 'insertImage', label: '🖼️' },
    { action: 'insertHorizontalRule', label: '—' },
  ]},
  { group: 'blocks', items: [
    { action: 'formatBlock', value: 'blockquote', label: '❝ Quote' },
    { action: 'formatBlock', value: 'pre', label: '</>' },
    { action: 'insertTable', label: '⊞ Table' },
  ]},
  { group: 'clear', items: [
    { action: 'removeFormat', label: '✕ Clear' },
  ]},
];

export default function RichTextEditor({ value, onChange, height = 500, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdating = useRef(false);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleAction = useCallback((item: any) => {
    if (item.action === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) exec('createLink', url);
    } else if (item.action === 'insertImage') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => exec('insertImage', reader.result as string);
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else if (item.action === 'insertTable') {
      const rows = prompt('Number of rows:', '3');
      const cols = prompt('Number of columns:', '3');
      if (rows && cols) {
        let table = '<table style="border-collapse:collapse;width:100%;margin:1em 0">';
        for (let i = 0; i < parseInt(rows); i++) {
          table += '<tr>';
          for (let j = 0; j < parseInt(cols); j++) {
            const tag = i === 0 ? 'th' : 'td';
            const style = 'border:1px solid #E8E0D5;padding:8px 12px;';
            const bg = i === 0 ? 'background:#F5EFE0;font-weight:600;' : '';
            table += `<${tag} style="${style}${bg}">${i === 0 ? 'Header ' + (j+1) : '&nbsp;'}</${tag}>`;
          }
          table += '</tr>';
        }
        table += '</table><p></p>';
        exec('insertHTML', table);
      }
    } else if (item.action === 'foreColor' || item.action === 'hiliteColor') {
      const color = prompt('Enter color (hex, e.g., #C46A52):', '#C46A52');
      if (color) exec(item.action, color);
    } else if (item.action === 'formatBlock') {
      exec('formatBlock', item.value);
    } else {
      exec(item.action);
    }
  }, [exec]);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editorRef.current && !isUpdating.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdating.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => { isUpdating.current = false; }, 0);
    }
  }, [onChange]);

  return (
    <div className="border border-[#E8E0D5] rounded overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#E8E0D5] bg-[#FBF8F3]">
        {TOOLBAR_ITEMS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <div className="w-px h-5 bg-[#E8E0D5] mx-1" />}
            {group.items?.map((item: any, ii: number) => (
              <button
                key={ii}
                type="button"
                onClick={() => handleAction(item)}
                className="px-2 py-1 text-sm text-warm-charcoal hover:bg-[#E8E0D5] rounded transition-colors min-w-[32px] h-8 flex items-center justify-center"
                title={item.label}
                dangerouslySetInnerHTML={{ __html: item.label }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="px-6 py-4 outline-none min-h-[200px] text-[15px] leading-relaxed text-warm-charcoal prose prose-stone max-w-none"
        style={{ minHeight: height, maxHeight: height, overflow: 'auto' }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #B5A998;
          pointer-events: none;
        }
        [contentEditable] h1 { font-size: 2em; font-weight: 600; margin: 0.8em 0 0.4em; }
        [contentEditable] h2 { font-size: 1.5em; font-weight: 600; margin: 0.8em 0 0.4em; }
        [contentEditable] h3 { font-size: 1.25em; font-weight: 500; margin: 0.6em 0 0.3em; }
        [contentEditable] p { margin: 0 0 1em; }
        [contentEditable] blockquote {
          border-left: 4px solid #C46A52;
          margin: 1em 0;
          padding: 0.5em 1em;
          background: #FBF8F3;
          color: #5C4A3A;
        }
        [contentEditable] table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        [contentEditable] table td, [contentEditable] table th {
          border: 1px solid #E8E0D5; padding: 8px 12px; text-align: left;
        }
        [contentEditable] table th { background: #F5EFE0; font-weight: 600; }
        [contentEditable] img { max-width: 100%; height: auto; border-radius: 4px; }
        [contentEditable] a { color: #C46A52; text-decoration: underline; }
        [contentEditable] ul, [contentEditable] ol { padding-left: 1.5em; margin: 0.5em 0; }
        [contentEditable] pre {
          background: #1C1812; color: #F5EFE0; padding: 1em; border-radius: 4px; overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        [contentEditable] hr { border: none; border-top: 2px solid #E8E0D5; margin: 1.5em 0; }
      `}</style>
    </div>
  );
}
