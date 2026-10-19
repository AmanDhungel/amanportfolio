"use client";

import { useRef } from "react";

import { ease, gsap, media, motionEnabled, ScrollTrigger, useGSAP } from "@/lib/gsap";

const PIN_LENGTH = "+=175%";

/**
 * The site's only pinned section, desktop only (≥1024px). While pinned for
 * about 175vh, each step becomes active in turn: its title lights, its text
 * swaps in, and its diagram wipes over the previous one with clip-path.
 * Below 1024px or with reduced motion the steps simply stack.
 */
export function WalkthroughMotion() {
  const anchor = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const section = anchor.current?.closest<HTMLElement>("[data-walkthrough]");
    if (!section || !motionEnabled()) return;

    const mm = gsap.matchMedia();
    mm.add(media.desktop, () => {
      const pin = section.querySelector<HTMLElement>("[data-walk-pin]");
      const titles = gsap.utils.toArray<HTMLElement>("[data-walk-title]", section);
      const markers = gsap.utils.toArray<HTMLElement>("[data-walk-marker]", section);
      const details = gsap.utils.toArray<HTMLElement>("[data-walk-detail]", section);
      const panels = gsap.utils.toArray<HTMLElement>("[data-walk-panel]", section);
      if (!pin || panels.length === 0) return;

      const count = panels.length;
      let current = 0;

      gsap.set(panels, {
        clipPath: (i: number) => (i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)"),
        zIndex: (i: number) => (i === 0 ? 2 : 1),
      });
      gsap.set(details, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });
      gsap.set(markers, { scaleY: (i: number) => (i === 0 ? 1 : 0) });
      titles[0]?.classList.add("is-active");

      const go = (next: number) => {
        if (next === current) return;
        const forward = next > current;
        const previous = current;
        current = next;

        gsap.set(panels, { zIndex: 1 });
        gsap.set(panels[previous], { zIndex: 2 });
        gsap.set(panels[next], { zIndex: 3 });
        gsap.fromTo(
          panels[next],
          { clipPath: forward ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: ease.wipe, overwrite: true },
        );

        gsap.to(details[previous], { autoAlpha: 0, y: forward ? -12 : 12, duration: 0.3, ease: ease.ui, overwrite: true });
        gsap.fromTo(
          details[next],
          { autoAlpha: 0, y: forward ? 16 : -16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.ui, delay: 0.15, overwrite: true },
        );

        titles.forEach((title, i) => title.classList.toggle("is-active", i === next));
        markers.forEach((marker, i) =>
          gsap.to(marker, { scaleY: i === next ? 1 : 0, duration: 0.6, ease: ease.ui, overwrite: true }),
        );
      };

      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: PIN_LENGTH,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => go(Math.min(count - 1, Math.floor(self.progress * count))),
      });
    });
  });

  return <span ref={anchor} hidden />;
}
