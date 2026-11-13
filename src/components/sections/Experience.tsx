import { SectionHeading } from "@/components/sections/SectionHeading";
import { experience } from "@/content/site";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-rule py-20 md:py-32">
      <div className="container-page">
        <SectionHeading id="experience-title" title="Experience">
          Four years of production work since 2022, from contract builds to leading a team of six.
        </SectionHeading>

        <div data-timeline className="relative mt-14 md:mt-20">
          {/* The rail. Its scrubbed fill draws down as the visitor scrolls. */}
          <div
            className="absolute top-2 bottom-2 left-[0.3125rem] w-px bg-rule md:left-[calc(25%+0.3125rem)]"
            aria-hidden="true"
          >
            <div data-timeline-fill className="h-full w-full origin-top bg-ink/60" />
          </div>

          <ol className="grid gap-12 md:gap-16">
            {experience.map((role) => (
              <li
                key={`${role.title}-${role.start}`}
                data-timeline-item
                className="relative grid gap-3 pl-8 md:grid-cols-4 md:gap-0 md:pl-0"
              >
                <p className="text-small text-muted md:pr-10 md:pt-1 md:text-right">
                  <span className="tabular-nums">
                    {role.start === role.end ? role.start : `${role.start} – ${role.end}`}
                  </span>
                </p>

                <span
                  data-timeline-dot
                  className="absolute top-2 left-0 size-2.5 rounded-full border-2 border-rule bg-bg md:left-[25%]"
                  aria-hidden="true"
                />

                <div className="md:col-span-3 md:pl-10">
                  <h3 className="font-serif text-h3 font-normal md:text-[1.75rem]">
                    {[role.title, role.company].filter(Boolean).join(", ")}
                    {role.current ? (
                      <span className="ml-3 inline-block translate-y-[-0.15em] rounded-full border border-ok px-2.5 py-0.5 align-middle font-sans text-small text-ink">
                        Current
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1 text-small text-muted">
                    {[role.type, role.location].filter(Boolean).join(" · ")}
                  </p>
                  <ul className="mt-4 grid max-w-[68ch] gap-2">
                    {role.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-[0.7em] size-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  {role.link ? (
                    <a href={role.link.href} className="link mt-3 inline-block text-small" target="_blank" rel="noopener noreferrer">
                      {role.link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
