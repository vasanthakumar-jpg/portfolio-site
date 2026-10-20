import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimationPreferences } from "./preferences";
import { useScrollEngine } from "./scroll-engine";
import { cinema } from "./settings";

gsap.registerPlugin(ScrollTrigger);

/** GSAP animates dedicated scene wrappers; Framer owns their inner hover surfaces. */
export default function CinematicScenes() {
  const { reducedMotion } = useAnimationPreferences();
  const engine = useScrollEngine();
  useLayoutEffect(() => {
    if (reducedMotion) return;
    const media = gsap.matchMedia();
    const cleanups: Array<() => void> = [];
    const pending: Array<() => void> = [];
    let frame = 0;
    const ctx = gsap.context(() => {
      // Spread noncritical registrations over frames instead of blocking the
      // initial React commit with dozens of synchronous layout measurements.
      const reveal = (target: gsap.TweenTarget, trigger: Element, from: gsap.TweenVars = {}) => pending.push(() => { ctx.add(() => { gsap.from(target, {
        opacity: 0, y: cinema.distance, duration: cinema.reveal, ease: "expo.out", ...from,
        scrollTrigger: { trigger, start: "top 88%", once: true },
        onComplete() { gsap.set(target, { clearProps: "willChange" }); },
      }); }); });
      document.querySelectorAll(".section-heading").forEach(heading => {
        reveal(heading.querySelectorAll(".split-word"), heading, { yPercent: 105, y: 0, stagger: cinema.stagger });
      });
      document.querySelectorAll("[data-word-highlight]").forEach(paragraph => {
        pending.push(() => { ctx.add(() => { gsap.fromTo(paragraph.querySelectorAll(".split-word"), { opacity: 0.2 }, { opacity: 1, stagger: 0.08, ease: "none",
          scrollTrigger: { trigger: paragraph, start: "top 84%", end: "bottom 35%", scrub: cinema.scrub } }); }); });
      });
      document.querySelectorAll(".skill-scene, .certificate-scene").forEach((card, index) => {
        reveal(card, card, { rotateX: 6, y: cinema.distance, stagger: cinema.stagger, delay: index % 3 * cinema.stagger, transformPerspective: 1000 });
      });
      document.querySelectorAll(".draw-checks .lucide-check, .draw-checks .lucide-circle-check-big").forEach((icon, index) => {
        reveal(icon, icon, { y: 0, clipPath: "inset(0 100% 0 0)", delay: index % 4 * cinema.stagger });
      });
      const pravokha = document.querySelector(".pravokha-scene");
      if (pravokha) reveal(pravokha, pravokha, { y: 0, clipPath: "inset(12% 8% 12% 8% round 24px)" });
      const workflow = document.querySelector(".workflow-list");
      if (workflow) {
        media.add({ horizontal: "(min-width: 768px)", vertical: "(max-width: 767px)" }, context => {
          const horizontal = context.conditions?.horizontal;
          const markers = workflow.querySelectorAll<HTMLElement>(".workflow-marker");
          const distance = () => {
            const first = markers[0].getBoundingClientRect();
            const last = markers[markers.length - 1].getBoundingClientRect();
            return horizontal ? last.left - first.left : last.top - first.top;
          };
          const flow = gsap.timeline({ scrollTrigger: { trigger: workflow, start: "top 85%", end: "bottom 40%", scrub: cinema.scrub, invalidateOnRefresh: true } });
          flow.fromTo(workflow.querySelector(".workflow-connector"), horizontal ? { scaleX: 0 } : { scaleY: 0 }, horizontal ? { scaleX: 1, ease: "none", duration: 1 } : { scaleY: 1, ease: "none", duration: 1 }, 0)
            .fromTo(workflow.querySelectorAll(".workflow-light"), { opacity: 0 }, { opacity: 1, stagger: 0.22, duration: 0.2 }, 0)
            .fromTo(workflow.querySelector(".workflow-traveler"), { x: 0, y: 0 }, horizontal ? { x: distance, ease: "none", duration: 1 } : { y: distance, ease: "none", duration: 1 }, 0);
        });
      }
      const map = document.querySelector(".contact-map-frame");
      if (map) reveal(map, map, { y: 0, clipPath: "circle(0% at 50% 50%)", onComplete() { gsap.set(map, { clipPath: "none" }); } });
      // Animate between existing palette sheets by opacity; no paint-heavy colour tween.
      const light = document.querySelector(".cinema-light-wash");
      if (light) gsap.fromTo(light, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: "#about", start: "top bottom", end: "top 20%", scrub: cinema.scrub } });
      const teal = document.querySelector(".cinema-teal-wash");
      if (teal) gsap.fromTo(teal, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: "#services", start: "top bottom", endTrigger: "#contact", end: "bottom bottom", scrub: cinema.scrub } });
      document.querySelectorAll(".section-divider").forEach(divider => gsap.fromTo(divider, { y: 25, scaleY: 0.65 }, { y: -1, scaleY: 1, ease: "none",
        scrollTrigger: { trigger: divider.parentElement, start: "top bottom", end: "top 10%", scrub: cinema.scrub } }));

      document.querySelectorAll<HTMLElement>(".experience-scene").forEach(card => {
        const dot = card.querySelector(".timeline-dot");
        const emphasis = card.querySelector(".experience-emphasis");
        gsap.timeline({ scrollTrigger: { trigger: card, start: "top 70%", end: "bottom 25%", scrub: cinema.scrub } })
          .fromTo(emphasis, { scale: 1, opacity: 0.94 }, { scale: 1.01, opacity: 1, duration: 0.4 })
          .to(emphasis, { scale: 1, opacity: 0.94, duration: 0.6 });
        ScrollTrigger.create({ trigger: card, start: "top 70%", end: "bottom 25%", toggleClass: { targets: card, className: "experience-active" } });
        if (dot) gsap.fromTo(dot, { scale: 0.65, opacity: 0.35 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: card, start: "top 85%", end: "top 60%", scrub: cinema.scrub } });
      });
      media.add({ desktop: `(min-width: ${cinema.desktop}px) and (hover: hover) and (pointer: fine)`, wide: "(min-width: 1280px)" }, context => {
        if (!context.conditions?.desktop) return;
        const hero = document.querySelector<HTMLElement>("#home");
        if (hero && hero.offsetHeight <= window.innerHeight * 1.2) {
          const sequence = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { id: "cinema-hero", trigger: hero, start: "top top", end: () => `+=${window.innerHeight * cinema.heroPin}`, pin: true, scrub: cinema.scrub, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 3 } });
          sequence.to(".hero-scroll-copy", { y: -32, scale: 1.01, opacity: 0.35 }, 0)
            .to(".hero-scroll-portrait", { y: -Math.min(window.innerHeight * 0.06, 60), scale: 0.97, filter: "blur(0.8px)" }, 0)
            .to(".hero-chip-react", { x: -12, y: -8 }, 0).to(".hero-chip-shopify", { x: 12, y: 8 }, 0)
            .to(".hero-scroll", { opacity: 0, y: 20, duration: 0.2 }, 0)
            .to(".hero-scroll-tint", { opacity: 0.3 }, 0);
        }
        const services = document.querySelector<HTMLElement>('[data-pin-scene="services"]');
        if (context.conditions.wide && services && services.offsetHeight < window.innerHeight - 100) {
          const cards = gsap.utils.toArray<HTMLElement>(".service-scene");
          const sequence = gsap.timeline({ scrollTrigger: { id: "cinema-services", trigger: services, start: "top 110px", end: () => `+=${window.innerHeight * cinema.servicesPin}`, pin: true, scrub: cinema.scrub, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 2 } });
          cards.forEach((card, index) => sequence.fromTo(card, {
            x: () => { const parent = card.parentElement!.getBoundingClientRect(); return parent.width / 2 - card.offsetLeft - card.offsetWidth / 2; },
            y: index * -3, rotation: (index - (cards.length - 1) / 2) * 1.2, scale: 0.96,
          }, { x: 0, y: 0, rotation: 0, scale: 1, ease: "power2.inOut", duration: 1 }, index * 0.07));
        }
        const gallery = document.querySelector<HTMLElement>('[data-pin-scene="gallery"]');
        const track = gallery?.querySelector<HTMLElement>(".gallery-track");
        if (gallery && track) {
          gallery.dataset.horizontal = "true";
          if (gallery.offsetHeight >= window.innerHeight - 80) { delete gallery.dataset.horizontal; return; }
          const cards = Array.from(track.querySelectorAll<HTMLElement>(".gallery-card-scene"));
          const travel = () => Math.max(0, track.scrollWidth - gallery.clientWidth);
          const sequence = gsap.to(track, { x: () => -travel(), ease: "none", scrollTrigger: {
            id: "cinema-gallery", trigger: gallery, start: "top 90px", end: () => `+=${travel()}`, pin: true, scrub: cinema.scrub, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1,
            onUpdate: self => {
              const active = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              const count = gallery.querySelector(".gallery-counter-current");
              if (count) count.textContent = String(active + 1).padStart(2, "0");
              cards.forEach((card, index) => {
                const relative = Math.abs(index - self.progress * (cards.length - 1));
                gsap.set(card, { scale: 1 - Math.min(relative, 1) * 0.015, opacity: 1 - Math.min(relative, 1) * 0.12 });
                gsap.set(card.querySelector(".project-top-label"), { x: gsap.utils.clamp(-10, 10, (index - self.progress * (cards.length - 1)) * 10) });
              });
              gsap.set(gallery.querySelector(".gallery-progress-fill"), { scaleX: self.progress });
            },
          } });
          const focus = (event: FocusEvent) => {
            const card = event.target instanceof Element ? event.target.closest<HTMLElement>(".gallery-card-scene") : null;
            const trigger = sequence.scrollTrigger;
            if (!card || !trigger || document.querySelector('[role="dialog"]')) return;
            const index = cards.indexOf(card);
            const position = trigger.start + (trigger.end - trigger.start) * index / Math.max(1, cards.length - 1);
            if (engine.current) engine.current.scrollTo(position, { immediate: true }); else window.scrollTo(0, position);
          };
          gallery.addEventListener("focusin", focus);
          const dispose = () => {
            gallery.removeEventListener("focusin", focus); delete gallery.dataset.horizontal;
            gsap.set(cards, { clearProps: "transform,opacity" });
            gsap.set(gallery.querySelectorAll(".project-top-label"), { clearProps: "transform" });
          };
          cleanups.push(dispose);
          return dispose;
        }
      });
      const footer = document.querySelector("footer");
      if (footer) gsap.fromTo(".footer-uncover", { y: 65, opacity: 0.55 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: cinema.scrub } });
    });
    const registerNext = () => {
      const next = pending.shift();
      if (next) { next(); frame = requestAnimationFrame(registerNext); }
      else { ScrollTrigger.refresh(); window.dispatchEvent(new Event("portfolio:scenes-ready")); }
    };
    frame = requestAnimationFrame(registerNext);
    return () => { cancelAnimationFrame(frame); pending.length = 0; cleanups.forEach(dispose => dispose()); media.revert(); ctx.revert(); };
  }, [reducedMotion, engine]);
  return <div aria-hidden="true" className="cinema-atmosphere"><div className="cinema-light-wash" /><div className="cinema-teal-wash" /></div>;
}
