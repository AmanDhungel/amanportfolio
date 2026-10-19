"use client";

/**
 * The only place GSAP plugins are registered. Import gsap and its plugins
 * from here, and only from client components.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip);
}

/** Motion tokens. Reveals ease out, small UI changes stay quick, wipes ease both ways. */
export const ease = {
  reveal: "expo.out",
  ui: "power3.out",
  wipe: "expo.inOut",
} as const;

export const duration = {
  reveal: 0.9,
  ui: 0.6,
  wipe: 0.9,
} as const;

/** Media conditions for gsap.matchMedia(). */
export const media = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  finePointer: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;

/** Dispatched on window when the opening sequence ends (or is skipped). */
export const INTRO_DONE_EVENT = "ad:intro-done";

/** True when the boot script enabled motion and the failsafe has not removed it. */
export function motionEnabled(): boolean {
  return document.documentElement.classList.contains("js-motion");
}

/** Resolves when web fonts are ready, or after `timeout` ms, whichever is first. */
export function fontsReady(timeout = 1500): Promise<void> {
  const ready = document.fonts?.ready.then(() => undefined) ?? Promise.resolve();
  return Promise.race([ready, new Promise<void>((resolve) => setTimeout(resolve, timeout))]);
}

/**
 * Stagger per item that keeps a reveal inside the 1.2s ceiling, whatever
 * the number of items.
 */
export function cappedStagger(count: number, each: number, total = 0.4): number {
  return count > 1 ? Math.min(each, total / (count - 1)) : 0;
}

export { Flip, gsap, ScrollTrigger, SplitText, useGSAP };
