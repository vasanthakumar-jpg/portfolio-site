# Portfolio motion

The existing sections, professional facts, routes, resume PDF, contact logic, certificates and loader lifecycle are retained. WhatsApp and the user-supplied Budget-Friendly Development capability are the only new professional/contact content. GSAP, Lenis and Framer Motion are reused; the visual refinement adds no dependencies.

## Section changes

- Loader and hero: the logo loader appears on every full page load and refresh, including repeat refreshes in the same tab. The two-panel exit, timing, progress and safety deadline remain; reduced motion uses a short fade. Hash links and client-side navigation do not restart the loader. Masked text, typing-style roles and restrained magnetic buttons lead into a fixed 2–3 degree portrait perspective. There is no mouse-following portrait tilt, float, glow or glare. Desktop scroll storytelling remains with smaller distances. Social-preview metadata uses the same supplied portrait as the hero.
- Global: Lenis follows the GSAP ticker. Hash links retain their URL and focus behavior, with a 96px header offset; Home always targets the actual page start. Subtle palette sheets, the curved About divider, section progress, navbar hide/show and active pill remain. The native cursor replaces the decorative cursor effects. Surfaces, borders, radius, shadows and typography share a restrained visual system.
- About and skills: the original paragraph highlights word by word with scroll, skill surfaces use short depth entrances and small hover feedback, and the learning tile uses a quiet flat surface. A single slow decorative marquee responds to scroll velocity and pauses on hover.
- What I Do: five cards include the explicitly requested Budget-Friendly Development capability. They fan out on wide desktops; smaller screens keep the responsive grid and staggered entrances. Hover tilt is capped at 2 degrees, lift at 3px, and scale at 1.008.
- Projects: PRAVOKHA clips into view, role cards gain depth, and the workflow line, travelling dot and step overlays scrub together. Walrus enters from the opposite side with staggered features and check reveals. The six smaller projects become a desktop horizontal gallery with a counter, progress bar, active-card emphasis and label parallax. Short viewports and mobile keep the grid. Project dialogs share the clicked card's layout identity.
- Experience and education: the reversible timeline fill is retained, reached roles gain subtle emphasis, date badges flip in, and the graduation cap makes a small one-time toss. Continuous dot pulsing is removed.
- Certifications and recognition: depth entrances, shared certificate-to-modal transitions, image reveals and drawn checks supplement the existing hover and shimmer treatments.
- Contact and footer: email, LinkedIn, GitHub and WhatsApp have equal contact treatments, alongside the existing location and phone. WhatsApp uses `https://wa.me/917339232817` and the authentic Simple Icons mark, with no extra icon package. The lazy map reveal, floating labels, validation feedback and draft-ready plane remain. Focus borders are steady, and decorative footer shimmer/heart loops are removed. Email composition and validation code are unchanged.

## Controls

Edit `src/components/motion/settings.ts`:

| Variable | Default | Meaning |
| --- | --- | --- |
| `reveal` | `0.6` | Entrance duration in seconds |
| `stagger` | `0.06` | Interval between staggered items, seconds |
| `distance` | `24` | Default entrance distance, pixels |
| `scrub` | `0.5` | Scroll animation catch-up, seconds |
| `heroPin` | `0.8` | Hero pin distance as viewport-height multiples |
| `servicesPin` | `0.65` | Service sequence distance as viewport-height multiples; service fan requires 1280px width |
| `parallax` | `24` | Reusable parallax distance, pixels; quarter distance on smaller screens |
| `smoothDuration` | `1.1` | Lenis easing duration, seconds |
| `modal` | `0.45` | Shared surface transition duration, seconds |
| `marqueeSpeed` | `14` | Base marquee speed, pixels per second |
| `desktop` | `1024` | Minimum pinned-scene width; match CSS/preference breakpoints when changing it |

Hero hand-off delays are next to `reveal()` and `introDelay` in `HeroSection.tsx`. Static portrait perspective lives in `HeroSection.css`. Loader exit timing remains in `usePageReady.ts` and `PageCurtain.tsx`; change those together if intentionally changing the original loader contract. Shared hover and surface treatments live in `motion.css`, `cinematic.css` and `index.css`. The 96px hash offset lives in `SmoothScroll.tsx`.

## Changed files

- Dependencies and production loading: `package.json`, `package-lock.json`, `vite.config.ts`, `index.html`.
- Section components: `src/components/HeroSection.tsx`, `AboutSection.tsx`, `ServicesSection.tsx`, `ProjectsSection.tsx`, `ExperienceSection.tsx`, `CourseSection.tsx`, `Footer.tsx`, `Preloader.tsx`.
- New motion utilities in `src/components/motion/`: `SmoothScroll.tsx`, `scroll-engine.ts`, `CinematicScenes.tsx`, `cinematic.tsx`, `cinematic.css`, `ModalExpand.tsx`, `PageCurtain.tsx`, `settings.ts`.
- Existing motion utilities in that directory: `AnimationProvider.tsx`, `PortfolioEffects.tsx`, `RotatingRole.tsx`, `primitives.tsx`.
- Integration and field presentation: `src/pages/Index.tsx`, `src/main.tsx`, `src/components/ui/form-field.tsx`.
- Verification and documentation: `scripts/cinematic-audit.mjs`, `scripts/preloader-audit.mjs`, `README.md`, `Motion.md`.
- Professional visual refinement also updates `src/components/Header.tsx`, `SocialIcons.tsx`, `WhatsAppIcon.tsx`, `ContactSection.tsx`, `SEOHead.tsx`, `HeroSection.css`, `src/data/portfolio.ts`, `src/index.css`, `src/components/motion/motion.css` and `scripts/browser-audit.mjs`. The GitHub Pages configuration is unchanged by the refinement.

## Lifecycle and accessibility

GSAP owns outer scroll wrappers and word masks; Framer owns inner reveal/hover surfaces and modal layout transitions. Neither library controls the other's transform on the same element. GSAP contexts, media queries, frame callbacks, ticker listeners, image listeners and observers are disposed on unmount. Noncritical trigger registration is spread over frames. Trigger measurements refresh after fonts and images load, at the end of setup, and on resize.

Reduced motion disables Lenis, pins, scrubbing, parallax, cursor effects and continuous decorative loops. Desktop pinning requires a fine pointer and sufficient viewport height. Horizontal gallery styles are applied only when its pin is installed and removed when that pin is disposed. Touch retains native scrolling. Radix still traps modal focus, closes on Escape, restores focus, and locks page scroll; Lenis follows that lock. Modal content remains independently scrollable.

## Verification

Run the production preview under `/portfolio-site/`, then run browser suites separately:

```sh
npm run build
npm test
npm run typecheck
npm run lint
npm run preview
# In a second terminal, one suite at a time:
npm run test:browser
npm run test:preloader
npm run test:motion
```

Playwright setup is documented in README.md. The motion suite covers 320, 375, 768, 1024, 1440 and 1920px, static portrait behavior, WhatsApp URLs and navbar fit, the fifth capability, fast scrolling in both directions, mid-page refresh, hash offsets, desktop/mobile resize, live reduced-motion changes, gallery reversal, modal focus and scroll locking, and exact resume download bytes. Diagnostics stay in ignored `audit-artifacts/`.

The refinement has no fresh Lighthouse score. Its runtime uses fewer pointer listeners, springs and decorative loops, but that does not establish a performance score. The loader's existing minimum duration and supplied image assets are retained.

Lighthouse scores depend on throttling, HTTP compression, cache and device. Browser emulation cannot establish 60fps on physical mid-range mobile hardware. Inspect the deployed site on a real phone as well; no live deployment or physical-device performance is implied by a local build.

Integration references: [Lenis GSAP setup](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger), [ScrollTrigger lifecycle](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Motion shared layout transitions](https://motion.dev/docs/react-layout-animations).
