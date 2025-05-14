"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import type { BatteryData } from "./types";

interface HoveredDataContextType {
  hoveredData: BatteryData | null;
  setHoveredData: (data: BatteryData | null) => void;
  hoveredTimestamp: number | null;
}

const HoveredDataContext = createContext<HoveredDataContextType | undefined>(undefined);

export function HoveredDataProvider({ children }: { children: ReactNode }) {
  const [hoveredData, setHoveredData] = useState<BatteryData | null>(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);

   const handleSetHoveredData = useCallback((data: BatteryData | null) => {
    if (!data) {
      setHoveredData(null);
      setHoveredTimestamp(null);
      return;
    }
    
    // Apenas atualiza os dados se o timestamp for diferente
    // Isso evita atualizações repetidas do mesmo ponto
    if (!hoveredTimestamp || hoveredTimestamp !== data.timestamp) {
      setHoveredData(data);
      setHoveredTimestamp(data.timestamp as number);
    }
  }, [hoveredTimestamp]);

  return (
    <HoveredDataContext.Provider value={{ 
      hoveredData,
       setHoveredData: handleSetHoveredData,
       hoveredTimestamp,}}>
      {children}
    </HoveredDataContext.Provider>
  );
}



export function useHoveredData() {
  const context = useContext(HoveredDataContext);
  if (context === undefined) {
    throw new Error("useHoveredData must be used within a HoveredDataProvider");
  }
  return context;
}