"use client";

import Image from "next/image";
import { useRef } from "react";

import type { Shot } from "@/content/site";
import { ease, gsap, media, motionEnabled, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

const GAP = 24;

/**
 * Desktop with a precise pointer only: a screenshot follows the cursor over
 * the work index and switches as the pointer moves between rows. Everywhere
 * else each row shows its screenshot inline instead.
 */
export function WorkPreview({ shots }: { shots: Shot[] }) {
  const fine = useMediaQuery(media.finePointer);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const preview = ref.current;
      const index = preview?.closest<HTMLElement>("[data-work-index]");
      if (!preview || !index || !fine || !motionEnabled() || !contextSafe) return;

      const rows = Array.from(index.querySelectorAll<HTMLElement>("[data-work-row]"));
      const images = Array.from(preview.querySelectorAll<HTMLElement>("[data-preview-image]"));
      gsap.set(preview, { autoAlpha: 0, scale: 0.94, yPercent: -50 });
      gsap.set(images, { autoAlpha: 0 });

      const toX = gsap.quickTo(preview, "x", { duration: 0.6, ease: ease.ui });
      const toY = gsap.quickTo(preview, "y", { duration: 0.6, ease: ease.ui });
      let active = -1;
      let placed = false;

      // Sit to the right of the cursor, flipping left near the viewport edge.
      const target = (event: PointerEvent) => {
        const width = preview.offsetWidth;
        const x = event.clientX + GAP + width > window.innerWidth ? event.clientX - GAP - width : event.clientX + GAP;
        return { x, y: event.clientY };
      };

      const onMove = contextSafe((event: PointerEvent) => {
        const { x, y } = target(event);
        if (!placed) {
          gsap.set(preview, { x, y });
          placed = true;
        }
        toX(x);
        toY(y);
      });

      const show = contextSafe((next: number) => {
        if (next === active) return;
        active = next;
        images.forEach((image, i) =>
          gsap.to(image, { autoAlpha: i === next ? 1 : 0, duration: 0.35, ease: ease.ui, overwrite: true }),
        );
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.ui, overwrite: "auto" });
      });

      const hide = contextSafe(() => {
        active = -1;
        placed = false;
        gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: 0.4, ease: ease.ui, overwrite: "auto" });
      });

      const enters = rows.map((row, i) => {
        const onEnter = () => show(i);
        row.addEventListener("pointerenter", onEnter);
        return () => row.removeEventListener("pointerenter", onEnter);
      });
      index.addEventListener("pointermove", onMove);
      index.addEventListener("pointerleave", hide);

      return () => {
        enters.forEach((remove) => remove());
        index.removeEventListener("pointermove", onMove);
        index.removeEventListener("pointerleave", hide);
      };
    },
    { dependencies: [fine], revertOnUpdate: true },
  );

  if (!fine) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 aspect-[16/10] w-[min(30vw,28rem)] overflow-hidden rounded-md border border-rule bg-surface opacity-0"
    >
      {shots.map((shot, i) => (
        <div key={i} data-preview-image className="absolute inset-0">
          <Image src={shot.src} alt="" placeholder="blur" fill sizes="30vw" className="object-cover object-top" />
        </div>
      ))}
    </div>
  );
}
