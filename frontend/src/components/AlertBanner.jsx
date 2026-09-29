import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import { fetchAlerts } from '../services/api';

export default function AlertBanner() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts().then(setAlerts);
  }, []);

  if (!alerts.length) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-rose-400" />
        <h2 className="text-lg font-bold text-white">Smart Early Warning System</h2>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
          {alerts.length} Active Advisories
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map(alt => (
          <div key={alt.id} className="bg-gray-900/90 rounded-xl p-4 border border-rose-500/30 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white" style={{ backgroundColor: alt.severity_color }}>
                  {alt.severity}
                </span>
                <h3 className="text-sm font-extrabold text-white">{alt.title}</h3>
                <span className="text-xs font-mono text-gray-400">({alt.forecast_horizon})</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{alt.message}</p>
              
              <div className="pt-2">
                <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider mb-1">Recommended Emergency Response Actions:</div>
                <ul className="space-y-1">
                  {alt.suggested_actions.map((act, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-mono shrink-0">
              Generated: {alt.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
