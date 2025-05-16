"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import type { BatteryData, TemperatureData } from "./types";

interface HoveredDataContextType {
  hoveredData: BatteryData | null;
  hoveredTempData: TemperatureData | null;
  setHoveredData: (data: BatteryData | null) => void;
  setHoveredTempData: (data: TemperatureData | null) => void;
  setHoveredTimestamp: (timestamp: number | null) => void;
  hoveredTimestamp: number | null;
  findMatchingTempData: (timestamp: number) => TemperatureData | null;
  findMatchingBatteryData: (timestamp: number) => BatteryData | null;
}

const HoveredDataContext = createContext<HoveredDataContextType | undefined>(undefined);

export function HoveredDataProvider({ 
  children, 
  batteryDataset, 
  temperatureDataset 
}: { 
  children: ReactNode,
  batteryDataset?: BatteryData[],
  temperatureDataset?: TemperatureData[]
}) {
  const [hoveredData, setHoveredData] = useState<BatteryData | null>(null);
  const [hoveredTempData, setHoveredTempData] = useState<TemperatureData | null>(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<number | null>(null);
  const [batteryData, setBatteryData] = useState<BatteryData[]>(batteryDataset || []);
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>(temperatureDataset || []);

  // Atualizar datasets quando props mudarem
  if (batteryDataset && batteryDataset !== batteryData) {
    setBatteryData(batteryDataset);
  }

  if (temperatureDataset && temperatureDataset !== temperatureData) {
    setTemperatureData(temperatureDataset);
  }

  // Função para encontrar dados de temperatura correspondentes ao timestamp
  const findMatchingTempData = useCallback((timestamp: number): TemperatureData | null => {
    if (!temperatureData || temperatureData.length === 0) return null;

    // Encontrar correspondência exata primeiro
    let match = temperatureData.find(item => item.timestamp === timestamp);

    // Se não houver correspondência exata, encontrar o timestamp mais próximo
    if (!match) {
      let closestItem = temperatureData[0];
      let smallestDiff = Math.abs(closestItem.timestamp as number - timestamp);

      for (const item of temperatureData) {
        const diff = Math.abs(item.timestamp as number - timestamp);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestItem = item;
        }
      }
      match = closestItem;
    }

    return match;
  }, [temperatureData]);

  // Função para encontrar dados de bateria correspondentes ao timestamp
  const findMatchingBatteryData = useCallback((timestamp: number): BatteryData | null => {
    if (!batteryData || batteryData.length === 0) return null;

    // Encontrar correspondência exata primeiro
    let match = batteryData.find(item => item.timestamp === timestamp);

    // Se não houver correspondência exata, encontrar o timestamp mais próximo
    if (!match) {
      let closestItem = batteryData[0];
      let smallestDiff = Math.abs(closestItem.timestamp as number - timestamp);

      for (const item of batteryData) {
        const diff = Math.abs(item.timestamp as number - timestamp);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestItem = item;
        }
      }
      match = closestItem;
    }

    return match;
  }, [batteryData]);

  // Handler modificado para atualizar dados
  const handleSetHoveredData = useCallback((data: BatteryData | null) => {
    if (!data) {
      setHoveredData(null);
      setHoveredTimestamp(null);
      setHoveredTempData(null);
      return;
    }
    
    const timestamp = data.timestamp as number;
    
    // Apenas atualiza os dados se o timestamp for diferente
    // Isso evita atualizações repetidas do mesmo ponto
    if (!hoveredTimestamp || hoveredTimestamp !== timestamp) {
      setHoveredData(data);
      setHoveredTimestamp(timestamp);
      
      // Encontrar dados de temperatura correspondentes
      const matchingTempData = findMatchingTempData(timestamp);
      setHoveredTempData(matchingTempData);
    }
  }, [hoveredTimestamp, findMatchingTempData]);

  // Handler para configurar dados de temperatura
  const handleSetHoveredTempData = useCallback((data: TemperatureData | null) => {
    if (!data) {
      setHoveredTempData(null);
      setHoveredTimestamp(null);
      setHoveredData(null);
      return;
    }
    
    const timestamp = data.timestamp as number;
    
    // Apenas atualiza os dados se o timestamp for diferente
    if (!hoveredTimestamp || hoveredTimestamp !== timestamp) {
      setHoveredTempData(data);
      setHoveredTimestamp(timestamp);
      
      // Encontrar dados de bateria correspondentes
      const matchingBatteryData = findMatchingBatteryData(timestamp);
      setHoveredData(matchingBatteryData);
    }
  }, [hoveredTimestamp, findMatchingBatteryData]);

  // Handler para setar timestamp diretamente
  const handleSetHoveredTimestamp = useCallback((timestamp: number | null) => {
    if (!timestamp) {
      setHoveredData(null);
      setHoveredTempData(null);
      setHoveredTimestamp(null);
      return;
    }
    
    setHoveredTimestamp(timestamp);
    
    // Encontrar dados correspondentes
    const matchingBatteryData = findMatchingBatteryData(timestamp);
    const matchingTempData = findMatchingTempData(timestamp);
    
    setHoveredData(matchingBatteryData);
    setHoveredTempData(matchingTempData);
  }, [findMatchingBatteryData, findMatchingTempData]);

  return (
    <HoveredDataContext.Provider value={{ 
      hoveredData,
      hoveredTempData,
      setHoveredData: handleSetHoveredData,
      setHoveredTempData: handleSetHoveredTempData,
      setHoveredTimestamp: handleSetHoveredTimestamp,
      hoveredTimestamp,
      findMatchingTempData,
      findMatchingBatteryData
    }}>
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