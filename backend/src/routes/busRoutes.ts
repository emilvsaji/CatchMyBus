import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { calculateDistance, calculateFare, calculateTime } from '../utils/helpers';

const router = Router();

// Search buses between two stops
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { from, to, type } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'From and to parameters are required' });
    }

    // Normalize helper to improve matching robustness
    const normalize = (s: string) => (s || '').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    const qFrom = normalize(from as string);
    const qTo = normalize(to as string);
    console.log(`\n=== SEARCH START === Query: from='${from}' (normalized='${qFrom}') to='${to}' (normalized='${qTo}') type='${type}'`);

    // Fetch all buses
    const busesSnapshot = await db.collection('buses').get();
    console.log(`Total buses in DB: ${busesSnapshot.size}`);
    const results: any[] = [];

    busesSnapshot.forEach((doc) => {
      const busData = doc.data();
      const bus: any = { id: doc.id, ...busData };
      console.log(`\n[Bus: ${doc.id}] busName='${bus.busName}' from='${bus.from}' to='${bus.to}' type='${bus.type}'`);
      console.log(`  Raw route:`, bus.route);

      // Check if bus type filter is applied
      if (type && type !== 'all' && bus.type !== type) {
        console.log(`  ❌ Type mismatch: ${bus.type} !== ${type}`);
        return;
      }

      // Build a normalized array of stop strings from bus.route
      const rawRoute = bus.route;
      let routeArray: string[] = [];
      if (Array.isArray(rawRoute)) {
        routeArray = rawRoute.map((s: any) => {
          if (typeof s === 'string') return s;
          if (typeof s === 'object' && s !== null) return s?.name || s?.stopName || s?.stop || '';
          return String(s);
        }).filter(Boolean);
      } else if (typeof rawRoute === 'string') {
        routeArray = rawRoute.split(/\s*[-–→> ,|]+\s*/).filter(Boolean);
      }
      
      // Include bus.from and bus.to as valid stops if they exist and aren't already in routeArray
      if (bus.from && !routeArray.some(s => normalize(s) === normalize(bus.from))) {
        routeArray.unshift(bus.from); // Add to start
      }
      if (bus.to && !routeArray.some(s => normalize(s) === normalize(bus.to))) {
        routeArray.push(bus.to); // Add to end
      }
      
      console.log(`  Processed routeArray: [${routeArray.join(' | ')}]`);
      const normalizedRoute = routeArray.map(normalize);
      console.log(`  Normalized route: [${normalizedRoute.join(' | ')}]`);

      // If no route entries, still allow fallback on bus.from/bus.to
      const hasRoute = routeArray.length > 0;

      // Find indexes by comparing normalized stop names
      let fromIndex = -1;
      let toIndex = -1;
      if (hasRoute) {
        // If user searched the same stop for from & to (e.g. d -> d), treat it as a single-stop query
        if (qFrom === qTo) {
          fromIndex = normalizedRoute.findIndex((nstop) => nstop.includes(qFrom) || qFrom.includes(nstop));
          toIndex = fromIndex;
          console.log(`  Same-stop query detected. index=${fromIndex}`);
        } else {
          fromIndex = normalizedRoute.findIndex((nstop) => nstop.includes(qFrom) || qFrom.includes(nstop));
          toIndex = normalizedRoute.findIndex((nstop) => nstop.includes(qTo) || qTo.includes(nstop));
          console.log(`  Route search: qFrom='${qFrom}' → fromIndex=${fromIndex}, qTo='${qTo}' → toIndex=${toIndex}`);
        }
      }

      if (fromIndex !== -1 && toIndex !== -1) {
        console.log(`  ✅ Route match found!`);
        // If indexes are in reverse order, swap them so timings reflect requested direction
        let aIndex = fromIndex;
        let bIndex = toIndex;
        let reversed = false;
        if (fromIndex > toIndex) {
          aIndex = toIndex;
          bIndex = fromIndex;
          reversed = true;
        }

        // Mock data for timings - in production, fetch from database
        const fromTiming = {
          stopId: `stop_${aIndex}`,
          stopName: routeArray[aIndex] || bus.route[aIndex] || '',
          arrivalTime: '08:00 AM',
          departureTime: '08:05 AM',
        };

        const toTiming = {
          stopId: `stop_${bIndex}`,
          stopName: routeArray[bIndex] || bus.route[bIndex] || '',
          arrivalTime: '10:30 AM',
          departureTime: '10:35 AM',
        };

        // Calculate approximate values
        const distance = calculateDistance(aIndex, bIndex);
        const estimatedTime = calculateTime(distance);
        const fare = calculateFare(distance, bus.type);

        // If the original query was reversed (fromIndex > toIndex), swap timings to match query
        if (reversed) {
          results.push({ bus, fromTiming: toTiming, toTiming: fromTiming, distance, estimatedTime, fare });
        } else {
          results.push({ bus, fromTiming, toTiming, distance, estimatedTime, fare });
        }
        return; // matched by route, continue to next bus
      }

      // If route match failed, still try to find at least one of the stops in the route
      // This allows partial matches (e.g., bus goes through one of the requested stops)
      console.log(`  Route match failed (need both stops). Checking for partial matches...`);
      if (hasRoute && (fromIndex !== -1 || toIndex !== -1)) {
        // At least one stop was found in the route, but not both
        // We'll return a partial match so the UI can surface buses that pass through one of the requested stops.
        console.log(`  ⚠️  Partial match: fromIndex=${fromIndex}, toIndex=${toIndex}`);

        const matchIndex = fromIndex !== -1 ? fromIndex : toIndex;

        // Try to pick a neighboring stop to form a small segment for ETA/fare estimation
        let neighborIndex = matchIndex;
        if (fromIndex !== -1 && toIndex === -1) {
          neighborIndex = Math.min(matchIndex + 1, routeArray.length - 1);
        } else if (toIndex !== -1 && fromIndex === -1) {
          neighborIndex = Math.max(matchIndex - 1, 0);
        }

        const fromTiming = {
          stopId: `stop_${matchIndex}`,
          stopName: routeArray[matchIndex] || '',
          arrivalTime: '08:00 AM',
          departureTime: '08:05 AM',
        };

        const toTiming = {
          stopId: `stop_${neighborIndex}`,
          stopName: routeArray[neighborIndex] || routeArray[matchIndex] || '',
          arrivalTime: '08:30 AM',
          departureTime: '08:35 AM',
        };

        const a = Math.min(matchIndex, neighborIndex);
        const b = Math.max(matchIndex, neighborIndex);
        const distance = calculateDistance(a, b);
        const estimatedTime = calculateTime(distance);
        const fare = calculateFare(distance, bus.type);

        results.push({ bus, fromTiming, toTiming, distance, estimatedTime, fare, partial: true });
        return;
      }

      // Fallback: match using bus.from and bus.to fields (useful when route array is not representative)
      // BUT: first try using the first and last stops from the route if available
      let fallbackFrom = bus.from || '';
      let fallbackTo = bus.to || '';
      if (hasRoute && routeArray.length >= 2) {
        fallbackFrom = routeArray[0];
        fallbackTo = routeArray[routeArray.length - 1];
      }
      const busFromField = normalize(fallbackFrom);
      const busToField = normalize(fallbackTo);
      console.log(`  Route match failed. Trying fallback: fallbackFrom='${fallbackFrom}' (normalized='${busFromField}') fallbackTo='${fallbackTo}' (normalized='${busToField}')`);
      const isSameQuery = qFrom === qTo;
      if ((isSameQuery && (busFromField.includes(qFrom) || busToField.includes(qFrom))) || (!isSameQuery && busFromField.includes(qFrom) && busToField.includes(qTo))) {
        console.log(`  ✅ Fallback match found!`);
        // Create fall-back timings using start/end
        const fromTiming = {
          stopId: `from_field`,
          stopName: fallbackFrom,
          arrivalTime: '08:00 AM',
          departureTime: '08:05 AM',
        };
        const toTiming = {
          stopId: `to_field`,
          stopName: fallbackTo,
          arrivalTime: '10:30 AM',
          departureTime: '10:35 AM',
        };

        const distance = calculateDistance(0, 1);
        const estimatedTime = calculateTime(distance);
        const fare = calculateFare(distance, bus.type);

        results.push({ bus, fromTiming, toTiming, distance, estimatedTime, fare });
        return;
      }
      console.log(`  ❌ No match for this bus`);
    });

    console.log(`\n=== SEARCH END === Found ${results.length} result(s)\n`);

    // Sort by departure time (mock implementation)
    results.sort((a, b) => a.fromTiming.departureTime.localeCompare(b.fromTiming.departureTime));

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching buses:', error);
    res.status(500).json({ error: 'Failed to search buses' });
  }
});

// Get all bus stops
router.get('/stops', async (req: Request, res: Response) => {
  try {
    const stopsSnapshot = await db.collection('stops').get();
    const stops = stopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: stops,
    });
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

// Get nearby stops (mock implementation)
router.get('/stops/nearby', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // In production, implement geospatial queries
    const stopsSnapshot = await db.collection('stops').limit(10).get();
    const stops = stopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: stops,
    });
  } catch (error) {
    console.error('Error fetching nearby stops:', error);
    res.status(500).json({ error: 'Failed to fetch nearby stops' });
  }
});

export default router;
