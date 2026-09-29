import React, { useState, useEffect } from 'react';
import { Layers, Award, CheckCircle, HelpCircle } from 'lucide-react';
import { fetchModelPerformance } from '../services/api';

export default function ModelLeaderboard() {
  const [benchmarks, setBenchmarks] = useState([]);

  useEffect(() => {
    fetchModelPerformance().then(setBenchmarks);
  }, []);

  if (!benchmarks.length) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Model Performance & Evaluation Leaderboard</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase tracking-wider">
              +6h PM2.5 Horizon
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Empirical validation metrics across Machine Learning models evaluated on historical Delhi NCR dataset.
          </p>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 bg-gray-900/60">
              <th className="py-3 px-4">Model Architecture</th>
              <th className="py-3 px-4">MAE (µg/m³)</th>
              <th className="py-3 px-4">RMSE (µg/m³)</th>
              <th className="py-3 px-4">R² Score</th>
              <th className="py-3 px-4">MAPE (%)</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-xs font-mono">
            {benchmarks.map((m, idx) => {
              const isBest = idx === 0;
              return (
                <tr key={m.model_name} className={`hover:bg-white/5 transition-colors ${isBest ? 'bg-cyan-950/20' : ''}`}>
                  <td className="py-3.5 px-4 font-bold text-gray-200 font-sans">
                    <div className="flex items-center space-x-2">
                      <span>{m.model_name}</span>
                      {isBest && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-400" /> BEST
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-400 font-normal font-sans mt-0.5">{m.description}</div>
                  </td>
                  <td className="py-3.5 px-4 text-cyan-300 font-bold">{m.mae}</td>
                  <td className="py-3.5 px-4 text-sky-300 font-bold">{m.rmse}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{m.r2}</td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">{m.mape}%</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
