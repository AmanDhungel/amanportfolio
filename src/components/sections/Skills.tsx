import { SectionHeading } from "@/components/sections/SectionHeading";
import { skills } from "@/content/site";

export function Skills() {
  return (
    <section aria-labelledby="skills-title" className="border-t border-rule py-20 md:py-32">
      <div className="container-page">
        <SectionHeading id="skills-title" title="Skills">
          The tools I use day to day, grouped the way I use them.
        </SectionHeading>

        <div className="mt-14 grid gap-x-12 gap-y-12 md:mt-20 md:grid-cols-2">
          {skills.map((group) => (
            <div key={group.group} data-skill-group>
              <h3 className="border-b border-rule pb-3 font-serif text-h3 font-normal">{group.group}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} data-skill-chip className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
