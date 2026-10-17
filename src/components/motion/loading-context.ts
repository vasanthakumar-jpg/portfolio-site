import { createContext, useContext } from "react";

export type LoadingPhase = "loading" | "exiting" | "ready";
export const PageLoadingContext = createContext<{
  phase: LoadingPhase;
  heroReady: boolean;
  finishLoading: () => void;
}>({ phase: "ready", heroReady: true, finishLoading: () => undefined });

export const usePageLoading = () => useContext(PageLoadingContext);
