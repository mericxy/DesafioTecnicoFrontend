"use client"

import { useEffect, useState } from "react"
import {type BatteryData, type TemperatureData } from "./components/types"
import { BatteryLevelChart } from "./components/BatteryLevelChart"
import { TemperatureBatteryChart } from "./components/TemperatureBatteryChart"
import { TemperatureCpuChart } from "./components/TemperatureCpuChart"
import { InstataneousCurrentChart } from "./components/InstataneousCurrentChart"



export default function App() {
  const [batteryData, setBatteryData] = useState<BatteryData[]>([])
  const [temperatureData, setTemperatureData] = useState<TemperatureData[]>([])

  useEffect(() => {
    fetch("/api/battery")
      .then((res) => res.json())
      .then((json) => setBatteryData(json))
      .catch(console.error)

    fetch("/api/temperature")
      .then((res) => res.json())
      .then((json) => setTemperatureData(json))
      .catch(console.error)
  }, [])

  return (
    <div className="App bg-gradient-to-b from-black to-gray-600 min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      
    {/* <BatteryLevelChart data={batteryData}/> */}
    {/* <TemperatureBatteryChart data={temperatureData}/> */}
    {/* <TemperatureCpuChart data={temperatureData}/> */}
    {/* <InstataneousCurrentChart data={batteryData}/> */}

    </div>
  )
}
