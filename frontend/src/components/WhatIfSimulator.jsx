import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, Zap, Wind, Droplets, Thermometer, Flame, ArrowRight, Info } from 'lucide-react';
import { simulateWhatIf } from '../services/api';

export default function WhatIfSimulator({ selectedStation, stations }) {
  const [windChange, setWindChange] = useState(-30);
  const [humidityChange, setHumidityChange] = useState(20);
  const [tempChange, setTempChange] = useState(-4);
  const [stubbleMult, setStubbleMult] = useState(1.5);

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const stationObj = stations.find(s => s.id === selectedStation) || stations[0];

  const handleRunSimulation = async () => {
    setLoading(true);
    const res = await simulateWhatIf({
      station_id: selectedStation,
      wind_speed_change_pct: Number(windChange),
      humidity_change_pct: Number(humidityChange),
      temp_change_deg: Number(tempChange),
      stubble_burning_factor: Number(stubbleMult)
    });
    setSimResult(res);
    setLoading(false);
  };

  useEffect(() => {
    handleRunSimulation();
  }, [selectedStation, windChange, humidityChange, tempChange, stubbleMult]);

  const handleReset = () => {
    setWindChange(0);
    setHumidityChange(0);
    setTempChange(0);
    setStubbleMult(1.0);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">"What-If" Pollution Forecasting Lab</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono uppercase tracking-wider">
              SIH Feature Highlight
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Simulate hypothetical weather shifts & stubble burning events for <span className="text-cyan-300 font-bold">{stationObj.name}</span> to quantify dynamic AI model predictions.
          </p>
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 transition-colors self-start md:self-auto border border-gray-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders Input Panel */}
        <div className="lg:col-span-6 bg-gray-900/80 rounded-xl p-5 border border-gray-800 space-y-5">
          
          {/* Slider 1: Wind Speed */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-bold text-gray-200 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" /> Wind Speed Shift (%)
              </label>
              <span className={`font-mono font-bold ${windChange < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {windChange > 0 ? `+${windChange}%` : `${windChange}%`}
              </span>
            </div>
            <input 
              type="range" 
              min="-60" 
              max="60" 
              value={windChange} 
              onChange={(e) => setWindChange(e.target.value)}
              className="w-full accent-cyan-400 bg-gray-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>-60% (Stagnant drop)</span>
              <span>Baseline (0%)</span>
              <span>+60% (High dispersion)</span>
            </div>
          </div>

          {/* Slider 2: Relative Humidity */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-bold text-gray-200 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> Humidity Shift (%)
              </label>
              <span className={`font-mono font-bold ${humidityChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {humidityChange > 0 ? `+${humidityChange}%` : `${humidityChange}%`}
              </span>
            </div>
            <input 
              type="range" 
              min="-40" 
              max="40" 
              value={humidityChange} 
              onChange={(e) => setHumidityChange(e.target.value)}
              className="w-full accent-sky-400 bg-gray-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>-40% Dry Air</span>
              <span>Baseline (0%)</span>
              <span>+40% High Moisture</span>
            </div>
          </div>

          {/* Slider 3: Temperature Delta */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-bold text-gray-200 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" /> Temperature Shift (°C)
              </label>
              <span className={`font-mono font-bold ${tempChange < 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                {tempChange > 0 ? `+${tempChange}°C` : `${tempChange}°C`}
              </span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="10" 
              value={tempChange} 
              onChange={(e) => setTempChange(e.target.value)}
              className="w-full accent-amber-400 bg-gray-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>-10°C Winter Drop</span>
              <span>Baseline (0°C)</span>
              <span>+10°C Warm Rise</span>
            </div>
          </div>

          {/* Slider 4: Stubble Burning Biomass Multiplier */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="font-bold text-gray-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" /> Stubble Burning Emission Multiplier
              </label>
              <span className="font-mono font-bold text-rose-400">
                {stubbleMult}x
              </span>
            </div>
            <input 
              type="range" 
              min="1.0" 
              max="3.0" 
              step="0.1"
              value={stubbleMult} 
              onChange={(e) => setStubbleMult(e.target.value)}
              className="w-full accent-rose-500 bg-gray-800 rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>1.0x (Normal)</span>
              <span>2.0x (Moderate Smoke)</span>
              <span>3.0x (Severe Harvest Smoke)</span>
            </div>
          </div>

        </div>

        {/* Live Simulation Output Card */}
        {simResult && (
          <div className="lg:col-span-6 bg-gray-900/90 rounded-xl p-5 border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Recalibrated AI Forecast</span>
                <span className="text-xs font-mono text-gray-400">6-Hour Horizon</span>
              </div>

              {/* Baseline vs Simulated Comparison */}
              <div className="grid grid-cols-2 gap-4 my-5">
                <div className="bg-gray-800/60 p-3.5 rounded-xl border border-gray-700/60">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Baseline PM2.5</span>
                  <div className="text-2xl font-black text-gray-200 font-mono mt-1">
                    {simResult.baseline_pm25} <span className="text-xs text-gray-400">µg/m³</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">AQI {simResult.baseline_aqi} ({simResult.baseline_risk})</div>
                </div>

                <div className="bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-500/40">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">Simulated PM2.5</span>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1 flex items-baseline gap-2">
                    <span>{simResult.simulated_pm25}</span>
                    <span className={`text-xs font-bold ${simResult.delta_pm25 >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {simResult.delta_pm25 >= 0 ? `+${simResult.delta_pm25}` : simResult.delta_pm25}
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-300 mt-1">AQI {simResult.simulated_aqi} ({simResult.simulated_risk})</div>
                </div>
              </div>

              {/* Weather Explanation */}
              <div className="bg-gray-800/80 p-3.5 rounded-xl border border-gray-700 text-xs text-gray-300 space-y-2">
                <div className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Physics & AI Recalibration Impact
                </div>
                <p className="leading-relaxed text-gray-300">{simResult.weather_explanation}</p>
                <ul className="space-y-1.5 pt-2 border-t border-gray-700/60">
                  {simResult.contributing_factors.map((factor, idx) => (
                    <li key={idx} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                      <span>•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-400 flex items-center justify-between">
              <span>Decision Support Engine • SIH 2026</span>
              <span className="text-cyan-400 font-mono">XGBoost Scenario Predictor</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
