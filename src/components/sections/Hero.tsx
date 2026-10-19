import { NavAnchor } from "@/components/layout/NavAnchor";
import { person } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="container-page pt-28 pb-10 sm:pt-36 md:pb-12">
      <h1
        id="hero-name"
        data-hero-name
        data-flip-id="hero-name"
        className="w-fit font-serif text-display font-normal tracking-[-0.03em] [font-variation-settings:'opsz'_72]"
      >
        <span className="block md:inline">{person.firstName}</span>{" "}
        <em className="block italic md:inline">{person.lastName}</em>
      </h1>

      <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
        <p data-hero-reveal="lines" className="max-w-[34ch] text-lead text-ink md:col-span-7">
          {person.headline}
        </p>

        <dl className="flex flex-wrap items-center gap-x-6 gap-y-3 text-small md:col-span-5 md:justify-end">
          <div data-hero-reveal="item">
            <dt className="sr-only">Availability</dt>
            <dd className="inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1.5 font-medium">
              <span data-badge-dot className="relative inline-flex size-2">
                <span data-badge-pulse className="absolute inset-0 rounded-full bg-ok opacity-0" aria-hidden="true" />
                <span className="relative size-2 rounded-full bg-ok" aria-hidden="true" />
              </span>
              {person.availability}
            </dd>
          </div>
          <div data-hero-reveal="item">
            <dt className="sr-only">Location</dt>
            <dd className="text-muted">{person.location}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <NavAnchor href="#work" className="btn btn-primary" data-hero-reveal="item" data-magnetic>
          View work
        </NavAnchor>
        <a
          href={person.resume.href}
          download={person.resume.fileName}
          className="btn"
          data-hero-reveal="item"
          data-magnetic
        >
          Download resume
        </a>
        <NavAnchor href="#contact" className="btn" data-hero-reveal="item" data-magnetic>
          Contact
        </NavAnchor>
      </div>
    </section>
  );
}
