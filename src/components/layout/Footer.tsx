import { person } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="container-page flex flex-col gap-3 py-8 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{person.name}, full-stack developer in {person.location}.</p>
        <p>Built with Next.js, GSAP and Lenis.</p>
      </div>
    </footer>
  );
}
