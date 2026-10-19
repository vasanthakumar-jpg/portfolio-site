import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useAnimationPreferences } from "./preferences";
import { usePageLoading } from "./loading-context";
const roles = ["Front-End Developer", "React Developer", "Shopify Developer", "E-commerce Specialist"];

export default function RotatingRole({ headline }: { headline: string }) {
  const { reducedMotion } = useAnimationPreferences();
  const { heroReady } = usePageLoading();
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion || !visible || !heroReady) return;
    const timer = window.setInterval(() => { if (!document.hidden) setIndex(i => (i + 1) % roles.length); }, 5000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible, heroReady]);
  if (reducedMotion) return <>{headline}</>;
  return <>
    <span className="sr-only">{headline}</span>
    <span aria-hidden="true"><span ref={ref} className="role-rotator">
      <span className="role-measure">E-commerce Specialist</span>
      <AnimatePresence initial={false} mode="sync"><motion.span key={index} className="role-word"
        initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={{ opacity: 1, clipPath: heroReady ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }} exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.6, ease: "easeOut" }}>{roles[index]}</motion.span></AnimatePresence>
    </span> | React • Shopify • E-commerce</span>
  </>;
}
