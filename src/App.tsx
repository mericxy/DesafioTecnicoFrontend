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
      
      // Se o conjunto de dados for muito grande, reduza-o
      const processedBatteryData = batteryJson.length > 1000 
        ? batteryJson.filter((_: any, i: number) => i % Math.ceil(batteryJson.length / 1000) === 0)
        : batteryJson
      
      setBatteryData(processedBatteryData)
      
      const tempResponse = await fetch("/api/temperature")
      const tempJson = await tempResponse.json()
      
      // Se o conjunto de dados for muito grande, reduza-o
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
    
    // Opcional: Atualizar dados a cada 5 minutos
    // const intervalId = setInterval(fetchData, 5 * 60 * 1000)
    // return () => clearInterval(intervalId)
  }, [fetchData])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Bateria</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando dados...</p>
        </div>
      ) : (
        <HoveredDataProvider batteryData={batteryData} temperatureData={temperatureData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-4 bg-white rounded-lg shadow">
              <BatteryLevelChart data={batteryData} />
            </div>
            
            <div className="card p-4 bg-white rounded-lg shadow">
              <TemperatureBatteryChart data={temperatureData} />
            </div>
            
            {/* Quando você quiser adicionar os outros gráficos, 
                basta descomentar estas linhas e modificar os componentes 
                para também usarem o useHoveredData */}
            {/* <div className="card p-4 bg-white rounded-lg shadow">
              <TemperatureCpuChart data={temperatureData} />
            </div> */}
            
            {/* <div className="card p-4 bg-white rounded-lg shadow">
              <InstataneousCurrentChart data={batteryData} />
            </div> */}
          </div>
          
          <div className="mt-6">
            <BatteryInfoTable />
          </div>
        </HoveredDataProvider>
      )}
    </div>
  );
}