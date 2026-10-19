import { Intro } from "@/components/motion/Intro";
import { PageMotion } from "@/components/motion/PageMotion";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <PageMotion>
      <Intro />
      <Hero />
      <Work />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </PageMotion>
  );
}
