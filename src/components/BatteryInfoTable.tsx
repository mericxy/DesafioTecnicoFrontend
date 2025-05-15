"use client";

import { memo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHoveredData } from "./HoveredDataContext";
import { batteryStatusMap, plugTypeMap } from "./utils/batteryUtils";

const formattedValueCache = new Map<string, string>();

const getFormattedTimestamp = (timestamp: number | string | undefined) => {
  if (!timestamp) return "-";
  
  const cacheKey = `timestamp_${timestamp}`;
  if (formattedValueCache.has(cacheKey)) {
    return formattedValueCache.get(cacheKey) as string;
  }
  
  const date = new Date(timestamp);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  const formatted = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  formattedValueCache.set(cacheKey, formatted);
  
  return formatted;
};

const getFormattedCurrent = (value: number | undefined) => {
  if (value === undefined) return "-";
  
  const cacheKey = `current_${value}`;
  if (formattedValueCache.has(cacheKey)) {
    return formattedValueCache.get(cacheKey) as string;
  }
  
  const formatted = (value / 100).toFixed(1);
  formattedValueCache.set(cacheKey, formatted);
  
  return formatted;
};

const getFormattedVoltage = (value: number | undefined) => {
  if (value === undefined) return "-";
  
  const cacheKey = `voltage_${value}`;
  if (formattedValueCache.has(cacheKey)) {
    return formattedValueCache.get(cacheKey) as string;
  }
  
  const formatted = (value / 100).toFixed(2);
  formattedValueCache.set(cacheKey, formatted);
  
  return formatted;
};

const getFormattedTemperature = (value: number | undefined) => {
  if (value === undefined) return "-";
  
  const cacheKey = `temp_${value}`;
  if (formattedValueCache.has(cacheKey)) {
    return formattedValueCache.get(cacheKey) as string;
  }
  
  const formatted = ( value / 1000).toFixed(1);
  formattedValueCache.set(cacheKey, formatted);
  
  return formatted;
};

function BatteryInfoTableComponent() {
  const { hoveredData, hoveredTempData } = useHoveredData();

  // Limitar o tamanho do cache para evitar uso excessivo de memória
  if (formattedValueCache.size > 1000) {
    // Limpa o cache quando ficar muito grande
    formattedValueCache.clear();
  }

  return (
    <div className="rounded-xl shadow-md p-4 bg-white w-full">
      <h2 className="text-lg font-bold mb-2">Informações da Bateria</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Parâmetro</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Data/Hora</TableCell>
              <TableCell>{getFormattedTimestamp(hoveredData?.timestamp)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status da Bateria</TableCell>
              <TableCell>
                {hoveredData?.battery_status !== undefined 
                  ? batteryStatusMap[hoveredData.battery_status] || `Desconhecido (${hoveredData.battery_status})`
                  : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Tipo de Conexão</TableCell>
              <TableCell>
                {hoveredData?.plug_type !== undefined 
                  ? plugTypeMap[hoveredData.plug_type] || `Desconhecido (${hoveredData.plug_type})`
                  : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Voltagem</TableCell>
              <TableCell>{getFormattedVoltage(hoveredData?.voltage)} Mv</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Corrente Instantânea</TableCell>
              <TableCell>{getFormattedCurrent(hoveredData?.inst_curr)} mAh</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Temperatura da Bateria</TableCell>
              <TableCell>{getFormattedTemperature(hoveredTempData?.temp_bat)} °C</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {!hoveredData && !hoveredTempData && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Passe o mouse sobre um gráfico para ver informações detalhadas
        </p>
      )}
    </div>
  );
}

export const BatteryInfoTable = memo(BatteryInfoTableComponent);