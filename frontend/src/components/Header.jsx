import React from 'react';
import { Wind, MapPin, Activity, Sparkles, AlertTriangle, Cpu, HelpCircle, Layers, Sliders } from 'lucide-react';

export default function Header({ stations, selectedStation, onSelectStation, activeTab, setActiveTab }) {
  const currentStationObj = stations.find(s => s.id === selectedStation) || stations[0];

  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'map', label: 'GIS Map', icon: MapPin },
    { id: 'forecast', label: 'AI Forecast', icon: Sparkles },
    { id: 'coupling', label: 'Weather Coupling', icon: Wind },
    { id: 'whatif', label: 'What-If Lab', icon: Sliders },
    { id: 'explain', label: 'Explainable AI', icon: Cpu },
    { id: 'leaderboard', label: 'Model Metrics', icon: Layers },
    { id: 'alerts', label: 'Early Warnings', icon: AlertTriangle }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Wind className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  VayuDrishti AI
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 tracking-wide uppercase">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Air Pollution–Weather Coupled Forecasting Engine • Delhi NCR Focus
              </p>
            </div>
          </div>

          {/* Station Switcher & Clock */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-2 bg-gray-900/80 border border-gray-700/60 rounded-xl px-3 py-1.5 shadow-inner">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <select 
                value={selectedStation} 
                onChange={(e) => onSelectStation(e.target.value)}
                className="bg-transparent text-sm text-gray-200 font-semibold focus:outline-none cursor-pointer pr-2"
              >
                {stations.map(st => (
                  <option key={st.id} value={st.id} className="bg-gray-900 text-gray-200">
                    {st.name} ({st.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-cyan-300/80 bg-cyan-950/40 border border-cyan-500/20 rounded-xl px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE • CPCB / IMD SYNC</span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 mt-4 overflow-x-auto pb-1 scrollbar-none border-t border-white/5 pt-2">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
