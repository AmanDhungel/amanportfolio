/**
 * Runs inline in <head>, before first paint and before React hydrates.
 *
 * - With reduced motion: adds nothing, so every element renders in its final state.
 * - Otherwise: adds `js-motion` (motion CSS may hide elements until they reveal),
 *   and `intro-seen` if the intro already played in this browser session.
 * - Failsafe: if the motion code has not marked <html> with `motion-ready`
 *   within 4s (bundle failed, very slow network), `js-motion` is removed so
 *   nothing stays hidden.
 *
 * <html> carries suppressHydrationWarning, so these classes never cause a
 * hydration mismatch.
 */
export const INTRO_STORAGE_KEY = "ad-intro-seen";

export const bootScript = `(function(){try{var d=document.documentElement;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("js-motion");try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")==="1")d.classList.add("intro-seen")}catch(e){}setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("js-motion")},4000)}catch(e){}})();`;
