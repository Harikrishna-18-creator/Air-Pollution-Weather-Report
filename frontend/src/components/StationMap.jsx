import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

const createCustomIcon = (aqi, color) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background-color: ${color}; 
        width: 38px; 
        height: 38px; 
        border-radius: 50%; 
        border: 2px solid white; 
        box-shadow: 0 0 16px ${color}; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        font-weight: 800; 
        font-size: 11px;
        font-family: monospace;
      ">
        ${aqi}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
};

export default function StationMap({ stations, selectedStation, onSelectStation }) {
  const delhiCenter = [28.6139, 77.2090];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            Interactive Spatial Monitoring Grid • Delhi NCR
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Click any station marker to select location and inspect real-time Coupled AQI & Meteorological readings.
          </p>
        </div>
        
        {/* AQI Color Legend */}
        <div className="hidden lg:flex items-center space-x-2 text-[10px] font-semibold bg-gray-900/80 px-3 py-1.5 rounded-xl border border-gray-800">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Good</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span> Mod</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span> Poor</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]"></span> Very Poor</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#881337]"></span> Severe</span>
        </div>
      </div>

      <div className="h-[420px] rounded-xl overflow-hidden border border-gray-800 shadow-2xl relative">
        <MapContainer 
          center={delhiCenter} 
          zoom={10} 
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {stations.map(st => {
            const isSelected = st.id === selectedStation;
            return (
              <Marker 
                key={st.id} 
                position={[st.lat, st.lng]}
                icon={createCustomIcon(st.current_aqi, st.risk_color)}
                eventHandlers={{
                  click: () => onSelectStation(st.id),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="bg-gray-900 text-white p-3 rounded-lg min-w-[200px]">
                    <div className="text-xs font-bold text-cyan-400">{st.name}</div>
                    <div className="text-[10px] text-gray-400 mb-2">{st.station_type}</div>
                    <div className="flex items-baseline justify-between border-t border-gray-800 pt-2">
                      <span className="text-xs text-gray-300">AQI Level:</span>
                      <span className="text-sm font-extrabold font-mono" style={{ color: st.risk_color }}>{st.current_aqi} ({st.risk_level})</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xs text-gray-300">PM2.5:</span>
                      <span className="text-xs font-bold text-gray-100 font-mono">{st.current_pm25} µg/m³</span>
                    </div>
                    <button 
                      onClick={() => onSelectStation(st.id)}
                      className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold py-1 px-2 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3 h-3" /> Select Station
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
