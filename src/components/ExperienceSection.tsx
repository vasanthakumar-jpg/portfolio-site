import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { MapPin, ChevronRight, GraduationCap } from "lucide-react";
import { experiences, education } from "@/data/portfolio";
import { Reveal, SectionHeading, StaggerContainer, StaggerItem, TiltCard } from "./motion/primitives";
import { useAnimationPreferences } from "./motion/preferences";

const ExperienceSection = () => {
  const timeline = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAnimationPreferences();
  const { scrollYProgress } = useScroll({ target: timeline, offset: ["start 80%", "end 65%"] });
  return <section id="experience" tabIndex={-1} className="section-padding bg-muted/30 ambient-section">
    <div className="container-custom">
      <SectionHeading className="mb-12">Professional Experience</SectionHeading>
      <div ref={timeline} className="experience-timeline relative ml-2 sm:ml-6 mb-16">
        <span aria-hidden="true" className="timeline-track" />
        <motion.span aria-hidden="true" className="timeline-progress" style={{ scaleY: reducedMotion ? 1 : scrollYProgress }} />
        <ol className="space-y-8">
        {experiences.map((experience, index) => (
          <Reveal as="li" key={experience.company} direction={index % 2 === 0 ? "right" : "left"} distance={24} className="experience-scene relative pl-6 sm:pl-10">
            <span aria-hidden="true" className="timeline-dot absolute -left-[9px] top-7 w-4 h-4 rounded-full border-4 border-background" />
            <div className="experience-emphasis">
            <TiltCard as="article" initial={false} maxTilt={1} lift={4} hoverScale={1.005} className="card-portfolio border min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold">{experience.role}</h3>
                  <p className="font-semibold text-primary mt-1">{experience.company}</p>
                </div>
                <Reveal as="p" initial={reducedMotion ? false : { opacity: 0, rotateX: 80 }} whileInView={{ opacity: 1, rotateX: 0 }} delay={0.1} className="date-badge text-sm text-muted-foreground rounded-full bg-muted px-3 py-1">{experience.period}</Reveal>
              </div>
              <p className="flex gap-2 items-center text-sm text-muted-foreground mb-5"><MapPin aria-hidden="true" className="w-4 h-4 shrink-0" />{experience.location}</p>
              <StaggerContainer as="ul" className="space-y-3">
                {experience.bullets.map(bullet => <StaggerItem key={bullet} className="flex gap-2 text-muted-foreground text-sm leading-relaxed"><ChevronRight aria-hidden="true" className="w-4 h-4 text-primary shrink-0 mt-1" /><span>{bullet}</span></StaggerItem>)}
              </StaggerContainer>
            </TiltCard>
            </div>
          </Reveal>
        ))}
        </ol>
      </div>
      <div id="education" className="scroll-mt-24 max-w-3xl mx-auto">
        <SectionHeading className="mb-8">Education</SectionHeading>
        <TiltCard scale={0.97} maxTilt={2} className="card-portfolio border flex items-start gap-4">
          <motion.span aria-hidden="true" className="shrink-0" initial={false} whileInView={reducedMotion ? {} : { y: [0, -12, 0], rotate: [0, -14, 4, 0] }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.9 }}><GraduationCap className="w-8 h-8 text-primary" /></motion.span>
          <div><h3 className="text-lg font-bold mb-2">{education.degree}</h3><p>{education.college}</p><p className="text-muted-foreground mt-1">{education.university} · <span className="date-badge">{education.year}</span></p></div>
        </TiltCard>
      </div>
    </div>
  </section>;
};
export default ExperienceSection;
