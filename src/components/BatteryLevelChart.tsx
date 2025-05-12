"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label} from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartContainer, } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import type { BatteryData } from "./types";

const chartConfig = {
  desktop: {
    color: "#2563eb",
  },
} satisfies ChartConfig

type Props = {
  data: BatteryData[];
};

export function BatteryLevelChart({ data }: Props) {
  return (
    <div className="rounded-xl shadow-md p-4 bg-white w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Nível da Bateria (%)</h2>
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
          <YAxis />
          {/* <Tooltip
            labelFormatter={(ts) => new Date(ts).toLocaleString()}
            formatter={(value: number) => `${value}%`}
          /> */}
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="battery_level" fill="#4f46e5" />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
