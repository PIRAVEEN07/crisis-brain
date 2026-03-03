import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polygon,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { AlertTriangle } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Global coordinates
const center = {
  lat: 20.0,
  lng: 0.0,
};

// Mock zones (Global)
const zones = [
  {
    id: "zone-a",
    name: "Zone A (Critical - Hurricane)",
    paths: [
      { lat: 30, lng: -70 },
      { lat: 20, lng: -60 },
      { lat: 10, lng: -75 },
      { lat: 20, lng: -85 },
    ],
    options: {
      fillColor: "#FF3D00",
      fillOpacity: 0.35,
      strokeColor: "#FF3D00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    },
    stats: {
      population: "2,500,000",
      sosDensity: "High (120/km²)",
      infraRisk: "85%",
      hospitalLoad: "98%",
    },
  },
  {
    id: "zone-b",
    name: "Zone B (High Risk - Seismic)",
    paths: [
      { lat: 45, lng: 145 },
      { lat: 30, lng: 145 },
      { lat: 30, lng: 130 },
      { lat: 45, lng: 130 },
    ],
    options: {
      fillColor: "#FF9100",
      fillOpacity: 0.35,
      strokeColor: "#FF9100",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    },
    stats: {
      population: "8,210,000",
      sosDensity: "Medium (45/km²)",
      infraRisk: "60%",
      hospitalLoad: "82%",
    },
  },
  {
    id: "zone-c",
    name: "Zone C (Moderate - Flood)",
    paths: [
      { lat: 25, lng: 95 },
      { lat: 15, lng: 95 },
      { lat: 15, lng: 80 },
      { lat: 25, lng: 80 },
    ],
    options: {
      fillColor: "#FFEA00",
      fillOpacity: 0.25,
      strokeColor: "#FFEA00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    },
    stats: {
      population: "15,095,000",
      sosDensity: "Low (12/km²)",
      infraRisk: "30%",
      hospitalLoad: "45%",
    },
  },
  {
    id: "zone-safe",
    name: "Safe Zone (Monitored)",
    paths: [
      { lat: 60, lng: 20 },
      { lat: 50, lng: 20 },
      { lat: 50, lng: 5 },
      { lat: 60, lng: 5 },
    ],
    options: {
      fillColor: "#00E676",
      fillOpacity: 0.2,
      strokeColor: "#00E676",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    },
    stats: {
      population: "4,320,000",
      sosDensity: "Minimal",
      infraRisk: "5%",
      hospitalLoad: "20%",
    },
  },
];

const markers = [
  { id: 1, position: { lat: 22, lng: -82 }, type: "sos" },
  { id: 2, position: { lat: 18, lng: -72 }, type: "sos" },
  { id: 3, position: { lat: 35, lng: 139 }, type: "sos" },
  { id: 4, position: { lat: 38, lng: 141 }, type: "sos" },
  { id: 5, position: { lat: 22, lng: 88 }, type: "sos" },
  { id: 6, position: { lat: 19, lng: 73 }, type: "sos" },
];

// Dark mode map styles
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1b1b1b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

export default function MapComponent() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasValidKey = apiKey && apiKey !== "YOUR_GOOGLE_MAPS_API_KEY";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  const [map, setMap] = useState(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [infoWindowPos, setInfoWindowPos] = useState<any>(null);

  const onLoad = useCallback(function callback(map: any) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleZoneClick = (e: any, zone: any) => {
    setSelectedZone(zone);
    setInfoWindowPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  if (!hasValidKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-white font-mono text-sm p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-[#FF3D00] mb-4" />
        <h3 className="text-lg font-bold text-[#FF3D00] mb-2 uppercase tracking-widest">Map Offline</h3>
        <p className="text-gray-400 max-w-md">
          Google Maps API Key is missing or invalid. Please configure <span className="text-[#00E5FF]">VITE_GOOGLE_MAPS_API_KEY</span> in the AI Studio Secrets panel to enable the tactical map.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 text-white font-mono text-sm p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-[#FF3D00] mb-4" />
        <h3 className="text-lg font-bold text-[#FF3D00] mb-2 uppercase tracking-widest">Map Load Error</h3>
        <p className="text-gray-400 max-w-md">
          Failed to load Google Maps. Please check your API key and network connection.
        </p>
      </div>
    );
  }

  if (!isLoaded)
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/50 text-white font-mono text-sm">
        Initializing Geospatial Interface...
      </div>
    );

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg pointer-events-none">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
          Tactical Map
        </h3>
        <p className="text-[10px] text-gray-400 font-mono">
          Sector: Global Overview
        </p>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={2}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {zones.map((zone) => (
          <Polygon
            key={zone.id}
            paths={zone.paths}
            options={zone.options}
            onClick={(e) => handleZoneClick(e, zone)}
          />
        ))}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#FF3D00",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        ))}

        {selectedZone && infoWindowPos && (
          <InfoWindow
            position={infoWindowPos}
            onCloseClick={() => {
              setSelectedZone(null);
              setInfoWindowPos(null);
            }}
          >
            <div className="bg-[#111] text-white p-3 rounded border border-white/10 min-w-[200px]">
              <h4
                className="font-bold text-sm mb-2 border-b border-white/10 pb-1"
                style={{ color: selectedZone.options.fillColor }}
              >
                {selectedZone.name}
              </h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pop. Affected:</span>
                  <span>{selectedZone.stats.population}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SOS Density:</span>
                  <span>{selectedZone.stats.sosDensity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Infra Risk:</span>
                  <span
                    className={
                      parseInt(selectedZone.stats.infraRisk) > 70
                        ? "text-[#FF3D00]"
                        : ""
                    }
                  >
                    {selectedZone.stats.infraRisk}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hospital Load:</span>
                  <span
                    className={
                      parseInt(selectedZone.stats.hospitalLoad) > 90
                        ? "text-[#FF3D00]"
                        : ""
                    }
                  >
                    {selectedZone.stats.hospitalLoad}
                  </span>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
