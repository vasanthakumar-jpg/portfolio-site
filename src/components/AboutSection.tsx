import { profile, skillGroups } from "@/data/portfolio";
import { Reveal, SectionHeading, StaggerContainer, StaggerItem, TiltCard } from "./motion/primitives";
import { Marquee, SectionDivider, SplitText } from "./motion/cinematic";

const AboutSection = () => (
  <section id="about" tabIndex={-1} className="section-padding bg-background ambient-section">
    <SectionDivider />
    <div className="container-custom">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <SectionHeading className="mb-6">About Me</SectionHeading>
        <p className="text-responsive-lg text-muted-foreground leading-relaxed mb-5"><SplitText text={profile.summary} highlight /></p>
        <Reveal as="p" delay={0.16} className="text-muted-foreground leading-relaxed">{profile.current}</Reveal>
      </div>
      <div id="skills" className="scroll-mt-24">
        <SectionHeading as="h3" className="mb-8">Skills & Expertise</SectionHeading>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, index) => (
            <div key={group.title} className="skill-scene"><TiltCard initial={false} maxTilt={3} className="card-portfolio border min-w-0 skill-card h-full">
              <h4 className="text-lg font-semibold mb-4 text-primary">{group.title}</h4>
              <StaggerContainer as="ul" className="flex flex-wrap gap-2" aria-label={group.title + " skills"}>
                {group.items.map(skill => <StaggerItem key={skill} className="skill-chip rounded-full bg-primary/10 text-foreground px-3 py-1.5 text-sm">{skill}</StaggerItem>)}
              </StaggerContainer>
            </TiltCard></div>
          ))}
          <div aria-hidden="true" className="skill-scene learning-card"><span className="learning-orbit" /><span>Always learning</span><span className="learning-spark">✦</span></div>
        </div>
      </div>
      <Marquee />
    </div>
  </section>
);
export default AboutSection;
