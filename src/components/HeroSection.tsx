import { motion, type MotionProps } from "framer-motion";
import { ArrowRight, Atom, Download, Github, Linkedin, Mail, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/portfolio";
import "./HeroSection.css";
import { useAnimationPreferences } from "./motion/preferences";
import RotatingRole from "./motion/RotatingRole";
import { usePageLoading } from "./motion/loading-context";
import { MagneticButton } from "./motion/primitives";
import WhatsAppIcon from "./WhatsAppIcon";

const easeOut = [0.22, 1, 0.36, 1] as const;

const HeroSection = () => {
  const { reducedMotion: shouldReduceMotion } = useAnimationPreferences();
  const { heroReady } = usePageLoading();

  const reveal = (distance: number, order: number): MotionProps => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    animate: heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: distance },
    transition: { duration: shouldReduceMotion ? 0 : 0.58, delay: shouldReduceMotion ? 0 : order * 0.08, ease: easeOut },
  });

  const socials = [
    { icon: Github, label: "Visit GitHub profile", href: profile.github },
    { icon: Linkedin, label: "Visit LinkedIn profile", href: profile.linkedin },
    { icon: Mail, label: "Email " + profile.name, href: "mailto:" + profile.email },
    { icon: WhatsAppIcon, label: "Direct Message", href: profile.whatsapp }
  ];

  return (
    <section id="home" tabIndex={-1} className="hero-premium section-padding" data-motion={shouldReduceMotion ? "reduced" : "full"} data-cursor-glow="off" data-hero-ready={heroReady}>
      <div aria-hidden="true" className="hero-scroll-tint" />
      <div aria-hidden="true" className="hero-copy-scrim absolute inset-0" />
      <div className="container-custom relative z-10">
        <div className="hero-grid">
          <div className="hero-scroll-copy"><div className="hero-copy">
            <motion.p {...reveal(12, 0)} data-hero-reveal className="hero-eyebrow">Hello, I'm</motion.p>
            <motion.h1 {...reveal(18, 1)} data-hero-reveal className="hero-name" aria-label={profile.name}>
              {profile.name.split(" ").map((word, index, words) => <span key={word}><span className="hero-word-mask"><motion.span className="hero-word" data-word={word}
                initial={shouldReduceMotion ? false : { y: "110%" }} animate={{ y: heroReady ? 0 : "110%" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.65, delay: shouldReduceMotion ? 0 : 0.12 + index * 0.1, ease: easeOut }}>{word}</motion.span></span>{index < words.length - 1 ? " " : ""}</span>)}
            </motion.h1>
            <motion.p {...reveal(14, 2)} data-hero-reveal className="hero-role"><RotatingRole headline={profile.headline} /></motion.p>
            <motion.p {...reveal(12, 3)} data-hero-reveal className="hero-description">{profile.summary}</motion.p>
            <motion.div {...reveal(10, 4)} data-hero-reveal className="hero-actions">
              <MagneticButton introDelay={0.4}><Button asChild className="hero-action hero-action-primary bg-white text-primary hover:bg-white">
                <a href="#projects">View Projects<ArrowRight aria-hidden="true" className="hero-action-arrow" /></a>
              </Button></MagneticButton>
              <MagneticButton introDelay={0.48}><Button asChild variant="outline" className="hero-action hero-action-secondary shimmer-button bg-transparent text-white hover:bg-white/10 hover:text-white">
                <a href={import.meta.env.BASE_URL + profile.resumePath} download={profile.resumePath}>
                  <Download aria-hidden="true" />Download Resume
                </a>
              </Button></MagneticButton>
              <MagneticButton introDelay={0.56}><Button asChild variant="ghost" className="hero-action hero-action-contact text-white hover:bg-white/10 hover:text-white">
                <a href="#contact">Contact Me<ArrowRight aria-hidden="true" className="hero-action-arrow" /></a>
              </Button></MagneticButton>
            </motion.div>
            <motion.div {...reveal(8, 5)} data-hero-reveal className="hero-socials">
              <span className="text-sm text-white/90">Find me online</span>
              <div className="flex items-center gap-3">
                {socials.map((social, index) => (
                  <motion.a key={social.label} href={social.href} aria-label={social.label}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }} animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.45 + index * 0.08, duration: shouldReduceMotion ? 0 : 0.4 }}
                    target={social.href.startsWith("https:") ? "_blank" : undefined}
                    rel={social.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                    className="hero-social">
                    <social.icon aria-hidden="true" className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div></div>

          <div className="hero-scroll-portrait">
          <motion.div className="hero-portrait-stage" data-hero-reveal
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, rotate: -0.5 }}
            animate={heroReady ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.96, rotate: -0.5 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : 0.56, ease: easeOut }}
            data-parallax="enabled">
            <div className="hero-photo-depth"><div className="hero-portrait-offset">
              <motion.div className="hero-portrait-frame" initial={shouldReduceMotion ? false : { clipPath: "inset(100% 0% 0% 0% round 24px)" }}
                animate={{ clipPath: heroReady || shouldReduceMotion ? "inset(0% 0% 0% 0% round 24px)" : "inset(100% 0% 0% 0% round 24px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : 0.25, ease: easeOut }}>
                <motion.img src={import.meta.env.BASE_URL + "images/vasanthakumar-profile.jpg"}
                  alt="Vasanthakumar Rajendran - Front-End Developer" width={1309} height={1202}
                  fetchPriority="high" decoding="async" className="hero-portrait" initial={shouldReduceMotion ? false : { scale: 1.04 }} animate={{ scale: heroReady ? 1 : 1.04 }} transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : 0.25, ease: easeOut }} />
              </motion.div>
              <div className="hero-badge-layer">
                <div className="hero-chip-react"><div className="hero-identity hero-identity-react"><Atom aria-hidden="true" /><span>React</span></div></div>
                <div className="hero-chip-shopify"><div className="hero-identity hero-identity-shopify"><ShoppingBag aria-hidden="true" /><span>Shopify</span></div></div>
              </div>
            </div></div>
          </motion.div>
          </div>
        </div>
        <a href="#about" className="hero-scroll" aria-label="Scroll to About Me">
          <span className="hero-scroll-track"><span className="hero-scroll-wheel" /></span>
          <span>Scroll to explore</span>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
