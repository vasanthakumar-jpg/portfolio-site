import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimationPreferences } from "./preferences";
import { usePageLoading } from "./loading-context";
import { ScrollEngineContext } from "./scroll-engine";
import { cinema } from "./settings";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const engine = useRef<Lenis | null>(null);
  const { reducedMotion } = useAnimationPreferences();
  const { heroReady } = usePageLoading();

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({ duration: cinema.smoothDuration, smoothWheel: true, syncTouch: false,
      prevent: node => !!node.closest('[data-lenis-prevent], [role="dialog"], .mobile-nav-drawer') });
    engine.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const lock = () => {
      const locked = document.body.hasAttribute("data-scroll-locked") || !!document.querySelector(".logo-preloader:not(.logo-preloader-reduced)");
      if (locked) lenis.stop(); else lenis.start();
    };
    const observer = new MutationObserver(lock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"], childList: true, subtree: true });
    lock();
    return () => {
      observer.disconnect();
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      engine.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!heroReady) return;
    let frame = 0;
    let cancelled = false;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (!cancelled) { engine.current?.resize(); ScrollTrigger.refresh(); } });
    };
    const navigate = (hash: string, immediate = false) => {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      const focus = () => {
        const hadTabIndex = target.hasAttribute("tabindex");
        if (!hadTabIndex) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (!hadTabIndex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      };
      const y = id === "home" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 96);
      if (engine.current) engine.current.scrollTo(y, { immediate, onComplete: focus });
      else { window.scrollTo({ top: y, behavior: reducedMotion || immediate ? "instant" : "smooth" }); focus(); }
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!anchor || anchor.hasAttribute("download") || anchor.target === "_blank" || anchor.hash.length < 2) return;
      if (!document.getElementById(decodeURIComponent(anchor.hash.slice(1)))) return;
      event.preventDefault();
      if (location.hash !== anchor.hash) history.pushState(null, "", anchor.hash);
      navigate(anchor.hash);
    };
    const hashChange = () => navigate(location.hash);
    const scenesReady = () => { if (location.hash) navigate(location.hash, true); };
    document.addEventListener("click", click);
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("portfolio:scenes-ready", scenesReady);
    const images = Array.from(document.images);
    images.forEach(image => { image.addEventListener("load", refresh); image.addEventListener("error", refresh); });
    document.fonts?.ready.then(() => { if (!cancelled) refresh(); });
    refresh();
    const restore = window.setTimeout(() => { if (location.hash) navigate(location.hash, true); }, 100);
    return () => {
      cancelled = true; cancelAnimationFrame(frame); clearTimeout(restore);
      document.removeEventListener("click", click); window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("portfolio:scenes-ready", scenesReady);
      images.forEach(image => { image.removeEventListener("load", refresh); image.removeEventListener("error", refresh); });
    };
  }, [heroReady, reducedMotion]);
  return <ScrollEngineContext.Provider value={engine}>{children}</ScrollEngineContext.Provider>;
}
