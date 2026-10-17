import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { AnimatedCounter } from "./primitives";
import { useAnimationPreferences } from "./preferences";

export default function PortfolioEffects() {
  const { reducedMotion, finePointer } = useAnimationPreferences();
  const { scrollY, scrollYProgress } = useScroll();
  const [showTop, setShowTop] = useState(false);
  const x = useMotionValue(-400), y = useMotionValue(-400), glowOpacity = useMotionValue(0), glowScale = useMotionValue(1);
  const cursorX = useSpring(x, { stiffness: 85, damping: 25 });
  const cursorY = useSpring(y, { stiffness: 85, damping: 25 });
  const percent = useTransform(scrollYProgress, v => v * 100);
  const rightRing = useTransform(scrollYProgress, [0, 0.5], [0, 180]);
  const leftRing = useTransform(scrollYProgress, [0.5, 1], [0, 180]);

  useMotionValueEvent(scrollY, "change", value => { if (showTop !== (value > 500)) setShowTop(value > 500); });

  useEffect(() => {
    if (!finePointer || reducedMotion) { glowOpacity.set(0); return; }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (e.target instanceof Element && e.target.closest('[data-cursor-glow="off"]')) {
        glowOpacity.set(0);
        return;
      }
      x.set(e.clientX - 150); y.set(e.clientY - 150); glowOpacity.set(1);
    };
    const over = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-cursor-glow="off"]')) {
        glowOpacity.set(0);
        return;
      }
      glowScale.set(e.target instanceof Element && e.target.closest("a,button,input,textarea") ? 1.18 : 1);
    };
    const leave = () => glowOpacity.set(0);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave); window.removeEventListener("blur", leave);
    };
  }, [finePointer, reducedMotion, x, y, glowOpacity, glowScale]);

  return <>
    <motion.div aria-hidden="true" className="page-scroll-progress" style={{ scaleX: scrollYProgress }} />
    <div aria-hidden="true" className="page-grain" />
    {finePointer && !reducedMotion && <motion.div aria-hidden="true" className="cursor-glow"
      style={{ x: cursorX, y: cursorY, opacity: glowOpacity, scale: glowScale }} />}
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
