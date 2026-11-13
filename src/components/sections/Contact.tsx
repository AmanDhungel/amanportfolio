import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmailButton } from "@/components/contact/CopyEmailButton";
import { person } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-rule py-20 md:py-32">
      <div className="container-page">
        <h2
          id="contact-title"
          data-split="chars"
          className="max-w-[20ch] font-serif text-h2 font-normal tracking-[-0.02em] md:text-[clamp(3rem,6vw,5.5rem)]"
        >
          Hiring a full-stack developer?
        </h2>
        <p data-split="lines" className="mt-5 max-w-[52ch] text-lead text-muted">
          I am open to remote contract and full-time roles. Email is quickest, or send a message with the form.
        </p>

        <div className="mt-12 grid gap-16 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="min-w-0 md:col-span-7">
            <a
              href={`mailto:${person.email}`}
              className="link inline-block font-serif text-[clamp(1.5rem,3.6vw,3rem)] leading-tight [overflow-wrap:anywhere]"
            >
              {person.email.split("@")[0]}
              <wbr />@{person.email.split("@")[1]}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <CopyEmailButton email={person.email} />
              <a href={person.resume.href} download={person.resume.fileName} className="btn" data-magnetic>
                Download resume
              </a>
            </div>

            <dl className="mt-12 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-small text-muted">Phone</dt>
                <dd className="mt-1">
                  <a href={person.phone.href} className="link tabular-nums">
                    {person.phone.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-small text-muted">Based in</dt>
                <dd className="mt-1">{person.location}</dd>
              </div>
              <div>
                <dt className="text-small text-muted">GitHub</dt>
                <dd className="mt-1">
                  <a href={person.github} className="link" target="_blank" rel="noopener noreferrer">
                    github.com/AmanDhungel<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-small text-muted">LinkedIn</dt>
                <dd className="mt-1">
                  <a href={person.linkedin} className="link" target="_blank" rel="noopener noreferrer">
                    in/aman-dhungel<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative min-w-0 md:col-span-5 md:col-start-8">
            <h3 className="font-serif text-h3 font-normal">Send a message</h3>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
