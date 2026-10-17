import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck, Store, ShoppingBag, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketplace, professionalWork, projects } from "@/data/portfolio";
import { MagneticButton, Reveal, SectionHeading, StaggerContainer, StaggerItem, TiltCard } from "./motion/primitives";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAnimationPreferences } from "./motion/preferences";

const roleIcons = [ShieldCheck, Users, Store, ShoppingBag];

const ProjectsSection = () => {
  const { reducedMotion } = useAnimationPreferences();
  return (
  <section id="projects" tabIndex={-1} className="section-padding bg-background">
    <div className="container-custom">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <SectionHeading className="mb-5">Selected Work & Projects</SectionHeading>
        <Reveal as="p" className="text-responsive-lg text-muted-foreground">Marketplace development, Shopify storefronts, and responsive front-end interfaces.</Reveal>
      </div>

      <TiltCard as="article" id="pravokha" scale={0.98} maxTilt={0} lift={4} hoverScale={1.005} className="card-portfolio border border-primary/30 mb-10 overflow-hidden min-w-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="min-w-0">
            <p className="text-primary text-sm font-semibold mb-3">Featured case study · {marketplace.role}</p>
            <h3 className="text-3xl sm:text-4xl font-bold mb-3">{marketplace.title}</h3>
            <p className="font-semibold mb-4">{marketplace.type}</p>
            <p className="text-muted-foreground leading-relaxed mb-6">{marketplace.description}</p>
            <ul className="flex flex-wrap gap-2 mb-6" aria-label="Marketplace management workflows">
              {marketplace.management.map((item) => <li key={item} className="bg-primary/10 rounded-full px-3 py-2 text-sm">{item}</li>)}
            </ul>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{marketplace.approach}</p>
            <MagneticButton><Button asChild className="btn-hero shimmer-button external-cta"><a href={marketplace.liveUrl} target="_blank" rel="noopener noreferrer">Visit PRAVOKHA<ExternalLink aria-hidden="true" className="w-4 h-4 ml-2" /></a></Button></MagneticButton>
          </div>
          <div className="rounded-xl bg-primary/5 p-4 sm:p-6 border border-primary/20 min-w-0">
            <h4 className="font-semibold mb-4">Four roles. Separate dashboards.</h4>
            <ul className="grid grid-cols-2 gap-3">
              {marketplace.roles.map((role, index) => {
                const Icon = roleIcons[index];
                return <TiltCard as="li" key={role} delay={index * 0.1} maxTilt={3} lift={4} className="role-card bg-card rounded-xl p-3 sm:p-4 border shadow-soft min-w-0"><Icon aria-hidden="true" className="w-6 h-6 text-primary mb-3" /><p className="font-semibold text-sm sm:text-base">{role}</p><p className="text-xs text-muted-foreground mt-1">Role-based dashboard</p></TiltCard>;
              })}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground flex items-start gap-2"><ShieldCheck aria-hidden="true" className="w-4 h-4 shrink-0 mt-0.5" />Separate permissions for marketplace operations.</p>
          </div>
        </div>
        <div className="border-t border-border pt-6 mt-8">
          <h4 className="font-semibold mb-4">Customer shopping workflow</h4>
          <div className="workflow-list">
            <motion.span aria-hidden="true" className="workflow-connector" initial={reducedMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.8 }} />
            <StaggerContainer as="ol" className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {marketplace.workflow.map((step, index) => <StaggerItem key={step} className="workflow-step rounded-lg bg-muted p-3 flex items-center justify-between gap-2 text-sm font-medium"><span>{step}</span>{index < marketplace.workflow.length - 1 && <ArrowRight aria-hidden="true" className="w-4 h-4 text-primary shrink-0" />}</StaggerItem>)}
            </StaggerContainer>
          </div>
        </div>
      </TiltCard>

      <Reveal as="article" id="walrus" direction="left" className="card-portfolio border border-secondary/40 mb-14 min-w-0">
        <p className="text-secondary text-sm font-semibold mb-3">Featured professional work · Shopify & E-commerce</p>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3">{professionalWork.title}</h3>
        <p className="font-semibold mb-3">{professionalWork.role}</p>
        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">{professionalWork.description}</p>
        <ul className="flex flex-wrap gap-2 mb-8" aria-label="Walrus technologies">{professionalWork.technologies.map((technology) => <li key={technology} className="skill-chip rounded-full bg-secondary/10 px-3 py-1.5 text-sm">{technology}</li>)}</ul>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {professionalWork.areas.map((area, index) => <Reveal key={area.title} delay={index * 0.1} className="rounded-xl border bg-muted/40 p-4 min-w-0"><h4 className="font-semibold mb-3">{area.title}</h4><StaggerContainer as="ul" className="space-y-2">{area.items.map(item => <StaggerItem key={item} className="text-sm text-muted-foreground flex gap-2"><motion.span aria-hidden="true" variants={{ hidden: { opacity: 0, scale: 0.5, rotate: -20 }, visible: { opacity: 1, scale: 1, rotate: 0 } }}><Check className="w-4 h-4 shrink-0 text-secondary mt-0.5" /></motion.span><span>{item}</span></StaggerItem>)}</StaggerContainer></Reveal>)}
        </div>
      </Reveal>

      <SectionHeading as="h3" className="mb-8">More Front-End Work</SectionHeading>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, index) => <TiltCard as="article" key={project.title} delay={(index % 3) * 0.1} lift={10} hoverScale={1.03} maxTilt={2} className="project-card card-portfolio border min-w-0 flex flex-col">
          <p className="project-top-label text-sm text-primary font-medium mb-3">{project.type}</p>
          <h4 className="text-xl font-bold mb-3">{project.title}</h4>
          <p className="text-sm font-semibold mb-4">{project.role}</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{project.description}</p>
          {project.technologies.length > 0 ? <ul className="flex flex-wrap gap-2 mb-5" aria-label={`${project.title} technologies`}>{project.technologies.map((technology) => <li key={technology} className="skill-chip rounded-full bg-primary/10 px-2.5 py-1 text-xs">{technology}</li>)}</ul> : <p className="text-xs text-muted-foreground mb-5">Technology stack not specified.</p>}
          <StaggerContainer as="ul" className="space-y-2">{project.features.map(feature => <StaggerItem key={feature} className="text-sm text-muted-foreground flex gap-2"><Check aria-hidden="true" className="w-4 h-4 shrink-0 text-primary mt-0.5" /><span>{feature}</span></StaggerItem>)}</StaggerContainer>
          <Dialog>
            <DialogTrigger asChild><button type="button" className="project-detail-hint self-start" aria-label={`View details for ${project.title}`}>View details<ArrowRight aria-hidden="true" /></button></DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto w-[calc(100%-2rem)] rounded-xl">
              <DialogTitle>{project.title}</DialogTitle>
              <DialogDescription>{project.description}</DialogDescription>
              <p className="text-sm font-semibold">{project.type} · {project.role}</p>
              {project.technologies.length > 0 && <p className="text-sm text-muted-foreground">{project.technologies.join(" · ")}</p>}
              <ul className="space-y-2">{project.features.map(feature => <li key={feature} className="flex gap-2 text-sm"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-secondary" />{feature}</li>)}</ul>
            </DialogContent>
          </Dialog>
        </TiltCard>)}
      </div>
    </div>
  </section>
);
};
export default ProjectsSection;
