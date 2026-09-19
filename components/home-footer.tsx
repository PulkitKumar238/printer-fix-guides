'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/footer';

/** The full site footer is intentionally shown only on the public homepage. */
export function HomeFooter() {
  const pathname = usePathname();

  return pathname === '/' ? <Footer /> : null;
}
