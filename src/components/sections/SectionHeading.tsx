import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

/** A section's h2 plus an optional intro line. The heading reveals by characters. */
export function SectionHeading({ id, title, children, className = "" }: Props) {
  return (
    <div className={`grid gap-4 md:grid-cols-12 md:items-end ${className}`}>
      <h2 id={id} data-split="chars" className="font-serif text-h2 font-normal tracking-[-0.02em] md:col-span-7">
        {title}
      </h2>
      {children ? (
        <p data-split="lines" className="max-w-[46ch] text-muted md:col-span-5 md:justify-self-end">
          {children}
        </p>
      ) : null}
    </div>
  );
}
