import axios from 'axios';

interface DistanceResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  success: boolean;
  error?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}


async function geocodeLocation(location: string): Promise<Coordinates | null> {
  try {
    const searchQuery = `${location}, Kerala, India`;
    
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchQuery,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'CatchMyBus/1.0', // Required by Nominatim
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      };
    }

    console.warn(`Geocoding failed for: ${location}`);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate travel time based on distance
 * Assumes average speed of 40 km/h for Kerala roads
 */
function estimateTravelTime(distanceKm: number): number {
  const averageSpeedKmh = 40; // Average bus speed in Kerala
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = Math.round(timeHours * 60);
  return timeMinutes;
}

/**
 * Calculate distance and duration between two locations using FREE services
 * Uses OpenStreetMap Nominatim for geocoding + Haversine formula
 * NO API KEY REQUIRED!
 */
export async function calculateRealDistance(
  origin: string,
  destination: string
): Promise<DistanceResult> {
  try {
    console.log(`🗺️  Calculating distance: ${origin} → ${destination}`);

    // Geocode both locations (free!)
    const [originCoords, destCoords] = await Promise.all([
      geocodeLocation(origin),
      geocodeLocation(destination),
    ]);

    if (!originCoords || !destCoords) {
      console.warn('⚠️  Geocoding failed, using fallback calculation');
      return {
        distance: Math.random() * 50 + 10,
        duration: Math.random() * 90 + 30,
        success: false,
        error: 'Geocoding failed',
      };
    }

    // Calculate straight-line distance
    const straightDistance = haversineDistance(originCoords, destCoords);
    
    // Add 25% for actual road distance (roads aren't straight lines)
    const roadDistance = parseFloat((straightDistance * 1.25).toFixed(2));
    
    // Estimate travel time
    const duration = estimateTravelTime(roadDistance);

    console.log(`✅ Distance calculated: ${roadDistance} km, ${duration} min`);

    return {
      distance: roadDistance,
      duration: duration,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error calculating distance:', error);
    return {
      distance: Math.random() * 50 + 10,
      duration: Math.random() * 90 + 30,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Calculate distance for a route with multiple stops
 */
export async function calculateRouteDistance(stops: string[]): Promise<DistanceResult> {
  if (stops.length < 2) {
    return {
      distance: 0,
      duration: 0,
      success: false,
      error: 'Need at least 2 stops',
    };
  }

  // Calculate cumulative distance for all segments
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const result = await calculateRealDistance(stops[i], stops[i + 1]);
    if (result.success) {
      totalDistance += result.distance;
      totalDuration += result.duration;
    }
  }

  return {
    distance: parseFloat(totalDistance.toFixed(2)),
    duration: Math.round(totalDuration),
    success: totalDistance > 0,
  };
}
