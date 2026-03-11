"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SingularityContextType {
  multiplier: number;
  setMultiplier: (v: number) => void;
  isActive: boolean;
}

const SingularityContext = createContext<SingularityContextType>({
  multiplier: 2.0,
  setMultiplier: () => {},
  isActive: true,
});

export function SingularityProvider({ children }: { children: ReactNode }) {
  // Default to AGI mode (2.0x)
  const [multiplier, setMultiplier] = useState(2.0);

  return (
    <SingularityContext.Provider
      value={{ multiplier, setMultiplier, isActive: multiplier > 1.0 }}
    >
      {children}
    </SingularityContext.Provider>
  );
}

export function useSingularity() {
  return useContext(SingularityContext);
}
