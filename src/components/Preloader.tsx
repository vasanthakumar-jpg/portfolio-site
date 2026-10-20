import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useAnimationPreferences } from "./motion/preferences";
import { usePageLoading } from "./motion/loading-context";
import { motionEase } from "./motion/variants";
import "./Preloader.css";
import { PageCurtain } from "./motion/PageCurtain";

export default function Preloader() {
  const { phase, finishLoading } = usePageLoading();
  const { reducedMotion } = useAnimationPreferences();
  const exiting = phase === "exiting";
  const visible = phase !== "ready";
  const progress = useMotionValue(0);
  const progressScale = useTransform(progress, value => value / 100);
  const percentage = useTransform(progress, value => Math.round(value).toString().padStart(3, "0"));
  const logoRef = useRef<HTMLDivElement>(null);
  const [logoTarget, setLogoTarget] = useState({ x: 0, y: 0, scale: 1 });
  useLayoutEffect(() => {
    if (!exiting || reducedMotion || !logoRef.current) return;
    const target = document.querySelector("header img")?.getBoundingClientRect();
    const source = logoRef.current.getBoundingClientRect();
    if (target && source.width) setLogoTarget({ x: target.left + target.width / 2 - source.left - source.width / 2,
      y: target.top + target.height / 2 - source.top - source.height / 2, scale: target.width / source.width });
  }, [exiting, reducedMotion]);

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

  return <motion.div className={`logo-preloader ${reducedMotion ? "logo-preloader-reduced" : ""}`}
    role="status" aria-live="polite" aria-atomic="true" aria-label="Loading portfolio" data-phase={phase}
    initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: reducedMotion && exiting ? 0 : 1 }}
    transition={{ duration: 0.4, ease: motionEase }}
    onAnimationComplete={() => { if (exiting && reducedMotion) finishLoading(); }}>
    <PageCurtain exiting={exiting} reducedMotion={reducedMotion} onClear={finishLoading} />
    <motion.div aria-hidden="true" className="preloader-glow" initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: exiting ? 0 : 1 }} transition={{ duration: reducedMotion ? 0 : 0.4, ease: motionEase }} />
    <motion.div aria-hidden="true" className="preloader-grain" animate={{ opacity: exiting ? 0 : 0.03 }} transition={{ duration: 0.2 }} />
    <motion.div className="preloader-content" initial={false} animate={{ opacity: exiting && !reducedMotion ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.16, delay: reducedMotion ? 0 : 0.44, ease: motionEase }}>
      <motion.div ref={logoRef} className="preloader-logo-flight" animate={exiting && !reducedMotion ? logoTarget : { x: 0, y: 0, scale: 1 }} transition={{ duration: 0.44, ease: motionEase }}>
      <motion.div className="preloader-logo-float" animate={reducedMotion || exiting ? { y: 0 } : { y: [0, -3, 0] }}
        transition={reducedMotion || exiting ? { duration: 0 } : { duration: 1.2, delay: 1, repeat: Infinity, ease: "easeInOut" }}>
        <motion.img src={import.meta.env.BASE_URL + "logo.png"} alt="Vasanthakumar — Frontend Developer" width={748} height={323}
          {...{ fetchpriority: "high" }} decoding="async" className="preloader-logo" initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.3, ease: motionEase }} />
      </motion.div>
      </motion.div>
      <motion.div aria-hidden="true" className="preloader-indicator" animate={{ opacity: exiting ? 0 : 1 }} transition={{ duration: 0.15 }}>
        <div className="preloader-progress-track"><motion.span className="preloader-progress-fill" style={{ scaleX: progressScale }} /></div>
        <div className="preloader-progress-label"><span>Preparing portfolio</span><span><motion.span data-loading-percentage>{percentage}</motion.span>%</span></div>
      </motion.div>
    </motion.div>
  </motion.div>;
}
