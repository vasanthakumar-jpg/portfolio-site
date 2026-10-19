import { Code2, ShoppingBag, PanelsTopLeft, SearchCheck, Wallet } from "lucide-react";
import { capabilities } from "@/data/portfolio";
import { SectionHeading, TiltCard } from "./motion/primitives";
import { PinnedSection } from "./motion/cinematic";

const icons = [Code2, ShoppingBag, PanelsTopLeft, SearchCheck, Wallet];
const ServicesSection = () => (
  <section id="services" tabIndex={-1} className="section-padding bg-muted/30">
    <PinnedSection scene="services" className="container-custom">
      <SectionHeading className="mb-12">What I Do</SectionHeading>
      <div className="service-scenes grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {capabilities.map((capability, index) => {
          const Icon = icons[index];
          return <div key={capability.title} className="service-scene"><TiltCard as="article" delay={index * 0.1} maxTilt={6} className="card-portfolio service-card border min-w-0 h-full">
            <div className="service-icon w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5"><Icon aria-hidden="true" className="w-6 h-6 text-primary" /></div>
            <h3 className="text-lg font-bold mb-3">{capability.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{capability.description}</p>
          </TiltCard></div>;
        })}
      </div>
    </PinnedSection>
  </section>
);
export default ServicesSection;
