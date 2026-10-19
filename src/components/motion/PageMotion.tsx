"use client";

import { useRef, type ReactNode } from "react";

import { cappedStagger, duration, ease, fontsReady, gsap, media, motionEnabled, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

const START = "top 85%";

/**
 * Wraps a page's <main> and runs every scroll reveal inside it, driven by
 * data attributes on server-rendered markup:
 *
 *   data-split="chars" | "lines"   heading / paragraph reveals behind a mask
 *   data-reveal="clip"             image frame wipes up into view
 *   data-work-row, data-batch-item rows stagger in with ScrollTrigger.batch
 *   data-skill-group, data-skill-chip   groups, then chips with amount 0.3
 *   data-timeline                  scrubbed rail; dots light up as it reaches them
 *   data-magnetic                  buttons drift up to 8px towards a fine pointer
 *
 * Reveals play once. Elements already revealed are marked, so a page brought
 * back by client navigation does not replay them.
 */
export function PageMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || !motionEnabled() || !contextSafe) return;
      let cancelled = false;
      const mm = gsap.matchMedia();

      const revealed = (el: Element) => el.hasAttribute("data-revealed");
      const markRevealed = (el: Element) => el.setAttribute("data-revealed", "");
      const all = <T extends Element = HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector, root);

      mm.add(
        { motion: media.motion, fine: media.finePointer },
        (context) => {
          const { fine } = context.conditions as { fine: boolean };
          const cleanups: (() => void)[] = [];

          // Text splits wait for fonts so line breaks and masks are measured on the real face.
          fontsReady().then(
            contextSafe(() => {
              if (cancelled) return;
              context.add(() => {
                for (const el of all("[data-split='chars']")) {
                  if (revealed(el)) {
                    gsap.set(el, { visibility: "visible" });
                    continue;
                  }
                  const split = SplitText.create(el, {
                    type: "words,chars",
                    mask: "chars",
                    charsClass: "split-char",
                  });
                  gsap.set(el, { visibility: "visible" });
                  gsap.from(split.chars, {
                    yPercent: 110,
                    duration: 0.8,
                    ease: ease.reveal,
                    stagger: cappedStagger(split.chars.length, 0.03),
                    scrollTrigger: { trigger: el, start: START, once: true, onEnter: () => markRevealed(el) },
                  });
                }

                for (const el of all("[data-split='lines']")) {
                  if (revealed(el)) {
                    gsap.set(el, { visibility: "visible" });
                    continue;
                  }
                  SplitText.create(el, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "split-line",
                    autoSplit: true,
                    onSplit(self) {
                      gsap.set(el, { visibility: "visible" });
                      return gsap.from(self.lines, {
                        yPercent: 105,
                        duration: 0.8,
                        ease: ease.reveal,
                        stagger: cappedStagger(self.lines.length, 0.07, 0.35),
                        scrollTrigger: { trigger: el, start: START, once: true, onEnter: () => markRevealed(el) },
                      });
                    },
                  });
                }
                ScrollTrigger.refresh();
              });
            }),
          );

          // Image frames wipe up into view.
          for (const frame of all("[data-reveal='clip']")) {
            if (revealed(frame)) {
              gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
            } else {
              gsap.fromTo(
                frame,
                { clipPath: "inset(100% 0% 0% 0%)" },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 1,
                  ease: ease.wipe,
                  scrollTrigger: { trigger: frame, start: START, once: true, onEnter: () => markRevealed(frame) },
                },
              );
            }
          }

          // Rows and list items stagger in, a batch at a time.
          const rows = all("[data-work-row], [data-batch-item]").filter((el) => !revealed(el));
          if (rows.length) {
            gsap.set(rows, { autoAlpha: 0, y: 32 });
            ScrollTrigger.batch(rows, {
              start: "top 92%",
              once: true,
              onEnter: (batch) => {
                batch.forEach(markRevealed);
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.8,
                  ease: ease.reveal,
                  stagger: 0.1,
                  overwrite: true,
                });
              },
            });
          }

          // Skill groups, then their chips.
          for (const group of all("[data-skill-group]")) {
            if (revealed(group)) continue;
            const chips = group.querySelectorAll("[data-skill-chip]");
            gsap
              .timeline({ scrollTrigger: { trigger: group, start: START, once: true, onEnter: () => markRevealed(group) } })
              .from(group, { autoAlpha: 0, y: 24, duration: duration.ui, ease: ease.reveal })
              .from(chips, { autoAlpha: 0, y: 12, duration: 0.5, ease: ease.ui, stagger: { amount: 0.3 } }, "-=0.4");
          }
          // Chips outside a group (case-study stacks) stagger in with their list.
          const chipLists = new Set(
            all("[data-skill-chip]")
              .filter((chip) => !chip.closest("[data-skill-group]"))
              .map((chip) => chip.parentElement!),
          );
          for (const list of chipLists) {
            if (revealed(list)) continue;
            gsap.from(list.children, {
              autoAlpha: 0,
              y: 12,
              duration: 0.5,
              ease: ease.ui,
              stagger: { amount: 0.3 },
              scrollTrigger: { trigger: list, start: START, once: true, onEnter: () => markRevealed(list) },
            });
          }

          // Experience: the rail draws with the scroll, each dot lights when the rail reaches it.
          for (const timeline of all("[data-timeline]")) {
            const fill = timeline.querySelector("[data-timeline-fill]");
            gsap.fromTo(
              fill,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: timeline, start: "top 65%", end: "bottom 65%", scrub: 0.4 },
              },
            );
            for (const dot of timeline.querySelectorAll("[data-timeline-dot]")) {
              ScrollTrigger.create({
                trigger: dot,
                start: "top 65%",
                toggleClass: { targets: dot, className: "is-reached" },
              });
            }
          }

          // Magnetic buttons, only for a precise pointer.
          if (fine) {
            for (const button of all("[data-magnetic]")) {
              const toX = gsap.quickTo(button, "x", { duration: 0.5, ease: ease.ui });
              const toY = gsap.quickTo(button, "y", { duration: 0.5, ease: ease.ui });
              const onMove = contextSafe((event: PointerEvent) => {
                const rect = button.getBoundingClientRect();
                const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                toX(gsap.utils.clamp(-1, 1, dx) * 8);
                toY(gsap.utils.clamp(-1, 1, dy) * 8);
              });
              const onLeave = contextSafe(() => {
                toX(0);
                toY(0);
              });
              button.addEventListener("pointermove", onMove);
              button.addEventListener("pointerleave", onLeave);
              cleanups.push(() => {
                button.removeEventListener("pointermove", onMove);
                button.removeEventListener("pointerleave", onLeave);
              });
            }
          }

          // Late-loading images change the page height; re-measure once each loads.
          const onImage = () => ScrollTrigger.refresh();
          const pending = Array.from(root.querySelectorAll("img")).filter((img) => !img.complete);
          pending.forEach((img) => img.addEventListener("load", onImage, { once: true }));
          cleanups.push(() => pending.forEach((img) => img.removeEventListener("load", onImage)));

          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );

      return () => {
        cancelled = true;
      };
    },
    { scope },
  );

  return (
    <main id="main" ref={scope} tabIndex={-1} className="outline-none">
      {children}
    </main>
  );
}
