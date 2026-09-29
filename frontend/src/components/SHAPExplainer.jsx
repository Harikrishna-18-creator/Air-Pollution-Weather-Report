import React, { useState, useEffect } from 'react';
import { Cpu, HelpCircle, Layers, CheckCircle, Info } from 'lucide-react';
import { fetchSHAPExplanation } from '../services/api';

export default function SHAPExplainer({ selectedStation }) {
  const [shapData, setShapData] = useState(null);

  useEffect(() => {
    fetchSHAPExplanation(selectedStation).then(setShapData);
  }, [selectedStation]);

  if (!shapData) return null;

  const { station_name, baseline_pm25, predicted_pm25, features, summary_text } = shapData;

  const maxImpact = Math.max(...features.map(f => f.impact_pm25), 1.0);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Explainable AI (SHAP Insights)</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono uppercase tracking-wider">
              SHapley Additive exPlanations
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Deconstructing AI black-box predictions into exact feature attributions for <span className="text-cyan-300 font-bold">{station_name}</span>.
          </p>
        </div>

        <div className="bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 text-xs font-mono text-indigo-300 self-start md:self-auto">
          Predicted PM2.5: <span className="font-extrabold text-white">{predicted_pm25} µg/m³</span>
        </div>
      </div>

      {/* SHAP Waterfall / Feature Bar Chart */}
      <div className="bg-gray-900/80 rounded-xl p-5 border border-gray-800 mb-6 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 mb-4">
          Feature Contribution Waterfall (µg/m³ Attribution)
        </h3>

        {features.map((feat, idx) => {
          const widthPct = Math.min(100, Math.round((feat.impact_pm25 / maxImpact) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-200">{feat.feature_label}</span>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-gray-400 text-[10px]">{feat.value}</span>
                  <span className="font-extrabold text-indigo-300">+{feat.impact_pm25} µg/m³</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden flex items-center">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Explanation Box */}
      <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">AI Transparency Summary</h4>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            {summary_text}
          </p>
        </div>
      </div>

    </div>
  );
}
