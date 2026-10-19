import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { featured, type Qualities } from "@/content/site";

export function generateStaticParams() {
  return featured.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = featured.find((item) => item.slug === slug);
  if (!project) return {};
  const path = `/work/${project.slug}`;
  return {
    title: `${project.name} case study`,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: { url: path, title: `${project.name} case study`, description: project.summary },
  };
}

const qualityLabels: { key: keyof Qualities; label: string }[] = [
  { key: "faster", label: "Faster" },
  { key: "safer", label: "Safer" },
  { key: "reliable", label: "More reliable" },
];

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = featured.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const project = featured[index];
  const next = featured[(index + 1) % featured.length];

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <article>
        <header className="container-page pt-32 pb-12 sm:pt-40">
          <Link href="/#work" className="link text-small">
            All work
          </Link>
          <h1
            data-split="chars"
            className="mt-8 max-w-[18ch] font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] font-normal tracking-[-0.03em]"
          >
            {project.name}
          </h1>
          <p data-split="lines" className="mt-6 max-w-[48ch] text-lead">
            {project.summary}
          </p>

          <dl className="mt-12 grid gap-6 border-t border-rule pt-6 text-small sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted">Client</dt>
              <dd className="mt-1 font-medium">{project.client}</dd>
            </div>
            <div>
              <dt className="text-muted">My role</dt>
              <dd className="mt-1 font-medium">{project.role}</dd>
            </div>
            <div>
              <dt className="text-muted">When</dt>
              <dd className="mt-1 font-medium">{project.period}</dd>
            </div>
            <div>
              <dt className="text-muted">Links</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-medium">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} className="link" target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        <figure className="container-page">
          <div data-reveal="clip" className="overflow-hidden rounded-lg border border-rule">
            <Image
              src={project.shot.src}
              alt={project.shot.alt}
              placeholder="blur"
              priority
              sizes="(min-width: 1440px) 1340px, 94vw"
              className="h-auto w-full"
              data-parallax
            />
          </div>
          <figcaption className="mt-3 text-small text-muted">Live site, captured October 2026.</figcaption>
        </figure>

        <div className="container-page grid gap-16 py-20 md:grid-cols-12 md:gap-10 md:py-28">
          <section aria-labelledby="problem" className="md:col-span-4">
            <h2 id="problem" className="font-serif text-h3 font-normal md:text-[2rem]">
              The problem
            </h2>
            <p data-split="lines" className="mt-4">
              {project.problem}
            </p>
          </section>
          <section aria-labelledby="built" className="md:col-span-7 md:col-start-6">
            <h2 id="built" className="font-serif text-h3 font-normal md:text-[2rem]">
              What I built
            </h2>
            <ul data-batch-list className="mt-4 grid gap-3">
              {project.built.map((item) => (
                <li key={item} data-batch-item className="flex gap-3 border-t border-rule pt-3">
                  <span className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {project.qualities ? (
          <section aria-labelledby="holds-up" className="border-t border-rule">
            <div className="container-page py-20 md:py-28">
              <h2 id="holds-up" data-split="chars" className="font-serif text-h2 font-normal tracking-[-0.02em]">
                How it holds up
              </h2>
              <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
                {qualityLabels.map(({ key, label }) => {
                  const items = project.qualities?.[key];
                  if (!items?.length) return null;
                  return (
                    <div key={key}>
                      <h3 className="border-b border-rule pb-3 font-serif text-h3 font-normal">{label}</h3>
                      <ul className="mt-4 grid gap-3">
                        {items.map((item) => (
                          <li key={item} data-split="lines">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="outcome" className="border-t border-rule">
          <div className="container-page grid gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-28">
            <div className="md:col-span-7">
              <h2 id="outcome" className="font-serif text-h3 font-normal md:text-[2rem]">
                Outcome
              </h2>
              <p data-split="lines" className="mt-4 max-w-[52ch] text-lead">
                {project.outcome}
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <h2 className="text-small font-semibold text-muted">Stack</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} data-skill-chip className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </article>

      <nav aria-label="Next case study" className="border-t border-rule">
        <div className="container-page py-16 md:py-24">
          <p className="text-small text-muted">Next case study</p>
          <Link
            href={`/work/${next.slug}`}
            className="mt-3 inline-block font-serif text-index tracking-[-0.03em] transition-colors hover:text-accent"
          >
            {next.name}
          </Link>
        </div>
      </nav>
    </main>
  );
}
