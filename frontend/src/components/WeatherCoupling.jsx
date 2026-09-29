import React from 'react';
import { Wind, Droplets, Thermometer, CloudRain, Flame, ArrowDownRight, ArrowUpRight, Zap } from 'lucide-react';

export default function WeatherCoupling({ liveData }) {
  if (!liveData) return null;

  const { wind_speed, humidity, temperature, rainfall, pm25 } = liveData;

  // Calculate dispersion indices based on physics
  const windDispersionPct = Math.min(100, Math.round((wind_speed / 15.0) * 100));
  const humidityTrappingPct = Math.min(100, Math.round((humidity / 100.0) * 100));
  const tempInversionIndex = Math.min(100, Math.round(Math.max(0, (30.0 - temperature) * 3.5)));

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6">
      <div className="flex items-center space-x-2 mb-2">
        <Wind className="w-5 h-5 text-sky-400" />
        <h2 className="text-lg font-bold text-white">Weather-Pollution Coupling Dynamics</h2>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        The ML model treats weather variables as intrinsic predictors. Stagnant wind speeds combined with high humidity create atmospheric boundary layer trapping of fine particulates.
      </p>

      {/* Physics Coupled Meter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Wind Dispersion Index */}
        <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" /> Horizontal Ventilation
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">{wind_speed} km/h</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Dispersion Efficiency</span>
                <span className="font-mono">{windDispersionPct}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${windDispersionPct}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            {wind_speed < 5.0 ? "⚠️ Low wind velocity limits ventilation, allowing local accumulation of PM2.5 emissions." : "✓ Adequate wind speed promoting ventilation dispersion."}
          </p>
        </div>

        {/* Relative Humidity Trapping */}
        <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> Secondary Aerosol Trapping
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">{humidity}%</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Hygroscopic Growth Index</span>
                <span className="font-mono">{humidityTrappingPct}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 via-amber-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${humidityTrappingPct}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            {humidity > 70 ? "💧 High ambient moisture triggers secondary aerosol formation, multiplying particle mass concentration." : "✓ Low moisture prevents secondary chemical particle condensation."}
          </p>
        </div>

        {/* Thermal Boundary Layer Inversion */}
        <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" /> Boundary Layer Compression
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">{temperature}°C</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Inversion Risk Index</span>
                <span className="font-mono">{tempInversionIndex}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tempInversionIndex}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
            {temperature < 20.0 ? "❄️ Cooler temperatures lower planetary boundary layer height, trapping smoke near ground level." : "✓ Warm ambient temperatures expand vertical boundary layer height."}
          </p>
        </div>

      </div>

      {/* Coupled Scientific Summary */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/20 rounded-xl p-4 flex items-start gap-3">
        <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">Coupled AI Vector Explanation</h3>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            Unlike standard AQI apps that display weather separately, VayuDrishti AI feeds these exact physical interaction terms (<span className="font-mono text-cyan-300">Wind⁻¹ × Humidity × PM2.5_Lag</span>) into the ML model pipeline to predict future atmospheric dispersion or stagnation episodes across Delhi NCR.
          </p>
        </div>
      </div>
    </div>
  );
}
