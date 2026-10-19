import { SectionHeading } from "@/components/sections/SectionHeading";
import { about } from "@/content/site";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-rule py-20 md:py-32">
      <div className="container-page">
        <SectionHeading id="about-title" title="About" />

        <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p data-split="lines" className="max-w-[30ch] font-serif text-lead md:text-[2rem] md:leading-snug">
              {about.lead}
            </p>
            <div className="mt-8 grid max-w-[62ch] gap-5">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} data-split="lines">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-10 md:col-span-4 md:col-start-9">
            <div>
              <h3 className="text-small font-semibold text-muted">Education</h3>
              <p className="mt-3 font-medium">{about.education.degree}</p>
              <p className="text-muted">{about.education.school}</p>
              <p className="text-small text-muted">
                {about.education.place} · {about.education.years}
              </p>
            </div>
            <div>
              <h3 className="text-small font-semibold text-muted">Certifications</h3>
              <ul className="mt-3 grid gap-3">
                {about.certifications.map((cert) => (
                  <li key={cert.href}>
                    <a href={cert.href} className="link font-medium" target="_blank" rel="noopener noreferrer">
                      {cert.name}
                      <span className="sr-only"> (certificate, opens in a new tab)</span>
                    </a>
                    <p className="text-small text-muted">
                      {cert.issuer} · {cert.year}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
