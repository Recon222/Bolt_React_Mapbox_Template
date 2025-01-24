import React, { createContext, useContext } from 'react';
import { viewportManager } from '../lib/ViewportManager';

const ViewportContext = createContext<typeof viewportManager>(viewportManager);

export const ViewportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ViewportContext.Provider value={viewportManager}>
    {children}
  </ViewportContext.Provider>
);

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
};
