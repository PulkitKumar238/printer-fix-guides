'use client';

/** Button that opens the live support chat via the shared custom event. */
export function OpenChatButton({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => window.dispatchEvent(new CustomEvent('support-chat:open'))}
    >
      {children}
    </button>
  );
}
