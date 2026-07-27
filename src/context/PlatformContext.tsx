import React, { createContext, useContext, useState } from 'react';
import { SurfaceType, DashboardSubTab } from '../types';

interface PlatformContextType {
  currentSurface: SurfaceType;
  setSurface: (surface: SurfaceType) => void;
  dashboardSubTab: DashboardSubTab;
  setDashboardSubTab: (tab: DashboardSubTab) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSurface, setSurface] = useState<SurfaceType>('portal');
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('hierarchy');

  return (
    <PlatformContext.Provider value={{ currentSurface, setSurface, dashboardSubTab, setDashboardSubTab }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within PlatformProvider');
  return context;
};
