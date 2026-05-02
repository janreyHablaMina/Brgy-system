"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, Polygon, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

import { SALAZA_CENTER, SALAZA_BOUNDARY, MOCK_DISTRICTS, MOCK_RESIDENT_PINS } from "../constants/map-constants";

// Invisible icon for the label
const invisibleIcon = typeof window !== "undefined" ? L.divIcon({
  className: 'bg-transparent border-none',
  html: '',
  iconSize: [0, 0]
}) : null;

type MapInnerProps = {
  cluster: { green: number; amber: number; blue: number; red: number };
};

export default function MapInner({ cluster }: MapInnerProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Set initial dark mode state on client
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-container { background: var(--background) !important; font-family: inherit; }
      .leaflet-popup-content-wrapper { border-radius: 12px; padding: 4px; background: var(--card); color: var(--text); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border: 1px solid var(--border); }
      .cluster-badge {
        background: var(--card) !important;
        border: 2px solid var(--card) !important;
        border-radius: 50% !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-weight: 800 !important;
        font-size: 12px !important;
        color: var(--text) !important;
      }
      .cluster-glow {
        border-radius: 50%;
        filter: blur(8px);
        opacity: 0.3;
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .leaflet-control-zoom-in, .leaflet-control-zoom-out {
        background-color: var(--card) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <MapContainer
      center={SALAZA_CENTER}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; CARTO'
        url={isDark 
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        }
      />
      <ZoomControl position="bottomright" />
      
      {/* Elegant Barangay Territory */}
      <Polygon 
        positions={SALAZA_BOUNDARY}
        pathOptions={{ 
          color: 'var(--accent)', 
          fillColor: 'var(--accent)', 
          fillOpacity: 0.03, 
          weight: 1.5, 
          lineJoin: 'round'
        }}
      />

      {/* Modern District Clusters */}
      {MOCK_DISTRICTS.map((dist, i) => {
        // Map color to value from props
        let val = 0;
        if (dist.color === '#10b981') val = cluster.green;
        if (dist.color === '#f43f5e') val = cluster.red;
        if (dist.color === '#3b82f6') val = cluster.blue;

        return (
          <Marker 
            key={i} 
            position={dist.pos}
            icon={L.divIcon({
              className: '',
              html: `
                <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                  <div class="cluster-glow" style="background: ${dist.color};"></div>
                  <div class="cluster-badge" style="width: 28px; height: 28px; border-color: ${dist.color};">${val}</div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
          />
        );
      })}

      {/* Subtle Resident Pins */}
      {MOCK_RESIDENT_PINS.map((pos, i) => (
        <CircleMarker 
          key={i}
          center={pos} 
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



