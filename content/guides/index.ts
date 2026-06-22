import type { Guide, GuideSlug } from '@/lib/types';
import { setupGuide } from './setup';
import { offlineGuide } from './offline';
import { driversGuide } from './drivers';
import { wifiGuide } from './wifi';
import { notPrintingGuide } from './not-printing';
import { paperJamGuide } from './paper-jam';
import { scannerGuide } from './scanner';

/** All guides keyed by slug. */
export const guides: Record<GuideSlug, Guide> = {
  setup: setupGuide,
  offline: offlineGuide,
  drivers: driversGuide,
  wifi: wifiGuide,
  'not-printing': notPrintingGuide,
  'paper-jam': paperJamGuide,
  scanner: scannerGuide,
};

/** Display order used on the homepage grid and in navigation. */
export const guideOrder: GuideSlug[] = [
  'setup',
  'offline',
  'drivers',
  'wifi',
  'not-printing',
  'paper-jam',
  'scanner',
];

export const allGuides: Guide[] = guideOrder.map((slug) => guides[slug]);

export function getGuide(slug: string): Guide | undefined {
  return (guides as Record<string, Guide>)[slug];
}
