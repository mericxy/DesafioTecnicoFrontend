"use client"
import { XAxis, YAxis, CartesianGrid, LineChart, Line, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import type { TemperatureData } from "./types";

const chartConfig = {
  cpuTemp: {
    color: "#2563eb",
    label: "Temperatura da CPU"
  },
  batTemp: {
    color: "#10b981",
    label: "Temperatura da Bateria"
  }
} satisfies ChartConfig;

type Props = {
  data: TemperatureData[];
};

const formatTemperature = (value: number) => {
  return (value / 1000).toFixed(1);
};

const formatTimestamp = (timestamp: number | string) => {
  const date = new Date(timestamp);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  return (
    <div className="border-border/50 bg-background rounded-lg border p-3 text-xs shadow-xl">
      <p className="text-sm font-medium pb-2 border-b mb-2">
        {formatTimestamp(data.timestamp)}
      </p>
      
      <div className="grid gap-2">
        {data.temp_bat !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="h-2.5 w-2.5 rounded-[2px]" 
                style={{ backgroundColor: chartConfig.batTemp.color }}
              />
              <span className="text-muted-foreground">Temperatura da Bateria</span>
            </div>
            <span className="text-foreground font-mono font-medium">
              {formatTemperature(data.temp_bat)} °C
            </span>
          </div>
        )}
        
        {data.temp_cpu !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="h-2.5 w-2.5 rounded-[2px]" 
                style={{ backgroundColor: chartConfig.cpuTemp.color }}
              />
              <span className="text-muted-foreground">Temperatura da CPU</span>
            </div>
            <span className="text-foreground font-mono font-medium">
              {formatTemperature(data.temp_cpu)} °C
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export function TemperatureBatteryChart({ data }: Props) {
    return (
            <div className="rounded-xl shadow-md p-4 bg-white w-full max-w-4xl mx-auto">
                <h2 className="text-lg font-bold mb-2">Temperatura da Bateria (°C)</h2>
                <ChartContainer config={chartConfig} className="h-72">
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="timestamp" 
                                tickFormatter={(ts) => {
                                const date = new Date(ts);
                                return date.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: false
                                });
                              }}
                              interval="preserveStartEnd"
                              minTickGap={60} />
                        <YAxis tickFormatter={formatTemperature}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            dataKey="temp_bat"
                            name="Temperatura da Bateria"
                            type="natural"
                            stroke={chartConfig.batTemp.color}
                            strokeWidth={1}
                            dot={false}
                        />
                        </LineChart>      
                </ChartContainer>
            </div>
    );
}