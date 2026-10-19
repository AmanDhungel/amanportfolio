import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/sections/SectionHeading";
import { Walkthrough } from "@/components/sections/Walkthrough";
import { featured, otherWork } from "@/content/site";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="pt-12 pb-20 md:pt-16 md:pb-32">
      <div className="container-page">
        <SectionHeading id="work-title" title="Selected work">
          Three projects, with the problem, what I built, and how it holds up in production.
        </SectionHeading>

        <div data-work-index className="relative mt-14 md:mt-20">
          <ul className="border-b border-rule">
            {featured.map((project, index) => (
              <li
                key={project.slug}
                data-work-row
                data-preview-index={index}
                className="group relative border-t border-rule py-7 md:py-10"
              >
                <div className="grid gap-3 md:grid-cols-12 md:items-baseline md:gap-6">
                  <h3 className="font-serif text-index font-normal tracking-[-0.03em] md:col-span-8">
                    <Link
                      href={`/work/${project.slug}`}
                      className="transition-colors duration-300 after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="text-small text-muted md:col-span-4 md:text-right">
                    {project.role.split(",")[0]} · {project.year}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-12 md:gap-6">
                  <p className="max-w-[56ch] md:col-span-8">{project.summary}</p>
                  <p className="relative z-10 flex flex-wrap gap-x-5 gap-y-1 text-small md:col-span-4 md:justify-end">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} className="link" target="_blank" rel="noopener noreferrer">
                        {link.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </p>
                </div>
                <figure className="work-row-shot mt-7 overflow-hidden rounded-md border border-rule">
                  <div data-reveal="clip" className="overflow-hidden">
                    <Image
                      src={project.shot.src}
                      alt={project.shot.alt}
                      placeholder="blur"
                      sizes="(min-width: 1440px) 1340px, 94vw"
                      className="h-auto w-full"
                      data-parallax
                    />
                  </div>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Walkthrough />

      <div className="container-page mt-24 md:mt-32">
        <h3 data-split="chars" className="font-serif text-h3 font-normal md:text-[2rem]">
          Other work
        </h3>
        <ul data-batch-list className="mt-8 border-b border-rule">
          {otherWork.map((project) => (
            <li
              key={project.name}
              data-batch-item
              className="grid gap-2 border-t border-rule py-5 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <p className="font-medium md:col-span-3">{project.name}</p>
              <p className="text-muted md:col-span-5">{project.description}</p>
              <p className="text-small text-muted md:col-span-2">
                {project.role} · {project.year}
              </p>
              <p className="text-small md:col-span-2 md:text-right">
                {project.link ? (
                  <a href={project.link.href} className="link" target="_blank" rel="noopener noreferrer">
                    {project.link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="text-muted">No public link</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
