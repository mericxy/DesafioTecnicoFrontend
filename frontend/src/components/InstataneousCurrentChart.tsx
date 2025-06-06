"use client";
import { memo, useCallback, useMemo } from "react";
import { XAxis, YAxis, CartesianGrid, LineChart, Line, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import type { BatteryData } from "./types";
import { useHoveredData } from "./HoveredDataContext";

const chartConfig = {
  instCurr: {
    color: "#2563eb",
    label: "Corrente Instantânea"
  },
  remCap: {
    color: "#10b981",
    label: "Capacidade Restante da Bateria"
  }
} satisfies ChartConfig;

type Props = {
  data: BatteryData[];
};

const formatCurrent = (value: number) => {
  return (value / 100).toFixed(1);
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

const CustomTooltip = memo(({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  return (
    <div className="border-border/50 bg-background rounded-lg border p-3 text-xs shadow-xl">
      <p className="text-sm font-medium pb-2 border-b mb-2">
        {formatTimestamp(data.timestamp)}
      </p>
      
      <div className="grid gap-2">
        {data.inst_curr !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="h-2.5 w-2.5 rounded-[2px]" 
                style={{ backgroundColor: chartConfig.instCurr.color }}
              />
              <span className="text-muted-foreground">Corrente Instantânea</span>
            </div>
            <span className="text-foreground font-mono font-medium">
              {formatCurrent(data.inst_curr)} mAh
            </span>
          </div>
        )}
        
        {data.rem_cap !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="h-2.5 w-2.5 rounded-[2px]" 
                style={{ backgroundColor: chartConfig.remCap.color }}
              />
              <span className="text-muted-foreground">Capacidade Restante da Bateria</span>
            </div>
            <span className="text-foreground font-mono font-medium">
              {formatCurrent(data.rem_cap)} %
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

const useThrottleCallback = (callback: Function, delay: number) => {
  const lastCall = useMemo(() => ({ time: 0 }), []);
  
  return useCallback((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall.time >= delay) {
      lastCall.time = now;
      callback(...args);
    }
  }, [callback, delay, lastCall]);
};

function InstataneousCurrentChartComponent({ data }: Props) {
    const { setHoveredData, hoveredTimestamp } = useHoveredData();
    
    const limitedData = useMemo(() => {
      if (data.length > 500) {
        const step = Math.ceil(data.length / 500);
        return data.filter((_, index) => index % step === 0);
      }
      return data;
    }, [data]);

    const handleMouseMove = useThrottleCallback((props: any) => {
      if (props.activePayload && props.activePayload.length > 0) {
        const pointData = props.activePayload[0].payload;
        if (hoveredTimestamp !== pointData.timestamp) {
          setHoveredData(pointData);
        }
      }
    }, 50);

    const handleMouseLeave = useCallback(() => {
       setHoveredData(null);
    }, []);

    // Melhorar performance de renderização do eixo X
    const xAxisTickFormatter = useCallback((ts: any) => {
      const date = new Date(ts);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }, []);

    return (
        <div className="rounded-xl shadow-md p-4 bg-white w-full">
            <h2 className="text-lg font-bold mb-2">Corrente Instantânea (mAh)</h2>
            <ChartContainer 
              config={chartConfig} 
              className="h-44 md:h-48 lg:h-52 w-full"
            >
              <LineChart 
                data={limitedData}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                width={500}
                height={300}
                margin={{
                  top: 5,
                  right: 30,
                  left: 10,
                  bottom: 5
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={xAxisTickFormatter}
                  interval="preserveStartEnd"
                  minTickGap={60} 
                />
                <YAxis tickFormatter={formatCurrent}/>
                <Tooltip content={<CustomTooltip />} />
                <Line
                  dataKey="inst_curr"
                  name="Corrente Instantânea"
                  type="monotone"
                  stroke={chartConfig.instCurr.color}
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
          </ChartContainer>
        </div>
    );
}

export const InstataneousCurrentChart = memo(InstataneousCurrentChartComponent);