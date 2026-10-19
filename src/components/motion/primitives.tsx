import { useEffect, useRef, useState, type ReactNode, type DOMAttributes } from "react";
import {
  motion, useMotionValue, useSpring, useTransform, isMotionValue,
  type HTMLMotionProps, type MotionValue, type MotionProps,
} from "framer-motion";
import { useAnimationPreferences } from "./preferences";
import { motionEase, itemVariants } from "./variants";
import { SplitText } from "./cinematic";
import { cinema } from "./settings";
import { usePageLoading } from "./loading-context";
type Tag = "div" | "article" | "li" | "ul" | "ol" | "p" | "span";
type RevealProps = Omit<HTMLMotionProps<"div">, "ref" | "children" | keyof DOMAttributes<HTMLDivElement>>
  & Omit<DOMAttributes<HTMLElement>, keyof MotionProps | "children">
  & Omit<MotionProps, "children"> & {
  children?: ReactNode;
  as?: Tag; delay?: number; direction?: "up" | "left" | "right"; distance?: number; scale?: number;
};

export function Reveal({ as = "div", delay = 0, direction = "up", distance = cinema.distance, scale = 1, children, ...props }: RevealProps) {
  const { reducedMotion } = useAnimationPreferences();
  const Tag = motion[as];
  return <Tag data-motion-reveal initial={reducedMotion ? false : {
    opacity: 0, x: direction === "left" ? -distance : direction === "right" ? distance : 0,
    y: direction === "up" ? distance : 0, scale,
  }} whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: reducedMotion ? 0.15 : cinema.reveal, delay: reducedMotion ? 0 : delay, ease: motionEase }} {...props}>{children}</Tag>;
}

export function StaggerContainer({ as = "div", children, ...props }: Omit<RevealProps, "direction" | "distance" | "scale" | "delay">) {
  const Tag = motion[as];
  const { reducedMotion } = useAnimationPreferences();
  return <Tag data-motion-reveal initial={reducedMotion ? false : "hidden"} whileInView="visible"
    viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.1 } } }} {...props}>{children}</Tag>;
}

export function StaggerItem({ as = "li", children, ...props }: Omit<RevealProps, "direction" | "distance" | "scale" | "delay">) {
  const Tag = motion[as];
  return <Tag data-motion-reveal variants={itemVariants} {...props}>{children}</Tag>;
}

type TiltCardProps = RevealProps & { maxTilt?: number; lift?: number; hoverScale?: number };
export function TiltCard({ as = "div", maxTilt = 2, lift = 3, hoverScale = 1.008, className = "", children, style, ...props }: TiltCardProps) {
  const { reducedMotion, finePointer } = useAnimationPreferences();
  const enabled = finePointer && !reducedMotion && window.innerWidth >= 768;
  const rotateX = useMotionValue(0), rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 120, damping: 25 });
  const smoothY = useSpring(rotateY, { stiffness: 120, damping: 25 });
  const bounds = useRef<DOMRect | null>(null);
  const reset = () => { rotateX.set(0); rotateY.set(0); bounds.current = null; };
  useEffect(() => { if (!enabled) { rotateX.set(0); rotateY.set(0); } }, [enabled, rotateX, rotateY]);
  return <Reveal as={as} className={`tilt-card ${className}`} style={{ ...style, rotateX: enabled ? smoothX : 0, rotateY: enabled ? smoothY : 0, transformPerspective: 1000 }}
    whileHover={enabled ? { y: -Math.min(lift, 3), scale: Math.min(hoverScale, 1.008), transition: { duration: 0.25, ease: motionEase } } : undefined}
    onPointerEnter={e => { if (enabled && e.pointerType === "mouse") bounds.current = e.currentTarget.getBoundingClientRect(); }}
    onPointerMove={e => {
      if (!enabled || e.pointerType !== "mouse") return;
      const rect = bounds.current ?? e.currentTarget.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      rotateX.set((0.5 - py) * Math.min(maxTilt, 2) * 2); rotateY.set((px - 0.5) * Math.min(maxTilt, 2) * 2);
    }} onPointerLeave={reset} onPointerCancel={reset} {...props}>
    {children}
  </Reveal>;
}

export function MagneticButton({ children, className = "", introDelay }: { children: ReactNode; className?: string; introDelay?: number }) {
  const { reducedMotion, finePointer } = useAnimationPreferences();
  const { heroReady } = usePageLoading();
  const enabled = finePointer && !reducedMotion && window.innerWidth >= 768;
  const x = useMotionValue(0), y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 160, damping: 22 }), smoothY = useSpring(y, { stiffness: 160, damping: 22 });
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  useEffect(() => { if (!enabled) { x.set(0); y.set(0); } }, [enabled, x, y]);
  return <motion.span className={`magnetic-control ${className}`} style={{ x: enabled ? smoothX : 0, y: enabled ? smoothY : 0 }}
    initial={introDelay !== undefined && !reducedMotion ? { opacity: 0, scale: 0.98 } : false}
    animate={introDelay !== undefined ? { opacity: heroReady ? 1 : 0, scale: heroReady ? 1 : 0.98 } : undefined}
    transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : introDelay ?? 0, ease: motionEase }}
    onPointerEnter={e => { bounds.current = e.currentTarget.getBoundingClientRect(); }}
    onPointerMove={e => {
      if (!enabled || e.pointerType !== "mouse") return;
      const rect = bounds.current ?? e.currentTarget.getBoundingClientRect();
      x.set(Math.max(-2, Math.min(2, (e.clientX - rect.left - rect.width / 2) * 0.04)));
      y.set(Math.max(-2, Math.min(2, (e.clientY - rect.top - rect.height / 2) * 0.06)));
    }} onPointerLeave={() => { x.set(0); y.set(0); bounds.current = null; }}
    onPointerDown={e => {
      if (reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    }}>
    {children}
    {ripple && <span aria-hidden="true" className="ripple-clip"><motion.span key={ripple.id} className="button-ripple"
      style={{ left: ripple.x, top: ripple.y }} initial={{ opacity: 0.28, scale: 0 }} animate={{ opacity: 0, scale: 5 }}
      transition={{ duration: 0.65, ease: motionEase }} onAnimationComplete={() => setRipple(null)} /></span>}
  </motion.span>;
}

export function AnimatedCounter({ value, suffix = "" }: { value: number | MotionValue<number>; suffix?: string }) {
  const { reducedMotion } = useAnimationPreferences();
  const local = useMotionValue(typeof value === "number" ? value : value.get());
  const source = isMotionValue(value) ? value : local;
  const smooth = useSpring(source, { stiffness: 160, damping: 30 });
  const label = useTransform(reducedMotion ? source : smooth, n => `${Math.round(n)}${suffix}`);
  useEffect(() => { if (typeof value === "number") local.set(value); }, [value, local]);
  return <motion.span>{label}</motion.span>;
}

export function SectionHeading({ children, className = "", as = "h2" }: { children: ReactNode; className?: string; as?: "h2" | "h3" }) {
  const Tag = as;
  const { reducedMotion } = useAnimationPreferences();
  return <Reveal className={`section-heading ${className}`}>
    <Tag className={`${as === "h2" ? "h2-responsive" : "h3-responsive"} font-bold text-gradient`}>{typeof children === "string" ? <SplitText text={children} /> : children}</Tag>
    <motion.span aria-hidden="true" className="heading-underline" initial={reducedMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.65, ease: motionEase }} />
  </Reveal>;
}
