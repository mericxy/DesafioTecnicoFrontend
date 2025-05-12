export type BatteryData = {
  timestamp: number;
  rem_cap: number;
  inst_curr: number;
  voltage: number;
  battery_level: number;
  battery_status: number;
  plug_type: number;
};

export type TemperatureData = {
  timestamp: number;
  temp_bat: number;
  temp_front: number;
  temp_back: number;
  temp_cpu: number;
};