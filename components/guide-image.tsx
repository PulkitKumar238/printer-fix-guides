import Image from 'next/image';
import type { DiagnosticStep } from '@/lib/types';

type StepImage = NonNullable<DiagnosticStep['image']>;

/**
 * Renders a step illustration with next/image. Placeholder art currently lives
 * as SVG under /public/images; dropping a real raster photo at the same path
 * (and updating the src in the content file) swaps it in with no code change.
 *
 * `priority` is set for above-the-fold images; everything else lazy-loads.
 */
export function GuideImage({
  image,
  priority = false,
}: {
  image: StepImage;
  priority?: boolean;
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-card">
      <Image
        src={image.src}
        alt={image.alt}
        width={1200}
        height={675}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        sizes="(max-width: 768px) 100vw, 720px"
        className="h-auto w-full"
      />
      {image.caption ? (
        <figcaption className="border-t border-ink/10 px-4 py-2 text-sm text-slate">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
