import React, { createContext, useContext, useState } from 'react';

interface RouteContextData {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}

const RouteContext = createContext<RouteContextData | undefined>(undefined);

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState('');

  return (
    <RouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);

  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }

  return context;
}
