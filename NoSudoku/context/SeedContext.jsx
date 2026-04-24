import React, { createContext, useContext, useMemo, useState } from 'react';

const SeedContext = createContext(undefined);

export function SeedProvider({ children }) {
  const [seed, setSeed] = useState('1');

  const value = useMemo(() => ({ seed, setSeed }), [seed]);

  return <SeedContext.Provider value={value}>{children}</SeedContext.Provider>;
}

export function useSeed() {
  const context = useContext(SeedContext);

  if (!context) {
    throw new Error('useSeed must be used within a SeedProvider');
  }

  return context;
}
