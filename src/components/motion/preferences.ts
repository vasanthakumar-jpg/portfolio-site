import { createContext, useContext } from "react";

export const AnimationContext = createContext({ reducedMotion: true, finePointer: false });
export const useAnimationPreferences = () => useContext(AnimationContext);
