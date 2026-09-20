import Link from 'next/link';
import type { IconKey } from '@/lib/types';
import { Icon } from './icons';

/** Card-grid tile: icon + headline + one-line description + button. */
export function IssueCard({
  href,
  icon,
  title,
  description,
  cta = 'Fix this',
  accentClassName = 'text-amber',
  iconClassName = 'bg-amber/10 text-amber group-hover:bg-amber group-hover:text-surface',
  cardClassName = '',
  descriptionClassName = 'text-slate',
  titleClassName = 'text-ink',
  ctaClassName = '',
}: {
  href: string;
  icon: IconKey;
  title: string;
  description: string;
  cta?: string;
  /** Optional colour treatment for a page-specific card collection. */
  accentClassName?: string;
  iconClassName?: string;
  cardClassName?: string;
  descriptionClassName?: string;
  titleClassName?: string;
  ctaClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring group flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${cardClassName}`}
    >
      <span className={`mb-4 grid h-12 w-12 place-items-center rounded-xl transition-colors ${iconClassName}`}>
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className={`text-xl font-bold ${titleClassName}`}>{title}</h3>
      <p className={`mt-1.5 flex-1 text-[0.95rem] leading-relaxed ${descriptionClassName}`}>{description}</p>
      <span className={`mt-4 inline-flex items-center gap-1 font-medium ${accentClassName} ${ctaClassName}`}>
        {cta}
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
