"use client";

import { useRef, type ReactNode } from "react";

import { cappedStagger, duration, ease, gsap, INTRO_DONE_EVENT, media, motionEnabled, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

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
      const mm = gsap.matchMedia();

      const revealed = (el: Element) => el.hasAttribute("data-revealed");
      const markRevealed = (el: Element) => el.setAttribute("data-revealed", "");
      const all = <T extends Element = HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector, root);

      // All reveals run inside gsap.matchMedia, so they revert if the conditions change.
      const reveals = (context: gsap.Context) => {
        const { fine } = context.conditions as { fine: boolean };
        const cleanups: (() => void)[] = [];

        // Text is split lazily, when it reaches the viewport, so no long task runs at load.
        // Work done in ScrollTrigger callbacks is added to this matchMedia context so it reverts.
        for (const el of all("[data-split='chars']")) {
          if (revealed(el)) {
            gsap.set(el, { opacity: 1 });
            continue;
          }
          ScrollTrigger.create({
            trigger: el,
            start: START,
            once: true,
            onEnter: () =>
              context.add(() => {
                markRevealed(el);
                const split = SplitText.create(el, { type: "words,chars", mask: "chars", charsClass: "split-char" });
                gsap.set(el, { opacity: 1 });
                gsap.from(split.chars, {
                  yPercent: 110,
                  duration: 0.8,
                  ease: ease.reveal,
                  stagger: cappedStagger(split.chars.length, 0.03),
                });
              }),
          });
        }

        for (const el of all("[data-split='lines']")) {
          if (revealed(el)) {
            gsap.set(el, { opacity: 1 });
            continue;
          }
          ScrollTrigger.create({
            trigger: el,
            start: START,
            once: true,
            onEnter: () =>
              context.add(() => {
                markRevealed(el);
                SplitText.create(el, {
                  type: "lines",
                  mask: "lines",
                  linesClass: "split-line",
                  // Line splits keep words whole, so screen readers read them as normal text.
                  // The default ("auto") would put aria-label on a <p>, which ARIA does not allow.
                  aria: "none",
                  // Re-splits on resize and font load; the returned tween is re-synced each time.
                  autoSplit: true,
                  onSplit(self) {
                    gsap.set(el, { opacity: 1 });
                    return gsap.from(self.lines, {
                      yPercent: 105,
                      duration: 0.8,
                      ease: ease.reveal,
                      stagger: cappedStagger(self.lines.length, 0.07, 0.35),
                    });
                  },
                });
              }),
          });
        }

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
          gsap.set(rows, { opacity: 0, y: 32 });
          ScrollTrigger.batch(rows, {
            start: "top 92%",
            once: true,
            onEnter: (batch) => {
              batch.forEach(markRevealed);
              gsap.to(batch, {
                opacity: 1,
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
            .from(group, { opacity: 0, y: 24, duration: duration.ui, ease: ease.reveal })
            .from(chips, { opacity: 0, y: 12, duration: 0.5, ease: ease.ui, stagger: { amount: 0.3 } }, "-=0.4");
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
            opacity: 0,
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
      };
      const setup = () => mm.add({ motion: media.motion, fine: media.finePointer }, reveals);

      // While the opening sequence plays, nothing below it is visible; set up afterwards
      // so the intro has the main thread to itself.
      const html = document.documentElement;
      const introPlaying = !html.classList.contains("intro-seen") && root.querySelector("[data-intro]");
      if (!introPlaying) {
        setup();
        return;
      }
      const onIntroDone = contextSafe(() => setup());
      window.addEventListener(INTRO_DONE_EVENT, onIntroDone, { once: true });
      return () => window.removeEventListener(INTRO_DONE_EVENT, onIntroDone);
    },
    { scope },
  );

  return (
    <main id="main" ref={scope} tabIndex={-1} className="outline-none">
      {children}
    </main>
  );
}
