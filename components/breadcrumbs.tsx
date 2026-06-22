import Link from 'next/link';

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-slate">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-amber">
                  {item.name}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-ink' : ''}>
                  {item.name}
                </span>
              )}
              {!isLast && <span aria-hidden className="text-ink/30">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
