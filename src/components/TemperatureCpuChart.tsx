"use client"
import { XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import type { TemperatureData } from "./types";

const chartConfig = {
  desktop: {
    color: "#2563eb",
  },
} satisfies ChartConfig;
type Props = {
  data: TemperatureData[];
};
export function TemperatureCpuChart({ data }: Props) {
    return (
            <div className="rounded-xl shadow-md p-4 bg-white w-full max-w-4xl mx-auto">
                <h2 className="text-lg font-bold mb-2">Temperatura da Bateria (°C)</h2>
                <ChartContainer config={chartConfig}>
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            dataKey="temp_cpu"
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                        </LineChart>
                </ChartContainer>
            </div>
    );
}