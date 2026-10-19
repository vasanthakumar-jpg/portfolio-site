import { Award, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { certifications, achievements } from "@/data/portfolio";
import { Reveal, SectionHeading, TiltCard } from "./motion/primitives";
import { ModalExpand } from "./motion/ModalExpand";
import { useAnimationPreferences } from "./motion/preferences";

const CourseSection = () => {
  const { reducedMotion } = useAnimationPreferences();
  return (
  <section id="course" tabIndex={-1} className="section-padding bg-background">
    <div className="container-custom">
      <SectionHeading className="mb-12">Certifications</SectionHeading>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {certifications.map((certificate, index) => (
          <div key={certificate.title} className="certificate-scene"><TiltCard as="article" initial={false} layoutId={reducedMotion ? undefined : `certificate-${index}`} maxTilt={2} className="certificate-card card-portfolio border flex flex-col min-w-0 h-full">
            <div className="flex items-center gap-3 text-primary mb-4"><Award aria-hidden="true" className="certificate-icon w-7 h-7" /><Reveal as="span" scale={0.94} className="date-badge text-sm font-semibold">{certificate.year}</Reveal></div>
            <h3 className="text-xl font-bold mb-2">{certificate.issuer} — {certificate.title}</h3>
            <p className="text-muted-foreground mb-6">{certificate.level}</p>
            <ModalExpand id={`certificate-${index}`} className="certificate-expand" trigger={<Button type="button" className="btn-hero shimmer-button mt-auto w-full">View Certificate<ArrowUpRight aria-hidden="true" className="w-4 h-4" /></Button>}>
                <DialogTitle className="sr-only">{certificate.issuer} — {certificate.title} certificate</DialogTitle>
                <DialogDescription className="sr-only">{certificate.level}, {certificate.year}.</DialogDescription>
                <img src={import.meta.env.BASE_URL + certificate.image} alt={certificate.issuer + " " + certificate.title + " certificate"} width={certificate.width} height={certificate.height} decoding="async" loading="lazy" onLoad={e => e.currentTarget.classList.add("image-reveal")} className="w-full max-h-[calc(100dvh-6rem)] object-contain rounded" />
            </ModalExpand>
          </TiltCard></div>
        ))}
      </div>
      <div id="achievements" className="scroll-mt-24">
        <SectionHeading className="mb-8">Professional Recognition</SectionHeading>
        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => <TiltCard key={achievement} direction={index === 0 ? "left" : "right"} maxTilt={2} className="card-portfolio border flex gap-3 draw-checks"><Reveal as="span" scale={0.6} className="shrink-0"><CheckCircle2 aria-hidden="true" className="w-6 h-6 text-secondary" /></Reveal><p className="text-muted-foreground leading-relaxed">{achievement}</p></TiltCard>)}
        </div>
      </div>
    </div>
  </section>
); };
export default CourseSection;
