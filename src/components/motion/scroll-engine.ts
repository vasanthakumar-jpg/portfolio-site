import { createContext, useContext, type RefObject } from "react";
import type Lenis from "lenis";

export const ScrollEngineContext = createContext<RefObject<Lenis | null>>({ current: null });
export const useScrollEngine = () => useContext(ScrollEngineContext);
