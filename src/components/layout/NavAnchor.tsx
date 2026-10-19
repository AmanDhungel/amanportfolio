"use client";

import { useLenis } from "lenis/react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  onNavigate?: () => void;
};

const NAV_OFFSET = -72;

/**
 * An in-page anchor. It is a real link (works without JS); with Lenis running
 * it scrolls smoothly, and without Lenis it falls back to the browser jump.
 */
export function NavAnchor({ href, onNavigate, onClick, children, ...rest }: Props) {
  const lenis = useLenis();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    onNavigate?.();
    if (!href.startsWith("#") || event.defaultPrevented) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.1 });
    } else {
      target.scrollIntoView({ block: "start" });
    }
    history.replaceState(null, "", href);
    // Move keyboard focus with the scroll, as a native anchor jump would.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
