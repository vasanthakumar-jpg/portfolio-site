import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { AnimatedCounter } from "./primitives";
import { useAnimationPreferences } from "./preferences";

export default function PortfolioEffects() {
  const { reducedMotion } = useAnimationPreferences();
  const { scrollY, scrollYProgress } = useScroll();
  const [showTop, setShowTop] = useState(false);
  const percent = useTransform(scrollYProgress, v => v * 100);
  const rightRing = useTransform(scrollYProgress, [0, 0.5], [0, 180]);
  const leftRing = useTransform(scrollYProgress, [0.5, 1], [0, 180]);

  useMotionValueEvent(scrollY, "change", value => { if (showTop !== (value > 500)) setShowTop(value > 500); });

  return <>
    <motion.div aria-hidden="true" className="page-scroll-progress" style={{ scaleX: scrollYProgress }} />
    <nav aria-label="Section progress" className="section-progress-rail">
      <motion.span aria-hidden="true" className="section-progress-fill" style={{ scaleY: scrollYProgress }} />
      {[["home", "Home"], ["about", "About"], ["projects", "Projects"], ["experience", "Experience"], ["contact", "Contact"]].map(([id, label]) => <a href={`#${id}`} key={id} aria-label={`Scroll to ${label}`}><span className="progress-section-label">{label}</span><span aria-hidden="true" className="progress-section-dot" /></a>)}
    </nav>
    <AnimatePresence>
      {showTop && <motion.a href="#home" aria-label="Back to top" className="back-to-top"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.75, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}>
        <span aria-hidden="true" className="scroll-ring">
          <span className="scroll-ring-half scroll-ring-right"><motion.span style={{ rotate: rightRing }} /></span>
          <span className="scroll-ring-half scroll-ring-left"><motion.span style={{ rotate: leftRing }} /></span>
        </span>
        <ArrowUp aria-hidden="true" className="h-4 w-4" />
        <span aria-hidden="true" className="scroll-percent"><AnimatedCounter value={percent} suffix="%" /></span>
      </motion.a>}
    </AnimatePresence>
  </>;
}
