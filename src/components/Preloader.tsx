import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useAnimationPreferences } from "./motion/preferences";
import { usePageLoading } from "./motion/loading-context";
import { motionEase } from "./motion/variants";
import "./Preloader.css";

export default function Preloader() {
  const { phase, finishLoading } = usePageLoading();
  const { reducedMotion } = useAnimationPreferences();
  const exiting = phase === "exiting";
  const visible = phase !== "ready";
  const progress = useMotionValue(0);
  const progressScale = useTransform(progress, value => value / 100);
  const percentage = useTransform(progress, value => Math.round(value).toString().padStart(3, "0"));

  useEffect(() => {
    if (!visible) return;
    const controls = animate(progress, exiting || reducedMotion ? 100 : 90, {
      duration: reducedMotion ? 0 : exiting ? 0.12 : 2.2,
      ease: motionEase,
    });
    return () => controls.stop();
  }, [visible, exiting, reducedMotion, progress]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    const rootGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      document.documentElement.style.scrollbarGutter = rootGutter;
    };
  }, [visible, reducedMotion]);

  if (!visible) return null;

  const panelTransition = { duration: reducedMotion ? 0 : 0.53, delay: reducedMotion ? 0 : 0.12, ease: motionEase };
  return <motion.div className={`logo-preloader ${reducedMotion ? "logo-preloader-reduced" : ""}`}
    role="status" aria-live="polite" aria-atomic="true" aria-label="Loading portfolio" data-phase={phase}
    initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: reducedMotion && exiting ? 0 : 1 }}
    transition={{ duration: 0.4, ease: motionEase }}
    onAnimationComplete={() => { if (exiting && reducedMotion) finishLoading(); }}>
    <motion.div aria-hidden="true" className="preloader-curtain preloader-curtain-left" initial={false}
      animate={{ x: exiting && !reducedMotion ? "-101%" : "0%" }} transition={panelTransition} />
    <motion.div aria-hidden="true" className="preloader-curtain preloader-curtain-right" initial={false}
      animate={{ x: exiting && !reducedMotion ? "101%" : "0%" }} transition={panelTransition}
      onAnimationComplete={() => { if (exiting && !reducedMotion) finishLoading(); }} />
    <motion.div aria-hidden="true" className="preloader-glow" initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: exiting ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.4, ease: motionEase }} />
    <motion.div aria-hidden="true" className="preloader-grain" animate={{ opacity: exiting ? 0 : 0.03 }} transition={{ duration: 0.2 }} />
    <motion.div className="preloader-content" initial={false} animate={{ opacity: exiting && !reducedMotion ? 0 : 1, scale: exiting && !reducedMotion ? 0.92 : 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : 0.15, ease: motionEase }}>
      <motion.div className="preloader-logo-float" animate={reducedMotion || exiting ? { y: 0 } : { y: [0, -3, 0] }}
        transition={reducedMotion || exiting ? { duration: 0 } : { duration: 1.2, delay: 1, repeat: Infinity, ease: "easeInOut" }}>
        <motion.img src={import.meta.env.BASE_URL + "logo.png"} alt="Vasanthakumar — Frontend Developer" width={748} height={323}
          fetchPriority="high" decoding="async" className="preloader-logo" initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.3, ease: motionEase }} />
      </motion.div>
      <div aria-hidden="true" className="preloader-indicator">
        <div className="preloader-progress-track"><motion.span className="preloader-progress-fill" style={{ scaleX: progressScale }} /></div>
        <div className="preloader-progress-label"><span>Preparing portfolio</span><span><motion.span data-loading-percentage>{percentage}</motion.span>%</span></div>
      </div>
    </motion.div>
  </motion.div>;
}
