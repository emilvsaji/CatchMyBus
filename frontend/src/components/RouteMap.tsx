import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BusResult } from '../types';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  from: string;
  to: string;
  results: BusResult[];
}

// Default Kerala center coordinates
const KERALA_CENTER = { lat: 10.8505, lng: 76.2711 };

const RouteMap = ({ from, to, results }: RouteMapProps) => {
  // Mock coordinates for demonstration - in production, fetch from API
  const fromCoords = { lat: 8.5241, lng: 76.9366 }; // Thiruvananthapuram
  const toCoords = { lat: 9.9312, lng: 76.2673 }; // Kochi

  const busIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [32, 32],
  });

  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 bg-primary-600 text-white">
        <h3 className="font-semibold">Route Map</h3>
        <p className="text-sm opacity-90">{from} to {to}</p>
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={[KERALA_CENTER.lat, KERALA_CENTER.lng]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={[fromCoords.lat, fromCoords.lng]}>
            <Popup>
              <strong>{from}</strong><br />
              Starting Point
            </Popup>
          </Marker>

          <Marker position={[toCoords.lat, toCoords.lng]}>
            <Popup>
              <strong>{to}</strong><br />
              Destination
            </Popup>
          </Marker>

          <Polyline
            positions={[
              [fromCoords.lat, fromCoords.lng],
              [toCoords.lat, toCoords.lng],
            ]}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
