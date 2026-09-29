import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Sparkles, TrendingUp, Cpu, ShieldCheck } from 'lucide-react';

export default function ForecastChart({ forecastData, activeModel, onSelectModel }) {
  if (!forecastData) return null;

  const { station_name, current_pm25, forecasts, model_comparison } = forecastData;

  const modelsList = ["XGBoost", "Random Forest", "LSTM / Neural Net", "Linear Regression"];

  // Format chart data combining horizons
  const chartData = (forecasts || []).map(item => ({
    horizon: `+${item.horizon}`,
    timestamp: item.forecast_timestamp,
    "Predicted PM2.5": item.predicted_pm25,
    "Upper Bound": item.conf_high,
    "Lower Bound": item.conf_low,
    "AQI": item.predicted_aqi,
    risk_level: item.risk_level,
    risk_color: item.risk_color
  }));

  const maxForecast = Math.max(...chartData.map(d => d["Predicted PM2.5"]), current_pm25);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Multi-Horizon Coupled AI Forecast</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              +1h to +48h Horizons
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Predicting fine particulate trajectory for <span className="text-cyan-300 font-bold">{station_name}</span> based on coupled weather-dispersion vectors.
          </p>
        </div>

        {/* Model Selection Selector */}
        <div className="flex items-center space-x-1.5 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800 self-start md:self-auto overflow-x-auto">
          {modelsList.map(m => (
            <button
              key={m}
              onClick={() => onSelectModel(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeModel === m
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="horizon" stroke="#9CA3AF" fontSize={11} tickLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            <Area
              type="monotone"
              dataKey="Upper Bound"
              stroke="transparent"
              fill="url(#colorConfidence)"
            />
            <Area
              type="monotone"
              dataKey="Predicted PM2.5"
              stroke="#06B6D4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPM25)"
              activeDot={{ r: 7, fill: "#38BDF8", stroke: "#0B0F19", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 border-t border-white/5 pt-4">
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Current Baseline</div>
          <div className="text-base font-extrabold text-gray-100 font-mono mt-0.5">{current_pm25} µg/m³</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-bold uppercase">+6 Hours Peak</div>
          <div className="text-base font-extrabold text-cyan-400 font-mono mt-0.5">
            {chartData.find(d => d.horizon === '+6h')?.['Predicted PM2.5'] || current_pm25} µg/m³
          </div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800">
          <div className="text-[10px] text-gray-400 font-bold uppercase">Max Horizon Trend</div>
          <div className="text-base font-extrabold text-rose-400 font-mono mt-0.5">{maxForecast} µg/m³</div>
        </div>
        <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">Active AI Model</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{activeModel}</div>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <div className="font-extrabold text-cyan-400 flex items-center justify-between">
          <span>Horizon: {label}</span>
          <span className="text-[10px] font-normal text-gray-400 font-mono">{data.timestamp}</span>
        </div>
        <div className="text-gray-200">
          Predicted PM2.5: <span className="font-bold text-white font-mono">{data["Predicted PM2.5"]} µg/m³</span>
        </div>
        <div className="text-gray-300">
          Forecasted AQI: <span className="font-bold font-mono" style={{ color: data.risk_color }}>{data.AQI} ({data.risk_level})</span>
        </div>
        <div className="text-gray-400 text-[10px]">
          95% Conf Bounds: [{data["Lower Bound"]} - {data["Upper Bound"]}] µg/m³
        </div>
      </div>
    );
  }
  return null;
}
