import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CurrentAQICard from './components/CurrentAQICard';
import StationMap from './components/StationMap';
import ForecastChart from './components/ForecastChart';
import WeatherCoupling from './components/WeatherCoupling';
import WhatIfSimulator from './components/WhatIfSimulator';
import SHAPExplainer from './components/SHAPExplainer';
import ModelLeaderboard from './components/ModelLeaderboard';
import AlertBanner from './components/AlertBanner';

import { fetchStations, fetchLiveAQI, fetchForecast } from './services/api';

export default function App() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('delhi_anand_vihar');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [liveData, setLiveData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [activeModel, setActiveModel] = useState('XGBoost');

  useEffect(() => {
    fetchStations().then(data => {
      setStations(data);
      if (data.length > 0) {
        setSelectedStation(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchLiveAQI(selectedStation).then(setLiveData);
      fetchForecast(selectedStation, activeModel).then(setForecastData);
    }
  }, [selectedStation, activeModel]);

  const handleSelectModel = (modelName) => {
    setActiveModel(modelName);
    fetchForecast(selectedStation, modelName).then(setForecastData);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Header 
        stations={stations}
        selectedStation={selectedStation}
        onSelectStation={setSelectedStation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Alerts top banner */}
        <AlertBanner />

        {/* Tab 1: Dashboard Overview */}
        {(activeTab === 'dashboard' || activeTab === 'forecast') && (
          <>
            <CurrentAQICard liveData={liveData} />
            <ForecastChart 
              forecastData={forecastData} 
              activeModel={activeModel} 
              onSelectModel={handleSelectModel} 
            />
            {activeTab === 'dashboard' && (
              <StationMap 
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
              />
            )}
          </>
        )}

        {/* Tab 2: GIS Map */}
        {activeTab === 'map' && (
          <>
            <StationMap 
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
            />
            <CurrentAQICard liveData={liveData} />
          </>
        )}

        {/* Tab 3: Weather Coupling */}
        {activeTab === 'coupling' && (
          <WeatherCoupling liveData={liveData} />
        )}

        {/* Tab 4: What-If Simulator */}
        {activeTab === 'whatif' && (
          <WhatIfSimulator 
            selectedStation={selectedStation} 
            stations={stations} 
          />
        )}

        {/* Tab 5: Explainable AI */}
        {activeTab === 'explain' && (
          <SHAPExplainer selectedStation={selectedStation} />
        )}

        {/* Tab 6: Model Metrics */}
        {activeTab === 'leaderboard' && (
          <ModelLeaderboard />
        )}

        {/* Tab 7: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <CurrentAQICard liveData={liveData} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B0F19]/80 py-6 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-gray-300">VayuDrishti AI</span> • SIH 2026 Submission
          </div>
          <div className="text-gray-400 font-mono">
            Coupled Meteorology–AQI Engine • Scikit-Learn | XGBoost | FastAPI | React
          </div>
        </div>
      </footer>
    </div>
  );
}
