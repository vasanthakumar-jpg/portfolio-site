import { motion } from "framer-motion";
import { motionEase } from "./variants";

/** Reuses the loader's original panels, duration and completion contract. */
export function PageCurtain({ exiting, reducedMotion, onClear }: { exiting: boolean; reducedMotion: boolean; onClear: () => void }) {
  const transition = { duration: reducedMotion ? 0 : 0.53, delay: reducedMotion ? 0 : 0.12, ease: motionEase };
  return <>
    <motion.div aria-hidden="true" className="preloader-curtain preloader-curtain-left" initial={false}
      animate={{ x: exiting && !reducedMotion ? "-101%" : "0%" }} transition={transition} />
    <motion.div aria-hidden="true" className="preloader-curtain preloader-curtain-right" initial={false}
      animate={{ x: exiting && !reducedMotion ? "101%" : "0%" }} transition={transition}
      onAnimationComplete={() => { if (exiting && !reducedMotion) onClear(); }} />
  </>;
}
