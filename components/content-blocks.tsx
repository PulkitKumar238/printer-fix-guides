import type { ContentBlock } from '@/lib/types';

function Note({ children, tone }: { children: React.ReactNode; tone: 'note' | 'warning' }) {
  const styles =
    tone === 'warning'
      ? 'border-amber/40 bg-amber/5 text-ink'
      : 'border-ink/15 bg-ink/[0.03] text-ink';
  const label = tone === 'warning' ? 'Important' : 'Tip';
  return (
    <div className={`my-4 rounded-xl border-l-4 ${styles} px-4 py-3`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber">
        {label}
      </p>
      <p className="text-[0.95rem] leading-relaxed">{children}</p>
    </div>
  );
}

/** Renders a sequence of content blocks with the shared guide prose styling. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-guide">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={i}>{block.text}</p>;
          case 'list':
            return block.ordered ? (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'note':
            return (
              <Note key={i} tone="note">
                {block.text}
              </Note>
            );
          case 'warning':
            return (
              <Note key={i} tone="warning">
                {block.text}
              </Note>
            );
        }
      })}
    </div>
  );
}
