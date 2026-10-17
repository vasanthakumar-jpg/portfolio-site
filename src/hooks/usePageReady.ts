import { useEffect, useState } from "react";

export const PRELOADER_SESSION_KEY = "portfolio:logo-preloader:v1";
export const MINIMUM_LOADING_MS = 2200;
export const MAXIMUM_LOADING_MS = 5000;
export const EXIT_DURATION_MS = 650;
let shownInMemory = false;

function alreadyShown() {
  try { return shownInMemory || sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1"; }
  catch { return shownInMemory; }
}

/** Wait for above-the-fold resources, without waiting for window.load or the map. */
export function usePageReady(reducedMotion: boolean) {
  const [enabled] = useState(() => !alreadyShown());
  const [ready, setReady] = useState(!enabled || reducedMotion);

  useEffect(() => {
    if (!enabled) return;
    shownInMemory = true;
    try { sessionStorage.setItem(PRELOADER_SESSION_KEY, "1"); } catch { /* Storage can be unavailable in private browsing. */ }
    if (reducedMotion) { setReady(true); return; }

    let cancelled = false;
    let minimumElapsed = false;
    let resourcesReady = false;
    const cleanup: Array<() => void> = [];
    const update = () => { if (!cancelled && minimumElapsed && resourcesReady) setReady(true); };
    let minimumTimer: number;
    const minimumFrame = requestAnimationFrame(() => {
      minimumTimer = window.setTimeout(() => { minimumElapsed = true; update(); }, MINIMUM_LOADING_MS);
    });
    // Reserve time for the curtain exit so the entire loader stays within five seconds.
    const safetyTimer = window.setTimeout(() => { if (!cancelled) setReady(true); }, MAXIMUM_LOADING_MS - EXIT_DURATION_MS);

    const documentReady = document.readyState !== "loading" ? Promise.resolve(true) : new Promise<boolean>(resolve => {
      const done = () => resolve(true);
      document.addEventListener("DOMContentLoaded", done, { once: true });
      cleanup.push(() => document.removeEventListener("DOMContentLoaded", done));
    });
    const fontsReady = document.fonts ? document.fonts.ready.then(() => true, () => true) : Promise.resolve(true);
    const image = document.querySelector<HTMLImageElement>("#home .hero-portrait");
    const heroReady = !image ? Promise.resolve(true) : new Promise<boolean>(resolve => {
      const loaded = () => {
        if (!image.naturalWidth) { resolve(false); return; }
        if (image.decode) image.decode().then(() => resolve(true), () => resolve(false));
        else resolve(true);
      };
      const failed = () => resolve(false);
      image.addEventListener("load", loaded, { once: true });
      image.addEventListener("error", failed, { once: true });
      cleanup.push(() => { image.removeEventListener("load", loaded); image.removeEventListener("error", failed); });
      if (image.complete) loaded();
    });
    Promise.all([documentReady, fontsReady, heroReady]).then(results => {
      resourcesReady = results.every(Boolean);
      update();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(minimumFrame);
      window.clearTimeout(minimumTimer); window.clearTimeout(safetyTimer);
      cleanup.forEach(dispose => dispose());
    };
  }, [enabled, reducedMotion]);

  return { enabled, ready };
}
