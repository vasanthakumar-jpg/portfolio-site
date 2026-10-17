import type { Variants } from "framer-motion";

export const motionEase = [0.22, 1, 0.36, 1] as const;
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: motionEase } },
};
