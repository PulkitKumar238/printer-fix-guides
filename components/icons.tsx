import type { IconKey } from '@/lib/types';

type IconProps = {
  className?: string;
};

/**
 * Custom simple line-icons drawn as inline SVG, so the site avoids the generic
 * icon-library look. All share a 24px grid, 1.6 stroke, round caps/joins.
 */
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function Setup({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="9" width="16" height="8" rx="1.5" />
      <path d="M7 9V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V9" />
      <path d="M7 17v2.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="m19.5 4.8.9.5M21 7.2l-1 .2" />
      <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Offline({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="8" width="16" height="9" rx="1.5" />
      <path d="M7 8V5h10v3" />
      <path d="M9 21h6" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

function Drivers({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
      <path d="m9.5 10.5 1.8 1.8 3.2-3.6" />
    </svg>
  );
}

function Wifi({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 9.5a10 10 0 0 1 14 0" />
      <path d="M7.5 12.5a6.5 6.5 0 0 1 9 0" />
      <path d="M10 15.5a3 3 0 0 1 4 0" />
      <circle cx="12" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function NotPrinting({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 8V4h10v4" />
      <path d="M6 8h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2" />
      <path d="M5 16H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2" />
      <rect x="7" y="14" width="10" height="6" rx="1" />
      <path d="m10 16.5 4 3M14 16.5l-4 3" />
    </svg>
  );
}

function PaperJam({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="9" width="16" height="7" rx="1.5" />
      <path d="M8 9 9.8 5.2a1 1 0 0 1 1.3-.5l4.4 1.9a1 1 0 0 1 .5 1.3L14.8 11" />
      <path d="M9 19h6" />
      <path d="M12 16v3" />
    </svg>
  );
}

function Scanner({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
      <path d="M4 12h16" />
      <path d="M7 9h6" />
    </svg>
  );
}

function ErrorIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4 21 19H3L12 4Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BrandIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M4 20h16" />
      <rect x="9.5" y="13" width="5" height="7" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

const map: Record<IconKey, (p: IconProps) => JSX.Element> = {
  setup: Setup,
  offline: Offline,
  drivers: Drivers,
  wifi: Wifi,
  'not-printing': NotPrinting,
  'paper-jam': PaperJam,
  scanner: Scanner,
  error: ErrorIcon,
  brand: BrandIcon,
  search: SearchIcon,
};

export function Icon({ name, className }: { name: IconKey; className?: string }) {
  const Cmp = map[name];
  return <Cmp className={className} />;
}

export { SearchIcon };
