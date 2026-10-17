import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePageReady, MAXIMUM_LOADING_MS, EXIT_DURATION_MS } from "@/hooks/usePageReady";
import { useAnimationPreferences } from "./preferences";
import { PageLoadingContext, type LoadingPhase } from "./loading-context";

export function PageLoadingProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useAnimationPreferences();
  const { enabled, ready } = usePageReady(reducedMotion);
  const [phase, setPhase] = useState<LoadingPhase>(() => enabled ? reducedMotion ? "exiting" : "loading" : "ready");
  const finishLoading = useCallback(() => setPhase("ready"), []);

  useEffect(() => { if (ready) setPhase(previous => previous === "loading" ? "exiting" : previous); }, [ready]);
  useEffect(() => {
    if (phase !== "exiting") return;
    const timer = window.setTimeout(finishLoading, reducedMotion ? 400 : EXIT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion, finishLoading]);
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(finishLoading, MAXIMUM_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, [enabled, finishLoading]);

  const value = useMemo(() => ({ phase, heroReady: reducedMotion || phase === "ready", finishLoading }), [phase, reducedMotion, finishLoading]);
  return <PageLoadingContext.Provider value={value}>{children}</PageLoadingContext.Provider>;
}
