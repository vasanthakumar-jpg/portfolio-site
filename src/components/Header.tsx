import { useState, useEffect, useRef } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import SocialIcons from "./SocialIcons";
import { profile } from "@/data/portfolio";
import { useAnimationPreferences } from "./motion/preferences";
import { motionEase } from "./motion/variants";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("#home");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const previousScroll = useRef(0);
  const { reducedMotion } = useAnimationPreferences();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", value => {
    setIsScrolled(previous => previous === (value > 50) ? previous : value > 50);
    const delta = value - previousScroll.current;
    if (Math.abs(delta) > 8 || value < 100) {
      setHidden(!reducedMotion && !isMenuOpen && value > 300 && delta > 0 && !headerRef.current?.contains(document.activeElement));
      previousScroll.current = value;
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive("#" + entry.target.id);
    }, { rootMargin: "-80px 0px -60% 0px", threshold: 0 });
    navItems.forEach(item => { const section = document.querySelector(item.href); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsMenuOpen(false); menuButtonRef.current?.focus(); }
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeDesktopMenu = () => { if (desktopQuery.matches) setIsMenuOpen(false); };
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeDesktopMenu);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", closeDesktopMenu);
    };
  }, [isMenuOpen]);

  const resume = <a href={import.meta.env.BASE_URL + profile.resumePath} download={profile.resumePath} onClick={() => setIsMenuOpen(false)}>
    <Download aria-hidden="true" className="w-4 h-4 mr-2" /><span className="hidden lg:inline">Download </span>Resume
  </a>;

  return <motion.header ref={headerRef} initial={reducedMotion ? false : { y: -80 }} animate={{ y: hidden && !isMenuOpen && !reducedMotion ? "-100%" : 0 }}
    transition={{ duration: reducedMotion ? 0 : 0.3, ease: motionEase }}
    onFocusCapture={() => setHidden(false)}
    className="portfolio-header fixed top-0 left-0 right-0 z-50" data-scrolled={isScrolled} data-hidden={hidden && !isMenuOpen && !reducedMotion}>
    <motion.div aria-hidden="true" className="header-surface" animate={{ scaleY: isScrolled && !isMenuOpen ? 0.9 : 1 }} />
    <div aria-hidden="true" className="header-shadow" style={{ opacity: isScrolled ? 1 : 0 }} />
    <div className="container-custom relative">
      <div className="flex items-center justify-between h-20">
        <a href="#home" aria-label="Vasanthakumar — Home" className="flex items-center">
          <img src={import.meta.env.BASE_URL + "logo.png"} alt="Vasanthakumar portfolio" width={748} height={323}
            className="w-32 md:w-36 lg:w-48 object-contain" />
        </a>
        <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-3 lg:space-x-5">
          {navItems.map(item => <a href={item.href} key={item.label} onClick={() => { setActive(item.href); setHidden(false); }}
            aria-current={active === item.href ? "location" : undefined} className="nav-link font-medium text-sm lg:text-base px-2 py-2">
            {active === item.href && <motion.span aria-hidden="true" layoutId={reducedMotion ? undefined : "nav-active"}
              className="nav-active-pill" transition={{ duration: 0.3, ease: motionEase }} />}
            <span className="relative">{item.label}</span>
          </a>)}
          <div className="hidden xl:flex"><SocialIcons iconSize={16} className="mx-2" showAll /></div>
          <Button asChild className="btn-hero shimmer-button text-sm px-4 py-2 lg:px-5">{resume}</Button>
        </nav>
        <button type="button" ref={menuButtonRef} className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => { setIsMenuOpen(!isMenuOpen); setHidden(false); }} aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen} aria-controls="mobile-navigation">
          {isMenuOpen ? <X aria-hidden="true" className="w-8 h-8" /> : <Menu aria-hidden="true" className="w-8 h-8" />}
        </button>
      </div>
    </div>
    <AnimatePresence initial={false}>
      {isMenuOpen && <motion.div initial={reducedMotion ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: reducedMotion ? 0 : 24 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}
        className="mobile-nav-drawer md:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto bg-background/95 backdrop-blur-md border-t border-border/50">
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="container-custom py-6">
          <div className="flex flex-col space-y-4 items-center">
            {navItems.map((item, index) => <motion.a href={item.href} key={item.label}
              initial={reducedMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : index * 0.06 }}
              aria-current={active === item.href ? "location" : undefined}
              onClick={() => { setIsMenuOpen(false); setActive(item.href); }}
              className="text-center py-3 px-6 hover:text-primary font-medium text-lg">{item.label}</motion.a>)}
            <SocialIcons className="justify-center py-4" showAll />
            <Button asChild className="btn-hero shimmer-button w-full">{resume}</Button>
          </div>
        </nav>
      </motion.div>}
    </AnimatePresence>
  </motion.header>;
};
export default Header;
