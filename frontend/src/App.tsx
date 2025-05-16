"use client"

import { useEffect, useState, useCallback } from "react"
import { type BatteryData, type TemperatureData } from "./components/types"
import { BatteryLevelChart } from "./components/BatteryLevelChart"
import { TemperatureBatteryChart } from "./components/TemperatureBatteryChart"
import { TemperatureCpuChart } from "./components/TemperatureCpuChart"
import { InstataneousCurrentChart } from "./components/InstataneousCurrentChart"
import { BatteryInfoTable } from "./components/BatteryInfoTable"
import { HoveredDataProvider } from "./components/HoveredDataContext"

export default function App() {
  const [batteryData, setBatteryData] = useState<BatteryData[]>([])
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Otimização: Fetch com memoização e limites
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const batteryResponse = await fetch("/api/battery")
      const batteryJson = await batteryResponse.json()
      
      // Reduz conjunto de dados de bateria se necessário
      const processedBatteryData = batteryJson.length > 1000 
        ? batteryJson.filter((_: any, i: number) => i % Math.ceil(batteryJson.length / 1000) === 0)
        : batteryJson
      
      setBatteryData(processedBatteryData)
      
      const tempResponse = await fetch("/api/temperature")
      const tempJson = await tempResponse.json()
      
      // Reduz conjunto de dados de temperatura se necessário
      const processedTempData = tempJson.length > 1000 
        ? tempJson.filter((_: any, i: number) => i % Math.ceil(tempJson.length / 1000) === 0)
        : tempJson
      
      setTemperatureData(processedTempData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <HoveredDataProvider batteryDataset={batteryData} temperatureDataset={temperatureData}>
      <div className="bg-gradient-to-b from-black to-gray-700 min-h-screen flex flex-col gap-4 p-4">
  <h1 className="text-2xl font-bold text-white">Dashboard de Bateria</h1>
  
  {isLoading ? (
    <div className="flex items-center justify-center h-64 text-white">
      Carregando dados...
    </div>
  ) : (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Sidebar com a tabela - em dispositivos móveis fica no topo */}
      <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
        <div className="md:fixed lg:fixed md:w-64 lg:w-80 flex-shrink-0">
          <BatteryInfoTable />
        </div>
      </div>
      
      {/* Área principal com os gráficos */}
      <div className="flex-grow flex flex-col gap-4">
        <InstataneousCurrentChart data={batteryData} />
        <BatteryLevelChart data={batteryData} />
        <TemperatureBatteryChart data={temperatureData} />
        <TemperatureCpuChart data={temperatureData} />
      </div>
    </div>
  )}
</div>
    </HoveredDataProvider>
  )
}