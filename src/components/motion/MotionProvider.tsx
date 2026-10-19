"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { INTRO_STORAGE_KEY } from "@/lib/boot-script";
import { gsap, media, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

const NAV_OFFSET = -72;

/** Drives Lenis from GSAP's ticker so smooth scroll and ScrollTrigger share one frame loop. */
function LenisBridge() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);
  return null;
}

function markIntroSeen() {
  document.documentElement.classList.add("intro-seen");
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable (private mode). The intro then simply plays again next visit.
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  // Lenis never runs with reduced motion. Touch devices keep native scrolling (Lenis default).
  const motionAllowed = useMediaQuery(media.motion);
  const lenis = useLenis();
  const pathname = usePathname();
  const isFirstPath = useRef(true);
  const progressRef = useRef<HTMLDivElement>(null);

  // Tell the boot-script failsafe that motion code is alive.
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const refresh = () => ScrollTrigger.refresh();
    // One re-measure once fonts and images have loaded (fonts are preloaded, so they finish first).
    if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  // Page changes: old ScrollTriggers were reverted by each page's useGSAP cleanup.
  // Start the new page at the top (or at its #hash) and re-measure.
  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    // The intro belongs to the first page load only.
    markIntroSeen();
    const target = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
    if (lenis) {
      lenis.scrollTo(target ?? 0, { immediate: true, force: true, offset: target ? NAV_OFFSET : 0 });
    } else if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
    // Only route changes should run this, not a new Lenis instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.motion, () => {
        // Thin scroll-progress line, scrubbed to the whole page.
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
        );
      });
      mm.add(media.reduce, () => {
        // If the visitor turns on reduced motion mid-visit, show everything in its final state.
        document.documentElement.classList.remove("js-motion");
        markIntroSeen();
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <>
      {motionAllowed ? (
        <>
          <ReactLenis root options={{ autoRaf: false, lerp: 0.12 }} />
          <LenisBridge />
        </>
      ) : null}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-accent"
      />
      {children}
    </>
  );
}
