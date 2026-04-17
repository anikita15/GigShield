import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

// Schematic TopoJSON for India (lightweight)
const INDIA_TOPO_URL = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapVisual = ({ users = [] }) => {
  // Demo coordinates for India regions
  const mapData = users.map(u => {
      // Default to central India if no location
      let coordinates = [78.9629, 20.5937]; 
      
      // Hardcoded demo coordinates for visual impact
      if (u.name.includes("Shivam")) coordinates = [77.1025, 28.7041]; // Delhi
      if (u.name.includes("Fraud")) coordinates = [72.8777, 19.0760]; // Mumbai
      if (u.name.includes("High-Risk")) coordinates = [80.2707, 13.0827]; // Chennai
      if (u.name.includes("Suspicious")) coordinates = [88.3639, 22.5726]; // Kolkata

      return { ...u, coordinates };
  });

  return (
    <div className="w-full h-full bg-[#05080f] rounded-2xl border border-slate-800/50 overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Fleet Pulse</h3>
        <p className="text-xs text-white font-medium">Regional Coverage: 98.4%</p>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 450,
          center: [80, 22] // Centered on India
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={INDIA_TOPO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#0D121F"
                stroke="#1E293B"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#1e293b", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {mapData.map(({ name, coordinates, trustScore, hasFraud }) => (
          <Marker key={name} coordinates={coordinates}>
            <g transform="translate(-12, -12)">
              {/* Pulse effect for risk/fraud */}
              {hasFraud && (
                <circle r="12" cx="12" cy="12" fill="none" stroke="#F43F5E" strokeWidth="2">
                  <animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                </circle>
              )}
              
              <circle 
                cx="12" 
                cy="12" 
                r="6" 
                fill={hasFraud ? "#F43F5E" : (trustScore > 0.8 ? "#10B981" : "#F59E0B")} 
                className="shadow-lg"
              />
              
              {/* Label that shows on hover */}
              <text
                textAnchor="middle"
                y="-10"
                x="12"
                style={{ fontFamily: "Outfit", fontSize: "8px", fill: "#94A3B8", fontWeight: "bold" }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {name}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-[#0D121F]/80 backdrop-blur-md p-3 rounded-xl border border-white/5">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald" />
            <span className="text-[8px] text-slate-400 font-bold uppercase">Optimal</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[8px] text-slate-400 font-bold uppercase">Moderate Risk</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[8px] text-slate-400 font-bold uppercase">Fraud Intercept</span>
         </div>
      </div>
    </div>
  );
};

export default MapVisual;
