import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, CloudRain, ShieldAlert, Activity } from 'lucide-react';

export default function CurrentAQICard({ liveData }) {
  if (!liveData) return null;

  const {
    station_name,
    city,
    timestamp,
    aqi,
    risk_level,
    risk_color,
    pm25,
    pm10,
    no2,
    so2,
    co,
    o3,
    temperature,
    humidity,
    wind_speed,
    pressure,
    rainfall,
    health_advisory
  } = liveData;

  const pollutants = [
    { label: 'PM2.5', value: `${pm25} µg/m³`, status: pm25 > 120 ? 'Critical' : 'Moderate', color: 'text-rose-400' },
    { label: 'PM10', value: `${pm10} µg/m³`, status: pm10 > 250 ? 'High' : 'Normal', color: 'text-orange-400' },
    { label: 'NO₂', value: `${no2} µg/m³`, status: 'Normal', color: 'text-amber-400' },
    { label: 'SO₂', value: `${so2} µg/m³`, status: 'Normal', color: 'text-emerald-400' },
    { label: 'CO', value: `${co} mg/m³`, status: 'Normal', color: 'text-cyan-400' },
    { label: 'O₃', value: `${o3} µg/m³`, status: 'Normal', color: 'text-indigo-400' }
  ];

  const weatherItems = [
    { label: 'Temperature', value: `${temperature}°C`, icon: Thermometer, color: 'text-amber-400' },
    { label: 'Relative Humidity', value: `${humidity}%`, icon: Droplets, color: 'text-sky-400' },
    { label: 'Wind Speed', value: `${wind_speed} km/h`, icon: Wind, color: 'text-cyan-400' },
    { label: 'Pressure', value: `${pressure} hPa`, icon: Gauge, color: 'text-indigo-400' },
    { label: 'Precipitation', value: `${rainfall} mm`, icon: CloudRain, color: 'text-emerald-400' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      
      {/* Primary AQI Badge Card */}
      <div className="lg:col-span-5 glass-panel rounded-2xl p-6 relative overflow-hidden border border-white/10 flex flex-col justify-between">
        <div 
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: risk_color }}
        />
        
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Monitoring Node</span>
            <span className="text-xs font-mono text-gray-500">{timestamp}</span>
          </div>

          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>{station_name}</span>
          </h2>
          <p className="text-xs text-cyan-400/80 font-medium">{city} Monitoring Sector</p>

          <div className="mt-6 flex items-baseline gap-4">
            <div className="text-6xl font-black tracking-tight text-white font-mono">
              {aqi}
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">CPCB Index</div>
              <div 
                className="inline-block text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mt-1 text-white shadow-md"
                style={{ backgroundColor: risk_color }}
              >
                {risk_level}
              </div>
            </div>
          </div>
        </div>

        {/* Health Advisory Footer */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            {health_advisory}
          </p>
        </div>
      </div>

      {/* Pollutant Breakdown & Weather Grid */}
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pollutants Matrix */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Air Quality Pollutant Spectrum
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {pollutants.map((p, idx) => (
              <div key={idx} className="bg-gray-900/60 border border-gray-800 rounded-xl p-2.5 flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase">{p.label}</span>
                <span className={`text-sm font-extrabold mt-0.5 font-mono ${p.color}`}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coupled Meteorological Variables */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-400" />
              Coupled Weather Parameters
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {weatherItems.map((w, idx) => {
              const Icon = w.icon;
              return (
                <div key={idx} className="bg-gray-900/60 border border-gray-800 rounded-xl p-2.5 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white/5">
                    <Icon className={`w-4 h-4 ${w.color}`} />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">{w.label}</div>
                    <div className="text-xs font-bold font-mono text-gray-200">{w.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
