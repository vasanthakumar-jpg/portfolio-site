import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AnimationContext } from "./preferences";

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(() => ({
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    finePointer: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  }));

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setPreferences({ reducedMotion: reduced.matches, finePointer: pointer.matches });
    reduced.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
    };
  }, []);

  return <AnimationContext.Provider value={preferences}>
    <MotionConfig reducedMotion={preferences.reducedMotion ? "always" : "never"}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>{children}</MotionConfig>
  </AnimationContext.Provider>;
}
