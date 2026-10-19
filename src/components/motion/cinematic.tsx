import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimationPreferences } from "./preferences";
import { cinema } from "./settings";
import { useScrollEngine } from "./scroll-engine";

/** Text stays one accessible sentence; the visual words are decorative. */
export function SplitText({ text, className = "", highlight = false }: { text: string; className?: string; highlight?: boolean }) {
  return <span className={`split-text ${className}`} data-word-highlight={highlight || undefined}>
    <span className="sr-only">{text}</span><span aria-hidden="true">{text.split(/(\s+)/).map((word, index) => /\s/.test(word)
      ? word : <span className="split-mask" key={index}><span className={`split-word ${/React|Shopify|Liquid/.test(word) ? "key-term" : ""}`}>{word}</span></span>)}</span>
  </span>;
}

export function ParallaxLayer({ children, className = "", distance = cinema.parallax }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, finePointer } = useAnimationPreferences();
  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { y: distance * (finePointer ? 1 : 0.25) }, { y: -distance * (finePointer ? 1 : 0.25), ease: "none",
        scrollTrigger: { trigger: ref.current?.parentElement, start: "top bottom", end: "bottom top", scrub: cinema.scrub } });
    });
    return () => ctx.revert();
  }, [reducedMotion, finePointer, distance]);
  return <div ref={ref} className={className}>{children}</div>;
}

export function PinnedSection({ children, scene, className = "" }: { children: ReactNode; scene: "services" | "gallery"; className?: string }) {
  return <div data-pin-scene={scene} className={className}>{children}</div>;
}

const technologies = ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Material UI", "Shopify", "Liquid", "REST API", "Git/GitHub", "Agile", "SEO"];
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAnimationPreferences();
  const engine = useScrollEngine();
  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    let position = 0, paused = false, visible = false;
    const rows = ref.current.querySelectorAll<HTMLElement>(".marquee-track");
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    observer.observe(ref.current);
    const tick = (_time: number, delta: number) => {
      if (!visible || paused || document.hidden) return;
      const velocity = engine.current?.velocity ?? 0;
      const direction = velocity < -0.5 ? -1 : 1;
      position += Math.min(delta, 50) / 1000 * cinema.marqueeSpeed * (1 + Math.min(Math.abs(velocity) / 12, 2)) * direction;
      rows.forEach((row, index) => {
        const width = row.scrollWidth / 2;
        const shift = ((position % width) + width) % width;
        gsap.set(row, { x: index === 0 ? -shift : shift - width });
      });
    };
    const pause = () => { paused = true; };
    const play = () => { paused = false; };
    const element = ref.current;
    element.addEventListener("pointerenter", pause); element.addEventListener("pointerleave", play);
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); observer.disconnect(); element.removeEventListener("pointerenter", pause); element.removeEventListener("pointerleave", play); gsap.set(rows, { clearProps: "transform" }); };
  }, [reducedMotion, engine]);
  return <div ref={ref} className="tech-marquee" aria-hidden="true"><div className="marquee-row"><div className="marquee-track">{[0, 1].map(copy => <div className="marquee-copy" key={copy}>{technologies.map(tech => <span key={tech}>{tech}<span className="marquee-dot">✦</span></span>)}</div>)}</div></div></div>;
}

export function SectionDivider() {
  return <svg aria-hidden="true" className="section-divider" viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0 70Q360 0 720 65T1440 45V120H0Z" fill="currentColor" /></svg>;
}
