"use client";

import { useEffect, useRef, useState } from "react";

const labels = {
  idle: "Copy email",
  copied: "Copied",
  failed: "Copy failed",
} as const;

const announcements = {
  idle: "",
  copied: "Email address copied.",
  failed: "Copy failed. Select the address above to copy it.",
} as const;

export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<keyof typeof labels>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <>
      <button type="button" onClick={copy} className="btn min-w-[8.5rem]" data-magnetic>
        {labels[status]}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {announcements[status]}
      </span>
    </>
  );
}
