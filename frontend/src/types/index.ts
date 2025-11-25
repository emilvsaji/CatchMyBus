// Firebase Types
export interface BusStop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  district: string;
  createdAt: Date;
}

export interface Bus {
  id: string;
  busNumber: string;
  busName: string;
  type: 'KSRTC' | 'Private' | 'Fast' | 'Super Fast' | 'Ordinary';
  route: string[];
  timings: BusTiming[];
  fare?: number;
  createdAt: Date;
  from?: string; // Optional: starting stop
  to?: string; // Optional: ending stop
}

export interface BusTiming {
  stopId: string;
  stopName: string;
  arrivalTime: string;
  departureTime: string;
  dayOfWeek?: string[];
}

export interface Route {
  id: string;
  fromStop: string;
  toStop: string;
  buses: Bus[];
  distance: number;
  estimatedTime: number;
}

export interface UserFavorite {
  id: string;
  userId: string;
  fromStop: string;
  toStop: string;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  userId?: string;
  busId: string;
  message: string;
  type: 'timing' | 'route' | 'other';
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

// Component Types
export interface SearchFormData {
  from: string;
  to: string;
  date?: string;
  busType?: string;
}

export interface BusResult {
  bus: Bus;
  fromTiming: BusTiming;
  toTiming: BusTiming;
  distance: number;
  estimatedTime: number;
  fare: number;
  partial?: boolean; // Flag for partial matches
  timingSource?: 'actual' | 'estimated'; // Source of timing data
  requestedFrom?: string; // User's search origin
  requestedTo?: string; // User's search destination
  requestedTime?: string; // User's search time
}
