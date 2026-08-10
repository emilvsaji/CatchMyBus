import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { BusResult } from '../types';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Default icon (kept for Leaflet TS compatibility)
const _defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
void _defaultIcon;

// Custom SVG pin factory
const createPin = (color: string, label: string) =>
  L.divIcon({
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    html: `
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="${label}">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="6" fill="white"/>
      </svg>
    `,
  });

const ORIGIN_PIN = createPin('#1B7F4C', 'Origin');
const DEST_PIN   = createPin('#B3261E', 'Destination');
const STOP_PIN   = (n: number) =>
  L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="background:white;border:2px solid #0B2545;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#0B2545;">${n}</div>`,
  });

// Kerala location lookup
const KERALA_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  trivandrum:         { lat: 8.5241, lng: 76.9366 },
  kochi:              { lat: 9.9312, lng: 76.2673 },
  cochin:             { lat: 9.9312, lng: 76.2673 },
  kozhikode:          { lat: 11.2588, lng: 75.7804 },
  calicut:            { lat: 11.2588, lng: 75.7804 },
  thrissur:           { lat: 10.5276, lng: 76.2144 },
  kannur:             { lat: 11.8745, lng: 75.3704 },
  kollam:             { lat: 8.8932,  lng: 76.6141 },
  palakkad:           { lat: 10.7867, lng: 76.6548 },
  alappuzha:          { lat: 9.4981,  lng: 76.3388 },
  alleppey:           { lat: 9.4981,  lng: 76.3388 },
  malappuram:         { lat: 11.0510, lng: 76.0711 },
  kottayam:           { lat: 9.5916,  lng: 76.5222 },
  pala:               { lat: 9.7074,  lng: 76.6817 },
  erattupetta:        { lat: 9.6878,  lng: 76.7783 },
  ettumanoor:         { lat: 9.6878,  lng: 76.7783 },
  changanassery:      { lat: 9.4461,  lng: 76.5458 },
  tiruvalla:          { lat: 9.3833,  lng: 76.5745 },
  thalassery:         { lat: 11.7489, lng: 75.4899 },
  kasaragod:          { lat: 12.4996, lng: 74.9869 },
  wayanad:            { lat: 11.6854, lng: 76.1320 },
  attingal:           { lat: 8.6958,  lng: 76.8164 },
  varkala:            { lat: 8.7379,  lng: 76.7163 },
  neyyattinkara:      { lat: 8.4001,  lng: 77.0882 },
  perumbavoor:        { lat: 10.1167, lng: 76.4833 },
  muvattupuzha:       { lat: 9.9797,  lng: 76.5772 },
  kothamangalam:      { lat: 10.0572, lng: 76.6358 },
  angamaly:           { lat: 10.1914, lng: 76.3878 },
  aluva:              { lat: 10.1081, lng: 76.3528 },
};

const KERALA_CENTER = { lat: 10.8505, lng: 76.2711 };

const geocodeLocation = (location: string): { lat: number; lng: number } | null => {
  const norm = location.toLowerCase().trim();
  // Exact match first
  if (KERALA_LOCATIONS[norm]) return KERALA_LOCATIONS[norm];
  // Partial match
  const key = Object.keys(KERALA_LOCATIONS).find(k => norm.includes(k) || k.includes(norm));
  return key ? KERALA_LOCATIONS[key] : null;
};

interface RouteMapProps {
  from: string;
  to: string;
  results: BusResult[];
}

const RouteMap = ({ from, to, results }: RouteMapProps) => {
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [toCoords,   setToCoords]   = useState<{ lat: number; lng: number } | null>(null);
  const [routePoints, setRoutePoints] = useState<{ lat: number; lng: number }[]>([]);

  useEffect(() => {
    const fromLoc = geocodeLocation(from);
    const toLoc   = geocodeLocation(to);
    setFromCoords(fromLoc || { lat: KERALA_CENTER.lat - 0.5, lng: KERALA_CENTER.lng });
    setToCoords(  toLoc   || { lat: KERALA_CENTER.lat + 0.5, lng: KERALA_CENTER.lng });

    if (results.length > 0 && results[0].bus.route) {
      const points: { lat: number; lng: number }[] = [];
      for (const stopRaw of results[0].bus.route as any[]) {
        const stopName = (typeof stopRaw === 'string'
          ? stopRaw
          : stopRaw?.name || stopRaw?.stopName || stopRaw?.stop || '').trim();
        if (!stopName) continue;
        const coords = geocodeLocation(stopName);
        if (coords) points.push(coords);
      }
      setRoutePoints(points);
    }
  }, [from, to, results]);

  if (!fromCoords || !toCoords) {
    return (
      <div className="transit-card overflow-hidden">
        <div className="px-4 py-3 bg-navy-800 text-white">
          <p className="text-sm font-semibold">Route Map</p>
          <p className="text-xs text-white/60 mt-0.5">{from} → {to}</p>
        </div>
        <div className="h-64 flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">Loading map…</p>
          </div>
        </div>
      </div>
    );
  }

  const center: [number, number] = [
    (fromCoords.lat + toCoords.lat) / 2,
    (fromCoords.lng + toCoords.lng) / 2,
  ];

  const firstResult = results[0];

  return (
    <div className="transit-card overflow-hidden animate-fade-in">
      {/* Navy header strip */}
      <div className="px-4 py-3 bg-navy-800 text-white">
        <p className="text-sm font-semibold">Route Map</p>
        <p className="text-xs text-white/60 mt-0.5">{from} → {to}</p>
        {firstResult && (
          <p className="text-2xs text-white/40 mt-0.5">
            {firstResult.bus.busName}
            {firstResult.bus.busNumber ? ` · ${firstResult.bus.busNumber}` : ''}
          </p>
        )}
      </div>

      {/* Map */}
      <div className="map-muted" style={{ height: '380px', width: '100%' }}>
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Origin marker */}
          <Marker position={[fromCoords.lat, fromCoords.lng]} icon={ORIGIN_PIN}>
            <Popup>
              <div>
                <strong className="text-[#1B7F4C]">{from}</strong>
                <br />
                <span className="text-xs text-neutral-500">Starting point</span>
              </div>
            </Popup>
          </Marker>

          {/* Destination marker */}
          <Marker position={[toCoords.lat, toCoords.lng]} icon={DEST_PIN}>
            <Popup>
              <div>
                <strong className="text-[#B3261E]">{to}</strong>
                <br />
                <span className="text-xs text-neutral-500">Destination</span>
              </div>
            </Popup>
          </Marker>

          {/* Route polyline */}
          {routePoints.length > 0 ? (
            <Polyline
              positions={routePoints.map(p => [p.lat, p.lng])}
              color="#0B2545"
              weight={3}
              opacity={0.8}
              dashArray="8, 5"
            />
          ) : (
            <Polyline
              positions={[
                [fromCoords.lat, fromCoords.lng],
                [toCoords.lat,   toCoords.lng],
              ]}
              color="#0B2545"
              weight={3}
              opacity={0.7}
            />
          )}

          {/* Intermediate stop markers */}
          {routePoints.map((point, idx) => (
            <Marker key={idx} position={[point.lat, point.lng]} icon={STOP_PIN(idx + 1)}>
              <Popup>
                <span className="text-xs font-medium">Stop {idx + 1}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
