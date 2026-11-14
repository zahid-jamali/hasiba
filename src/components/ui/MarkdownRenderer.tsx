import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Split into blocks by double newlines
  const blocks = content.split(/\n\s*\n/);

  return (
    <div
      className={`prose dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed ${className}`}
    >
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // H2
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800"
            >
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // H3
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 pt-3 pb-1"
            >
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-s-4 border-brand-500 ps-4 py-2 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 rounded-e-lg"
            >
              {trimmed.replace(/^>\s+/, '')}
            </blockquote>
          );
        }

        // List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
          return (
            <ul key={idx} className="list-disc ps-6 space-y-1.5 my-2">
              {items.map((item, itemIdx) => {
                const line = item.replace(/^[-*]\s+/, '');
                return (
                  <li key={itemIdx} dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
                );
              })}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p
            key={idx}
            className="text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderInline(trimmed) }}
          />
        );
      })}
    </div>
  );
};

/**
 * Basic safe inline renderer for bold, code, and links
 */
function renderInline(text: string): string {
  return text
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>')
    // Code: `code`
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm font-mono text-brand-700 dark:text-brand-400">$1</code>')
    // Links: [label](url)
    .replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-600 dark:text-brand-400 underline hover:text-brand-800 transition-colors">$1</a>');
}
