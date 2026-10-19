"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

import { person } from "@/content/site";
import { INTRO_STORAGE_KEY } from "@/lib/boot-script";
import { duration, ease, Flip, fontsReady, gsap, motionEnabled, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

const MIN_INTRO = 0.9;
const MAX_INTRO = 1.6;
const SKIP_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function windowLoaded(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
}

function markIntroSeen() {
  document.documentElement.classList.add("intro-seen");
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Without storage the intro just plays again next session.
  }
}

/**
 * The opening sequence, once per session (about 2s):
 * name rises behind a mask while a counter tracks real loading (0.9–1.6s),
 * the panel wipes away while the name moves into the hero with Flip, then
 * the tagline, buttons and nav reveal. Any click, key or scroll skips to the end.
 * Later visits get a 0.8s hero reveal. With reduced motion none of this runs.
 *
 * The hero <h1> is server-rendered and painted under the panel from the
 * first frame, so it counts for Largest Contentful Paint.
 */
export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // Keep Lenis still while the intro plays.
  useEffect(() => {
    lenisRef.current = lenis;
    const html = document.documentElement;
    if (lenis && html.classList.contains("js-motion") && !html.classList.contains("intro-seen")) lenis.stop();
  }, [lenis]);

  useGSAP(
    (context, contextSafe) => {
      if (!motionEnabled() || !contextSafe) return;
      const html = document.documentElement;
      const overlay = rootRef.current;
      const heroName = document.querySelector<HTMLElement>("[data-hero-name]");
      const tagline = document.querySelector<HTMLElement>("[data-hero-reveal='lines']");
      // Hero and nav live outside this component, so query the document (useGSAP scopes selector text).
      const items = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-reveal='item']"));
      const navItems = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-item]"));
      const pulse = document.querySelector<HTMLElement>("[data-badge-pulse]");
      if (!overlay || !heroName || !tagline) return;

      const full = !html.classList.contains("intro-seen");
      let cancelled = false;

      /** Tagline by lines, then buttons, then the badge pulses once. */
      const revealHero = (timeline: gsap.core.Timeline, at: number) => {
        const split = SplitText.create(tagline, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(tagline, { visibility: "visible" });
        timeline
          .from(split.lines, { yPercent: 105, duration: 0.8, ease: ease.reveal, stagger: 0.07 }, at)
          .fromTo(
            items,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: duration.ui, ease: ease.ui, stagger: 0.06 },
            at + 0.15,
          );
        if (pulse) {
          timeline.fromTo(pulse, { scale: 1, opacity: 0.55 }, { scale: 2.8, opacity: 0, duration: 0.9, ease: "power2.out" }, at + 0.45);
        }
      };

      if (!full) {
        fontsReady(600).then(
          contextSafe(() => {
            if (cancelled) return;
            context.add(() => revealHero(gsap.timeline(), 0));
          }),
        );
        return () => {
          cancelled = true;
        };
      }

      const introName = overlay.querySelector<HTMLElement>("[data-intro-name]");
      const counterEl = overlay.querySelector<HTMLElement>("[data-intro-counter]");
      if (!introName || !counterEl) return;

      const counter = { value: 0 };
      const counterTween = gsap.to(counter, {
        value: 99,
        duration: MAX_INTRO,
        ease: "steps(14)",
        onUpdate: () => {
          counterEl.textContent = String(Math.round(counter.value)).padStart(2, "0");
        },
      });

      let nameIn: gsap.core.Timeline | undefined;
      let outro: gsap.core.Timeline | undefined;
      let done = false;

      const finish = contextSafe(() => {
        if (done) return;
        done = true;
        SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));
        gsap.set(heroName, { clearProps: "position,zIndex" });
        markIntroSeen();
        lenisRef.current?.start();
        ScrollTrigger.refresh();
      });

      const exit = contextSafe(() => {
        if (outro || cancelled) return;
        counterTween.kill();
        counterEl.textContent = "100";
        nameIn?.progress(1);

        // The panel lifts away while the centred name travels into the hero.
        const state = Flip.getState(introName);
        gsap.set(introName, { autoAlpha: 0 });
        gsap.set(heroName, { position: "relative", zIndex: 110 });
        outro = gsap.timeline({ onComplete: finish });
        outro
          .to(overlay, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: ease.wipe }, 0)
          .add(Flip.from(state, { targets: heroName, duration: duration.wipe, ease: ease.wipe, scale: true }), 0)
          .fromTo(
            navItems,
            { autoAlpha: 0, y: -10 },
            { autoAlpha: 1, y: 0, duration: duration.ui, ease: ease.ui, stagger: 0.05 },
            0.35,
          );
        revealHero(outro, 0.3);
      });

      const skip = contextSafe(() => {
        exit();
        outro?.progress(1);
      });
      SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }));

      // The name rises character by character once the face is ready to measure.
      fontsReady(500).then(
        contextSafe(() => {
          if (cancelled || outro) return;
          context.add(() => {
            const split = SplitText.create(introName, { type: "words,chars", mask: "chars", charsClass: "split-char" });
            gsap.set(introName, { visibility: "visible" });
            nameIn = gsap.timeline().from(split.chars, { yPercent: 110, duration: 0.55, ease: ease.reveal, stagger: 0.035 });
          });
        }),
      );

      // Leave when fonts and the page have loaded, but never before 0.9s or after 1.6s.
      const startedAt = performance.now();
      Promise.all([fontsReady(MAX_INTRO * 1000), windowLoaded()]).then(
        contextSafe(() => {
          const elapsed = (performance.now() - startedAt) / 1000;
          gsap.delayedCall(Math.max(0, MIN_INTRO - elapsed), exit);
        }),
      );
      gsap.delayedCall(MAX_INTRO, exit);

      return () => {
        cancelled = true;
        SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));
        if (!done) lenisRef.current?.start();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-intro
      aria-hidden="true"
      className="intro fixed inset-0 z-[100] items-center justify-center bg-bg [clip-path:inset(0%_0%_0%_0%)]"
    >
      <p
        data-intro-name
        data-flip-id="hero-name"
        className="w-fit font-serif text-display font-normal tracking-[-0.03em] [font-variation-settings:'opsz'_72]"
      >
        <span className="block md:inline">{person.firstName}</span>{" "}
        <em className="block italic md:inline">{person.lastName}</em>
      </p>
      <span
        data-intro-counter
        className="absolute right-[max(1rem,4vw)] bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-small tabular-nums text-muted"
      >
        00
      </span>
    </div>
  );
}
