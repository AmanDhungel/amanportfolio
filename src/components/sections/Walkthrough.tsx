import Image from "next/image";

import { StepDiagram } from "@/components/sections/WalkthroughDiagrams";
import { walkthrough, type WalkthroughStep } from "@/content/site";

function StepVisual({ step }: { step: WalkthroughStep }) {
  if (step.shot) {
    return (
      <Image
        src={step.shot.src}
        alt={step.shot.alt}
        placeholder="blur"
        sizes="(min-width: 1024px) 55vw, 94vw"
        className="h-full w-full rounded-lg border border-rule object-cover object-top"
      />
    );
  }
  return <StepDiagram id={step.id} />;
}

function StatusPill({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <span className="ml-3 inline-block translate-y-[-0.2em] rounded-full border border-accent px-2.5 py-0.5 align-middle font-sans text-small text-accent">
      {status}
    </span>
  );
}

/**
 * The one pinned section. The <ol> is the accessible, stacked version used on
 * small screens, with reduced motion, and without JS. On wide screens with
 * motion, the aria-hidden stage replaces it visually and steps through the
 * same content as the visitor scrolls (see motion/WalkthroughMotion.tsx).
 */
export function Walkthrough() {
  const { steps } = walkthrough;
  return (
    <section aria-labelledby="walk-title" data-walkthrough className="mt-24 md:mt-36">
      <div data-walk-pin className="container-page walk-pin">
        <div className="grid gap-4 md:grid-cols-12 md:items-end">
          <h3
            id="walk-title"
            data-split="chars"
            className="font-serif text-h2 font-normal tracking-[-0.02em] md:col-span-7"
          >
            {walkthrough.title}
          </h3>
          <p data-split="lines" className="max-w-[46ch] text-muted md:col-span-5 md:justify-self-end">
            {walkthrough.intro}
          </p>
        </div>

        <ol className="walk-list mt-12 grid gap-14">
          {steps.map((step) => (
            <li key={step.id} className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-12 md:gap-10">
              <div className="min-w-0 md:col-span-5">
                <h4 className="font-serif text-h3 font-normal md:text-[2rem] md:leading-tight">
                  {step.title}
                  <StatusPill status={step.status} />
                </h4>
                <p className="mt-3 max-w-[44ch]">{step.body}</p>
                <ul className="mt-4 grid gap-1.5 text-small text-muted">
                  {step.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 md:col-span-7">
                <StepVisual step={step} />
              </div>
            </li>
          ))}
        </ol>

        <div className="walk-stage mt-12 grid-cols-12 gap-10" aria-hidden="true">
          <div className="col-span-5 flex flex-col">
            <ul className="grid gap-1 border-l border-rule">
              {steps.map((step) => (
                <li
                  key={step.id}
                  data-walk-title
                  className="relative py-2 pl-6 font-serif text-[1.75rem] leading-tight text-muted transition-colors duration-500"
                >
                  <span
                    data-walk-marker
                    className="absolute top-0 bottom-0 -left-px w-0.5 origin-top scale-y-0 bg-accent"
                  />
                  {step.title}
                  <StatusPill status={step.status} />
                </li>
              ))}
            </ul>
            <div className="mt-10 grid">
              {steps.map((step) => (
                <div key={step.id} data-walk-detail className="[grid-area:1/1]">
                  <p className="max-w-[44ch]">{step.body}</p>
                  <ul className="mt-4 grid gap-1.5 text-small text-muted">
                    {step.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-7 grid">
            {steps.map((step) => (
              <div key={step.id} data-walk-panel className="[grid-area:1/1]">
                <StepVisual step={step} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
