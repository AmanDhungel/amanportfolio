"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { nav, person } from "@/content/site";
import { NavAnchor } from "@/components/layout/NavAnchor";

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenOn(null);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <header data-nav className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <div className="absolute inset-0 -z-10 border-b border-rule/70 bg-bg/85 backdrop-blur-md" aria-hidden="true" />
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          data-nav-item
          className="font-serif text-xl leading-none tracking-tight"
          aria-label={`${person.name}, home`}
        >
          {person.firstName} <em>{person.lastName}</em>
        </Link>

        <ul className="hidden items-center gap-7 text-[0.9375rem] font-medium md:flex">
          {nav.map((item) => (
            <li key={item.href} data-nav-item>
              <NavAnchor href={hrefFor(item.href)} className="transition-colors hover:text-accent">
                {item.label}
              </NavAnchor>
            </li>
          ))}
          <li data-nav-item>
            <a href={person.resume.href} download={person.resume.fileName} className="btn btn-primary min-h-0 py-2">
              Resume
            </a>
          </li>
        </ul>

        <button
          ref={buttonRef}
          type="button"
          className="btn min-h-0 px-4 py-2 md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
          data-nav-item
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div id={menuId} hidden={!open} className="container-page border-b border-rule bg-bg pb-6 md:hidden">
        <ul className="grid gap-1 text-lg font-medium">
          {nav.map((item) => (
            <li key={item.href}>
              <NavAnchor href={hrefFor(item.href)} className="block py-2" onNavigate={() => setOpen(false)}>
                {item.label}
              </NavAnchor>
            </li>
          ))}
          <li className="pt-3">
            <a href={person.resume.href} download={person.resume.fileName} className="btn btn-primary w-full">
              Download resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
