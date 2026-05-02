"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, Polygon, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Invisible icon for the label
const invisibleIcon = typeof window !== "undefined" ? L.divIcon({
  className: 'bg-transparent border-none',
  html: '',
  iconSize: [0, 0]
}) : null;

type MapInnerProps = {
  cluster: { green: number; amber: number; blue: number; red: number };
};

// Brgy. Salaza, Palauig, Zambales Coordinates
const center: [number, number] = [15.4542, 119.9553];

// Approximate boundary for Brgy. Salaza (Refined to stay South of Pangolingan)
const salazaBoundary: [number, number][] = [
  [15.466, 119.945], // North West
  [15.466, 119.980], // North East (Stay below Pangolingan)
  [15.455, 120.010], // Far East (Towards Mt. Tapulao)
  [15.435, 120.010], // South East
  [15.435, 119.970], // South
  [15.445, 119.945], // South West
];

export default function MapInner({ cluster }: MapInnerProps) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-container { background: #f8fafc !important; font-family: inherit; }
      .leaflet-popup-content-wrapper { border-radius: 12px; padding: 4px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
      .custom-brgy-label {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: var(--accent, #3C50E0) !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.2em !important;
        font-size: 10px !important;
        opacity: 0.6 !important;
        pointer-events: none !important;
      }
      .cluster-badge {
        background: white !important;
        border: 2px solid white !important;
        border-radius: 50% !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-weight: 800 !important;
        font-size: 12px !important;
        color: #1e293b !important;
      }
      .cluster-glow {
        border-radius: 50%;
        filter: blur(8px);
        opacity: 0.3;
        position: absolute;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomright" />
      
      {/* Elegant Barangay Territory */}
      <Polygon 
        positions={salazaBoundary}
        pathOptions={{ 
          color: 'var(--accent)', 
          fillColor: 'var(--accent)', 
          fillOpacity: 0.03, 
          weight: 1.5, 
          lineJoin: 'round'
        }}
      />


      {/* Modern District Clusters */}
      {[
        { pos: [15.460, 119.960] as [number, number], val: cluster.green, color: '#10b981' },
        { pos: [15.445, 119.975] as [number, number], val: cluster.red, color: '#f43f5e' },
        { pos: [15.450, 119.955] as [number, number], val: cluster.blue, color: '#3b82f6' },
      ].map((dist, i) => (
        <Marker 
          key={i} 
          position={dist.pos}
          icon={L.divIcon({
            className: '',
            html: `
              <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                <div class="cluster-glow" style="background: ${dist.color};"></div>
                <div class="cluster-badge" style="width: 28px; height: 28px; border-color: ${dist.color};">${dist.val}</div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })}
        />
      ))}

      {/* Subtle Resident Pins */}
      {[
        [15.458, 119.952],
        [15.452, 119.965],
        [15.448, 119.958],
        [15.455, 119.970],
      ].map((pos, i) => (
        <CircleMarker 
          key={i}
          center={pos as [number, number]} 
          radius={3} 
          pathOptions={{ 
            color: 'white', 
            fillColor: '#64748b', 
            fillOpacity: 0.8, 
            weight: 1 
          }}
        />
      ))}
    </MapContainer>
  );
}



