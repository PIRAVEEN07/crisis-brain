import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertTriangle, Activity, Users, Building2 } from "lucide-react";

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons using divIcon for Tailwind styling and animations
const createCustomIcon = (colorClass: string, isPulsing: boolean = false) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        ${
          isPulsing
            ? `<span class="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${colorClass.replace(
                "bg-",
                "bg-"
              )}"></span>`
            : ""
        }
        <span class="relative inline-flex w-4 h-4 rounded-full border-2 border-black ${colorClass}"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const icons = {
  zoneA: createCustomIcon("bg-[#FF3D00]", true), // Red, Pulsing
  zoneB: createCustomIcon("bg-[#FF9100]"), // Orange
  zoneC: createCustomIcon("bg-[#FFEA00]"), // Yellow
  safe: createCustomIcon("bg-[#00E676]"), // Green
};

// We need a wrapper function because we can't call createCustomIcon before it's defined, but we can just define it above.
// Wait, let me fix the typo above: MapComponent_createCustomIcon -> createCustomIcon
function getIconForZone(zone: string) {
  switch (zone) {
    case "Zone A":
      return createCustomIcon("bg-[#FF3D00]", true);
    case "Zone B":
      return createCustomIcon("bg-[#FF9100]", false);
    case "Zone C":
      return createCustomIcon("bg-[#FFEA00]", false);
    default:
      return createCustomIcon("bg-[#00E676]", false);
  }
}

// Map Controller to handle programmatic zooming
function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
}

// Rough boundary for Tamil Nadu
const tamilNaduBoundary: [number, number][] = [
  [13.4, 80.3],
  [12.5, 80.1],
  [11.9, 79.8],
  [10.8, 79.8],
  [10.3, 79.3],
  [9.3, 79.2],
  [8.8, 78.2],
  [8.1, 77.5],
  [8.3, 77.1],
  [9.6, 77.3],
  [10.5, 77.0],
  [11.5, 76.3],
  [11.7, 76.6],
  [12.6, 77.8],
  [13.5, 79.5],
  [13.4, 80.3],
];

const cities = [
  {
    name: "Chennai",
    position: [13.0827, 80.2707] as [number, number],
    zone: "Zone A",
    severity: 92,
    sosCount: 1245,
    hospitalLoad: 98,
  },
  {
    name: "Cuddalore",
    position: [11.7480, 79.7714] as [number, number],
    zone: "Zone B",
    severity: 78,
    sosCount: 512,
    hospitalLoad: 85,
  },
  {
    name: "Nagapattinam",
    position: [10.7656, 79.8424] as [number, number],
    zone: "Zone B",
    severity: 72,
    sosCount: 432,
    hospitalLoad: 80,
  },
  {
    name: "Thoothukudi",
    position: [8.7642, 78.1348] as [number, number],
    zone: "Zone C",
    severity: 45,
    sosCount: 156,
    hospitalLoad: 65,
  },
  {
    name: "Coimbatore",
    position: [11.0168, 76.9558] as [number, number],
    zone: "Safe",
    severity: 15,
    sosCount: 23,
    hospitalLoad: 35,
  },
  {
    name: "Madurai",
    position: [9.9252, 78.1198] as [number, number],
    zone: "Safe",
    severity: 18,
    sosCount: 31,
    hospitalLoad: 38,
  },
  {
    name: "Trichy",
    position: [10.7905, 78.7047] as [number, number],
    zone: "Safe",
    severity: 20,
    sosCount: 45,
    hospitalLoad: 40,
  },
  {
    name: "Salem",
    position: [11.6643, 78.146] as [number, number],
    zone: "Safe",
    severity: 12,
    sosCount: 14,
    hospitalLoad: 30,
  },
];

export default function MapComponent() {
  const [viewState, setViewState] = useState<{
    center: [number, number];
    zoom: number;
    isTNSelected: boolean;
  }>({
    center: [20.5937, 78.9629], // India Center
    zoom: 5,
    isTNSelected: false,
  });

  const handleFocusTN = () => {
    setViewState({
      center: [11.1271, 78.6569], // TN Center
      zoom: 7,
      isTNSelected: true,
    });
  };

  const handleReset = () => {
    setViewState({
      center: [20.5937, 78.9629],
      zoom: 5,
      isTNSelected: false,
    });
  };

  return (
    <div className="w-full h-full relative bg-[#0A0A0A]">
      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 z-[400] bg-black/80 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg shadow-lg">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-1">
          Tactical Map
        </h3>
        <p className="text-[10px] text-gray-400 font-mono mb-3">
          Sector: {viewState.isTNSelected ? "Tamil Nadu" : "India Overview"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleFocusTN}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border transition-colors ${
              viewState.isTNSelected
                ? "bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF]"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Focus TN
          </button>
          <button
            onClick={handleReset}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded border transition-colors ${
              !viewState.isTNSelected
                ? "bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF]"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      <MapContainer
        center={viewState.center}
        zoom={viewState.zoom}
        zoomControl={true}
        className="w-full h-full z-0"
        style={{ background: "#0A0A0A" }}
      >
        <MapController center={viewState.center} zoom={viewState.zoom} />

        {/* Dark theme tiles without API key */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Tamil Nadu Boundary Highlight */}
        {viewState.isTNSelected && (
          <Polygon
            positions={tamilNaduBoundary}
            pathOptions={{
              color: "#00E5FF",
              fillColor: "#00E5FF",
              fillOpacity: 0.05,
              weight: 2,
              dashArray: "5, 10",
            }}
          />
        )}

        {/* City Markers */}
        {(viewState.isTNSelected ? cities : []).map((city) => (
          <Marker
            key={city.name}
            position={city.position}
            icon={getIconForZone(city.zone)}
          >
            <Popup className="custom-popup">
              <div className="bg-[#111] text-white p-1 min-w-[220px]">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <h4 className="font-bold text-sm tracking-wide">
                    {city.name}
                  </h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      city.zone === "Zone A"
                        ? "bg-[#FF3D00]/10 border-[#FF3D00]/30 text-[#FF3D00]"
                        : city.zone === "Zone B"
                          ? "bg-[#FF9100]/10 border-[#FF9100]/30 text-[#FF9100]"
                          : city.zone === "Zone C"
                            ? "bg-[#FFEA00]/10 border-[#FFEA00]/30 text-[#FFEA00]"
                            : "bg-[#00E676]/10 border-[#00E676]/30 text-[#00E676]"
                    }`}
                  >
                    {city.zone.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono uppercase">
                        Severity
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold ${city.severity > 75 ? "text-[#FF3D00]" : "text-white"}`}
                    >
                      {city.severity}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono uppercase">
                        SOS Count
                      </span>
                    </div>
                    <span className="text-xs font-mono text-white">
                      {city.sosCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono uppercase">
                        Hosp. Load
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono ${city.hospitalLoad > 90 ? "text-[#FF3D00]" : "text-white"}`}
                    >
                      {city.hospitalLoad}%
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
