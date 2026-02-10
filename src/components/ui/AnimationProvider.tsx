import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type SpringType = typeof import('@react-spring/web');
export type GestureType = typeof import('@use-gesture/react');

interface AnimationContextPayload {
  Gesture?: GestureType | undefined;
  Spring?: SpringType | undefined;
  isLoaded?: boolean;
}

const AnimationContext = createContext<AnimationContextPayload>({
  Gesture: undefined,
  Spring: undefined,
  isLoaded: false
});

const getAsyncAnimationModules = async () => Promise.all([import('@react-spring/web'), import('@use-gesture/react')]);

export const useAnimationLibs = () => useContext(AnimationContext) as Required<AnimationContextPayload>;

export function AnimationProvider({ children }: { children: ReactNode }) {
  const SpringRef = useRef<SpringType | undefined>(undefined);
  const GestureRef = useRef<GestureType | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getAsyncAnimationModules().then(([Spring, Gesture]) => {
      SpringRef.current = Spring;
      GestureRef.current = Gesture;
      setIsLoaded(true);
    });
  }, []);

  const value = useMemo(
    () => ({
      Gesture: GestureRef.current,
      Spring: SpringRef.current,
      isLoaded
    }),
    [isLoaded]
  );

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>;
}
