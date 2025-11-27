import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { calculateDistance, calculateFare, calculateTime } from '../utils/helpers';
import { calculateRealDistance } from '../utils/googleMaps';

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

    // Parse time param (default to current time)
    const timeParam = (req.query.time as string) || '';
    const parseTimeToMinutes = (t: string) => {
      if (!t) return null;
      t = t.trim();
      // Accept HH:MM (24h) or HH:MM AM/PM
      const ampmMatch = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (ampmMatch) {
        let h = parseInt(ampmMatch[1], 10);
        const m = parseInt(ampmMatch[2], 10);
        const ampm = ampmMatch[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      }
      const hmMatch = t.match(/^(\d{1,2}):(\d{2})$/);
      if (hmMatch) {
        const h = parseInt(hmMatch[1], 10);
        const m = parseInt(hmMatch[2], 10);
        return h * 60 + m;
      }
      // ISO time fallback
      const iso = Date.parse(t as string);
      if (!isNaN(iso)) {
        const dt = new Date(iso);
        return dt.getHours() * 60 + dt.getMinutes();
      }
      return null;
    };

    const now = new Date();
    const defaultMinutes = now.getHours() * 60 + now.getMinutes();
    const requestedMinutes = parseTimeToMinutes(timeParam) ?? defaultMinutes;

    // Helper to convert minutes-of-day to human-friendly time string
    const minutesToTimeString = (mins: number) => {
      const m = ((Math.round(mins) % 1440) + 1440) % 1440;
      const h = Math.floor(m / 60);
      const mm = m % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hh = ((h % 12) === 0) ? 12 : (h % 12);
      return `${hh}:${String(mm).padStart(2, '0')} ${ampm}`;
    };

    // Fetch all buses
    const busesSnapshot = await db.collection('buses').get();
    console.log(`Total buses in DB: ${busesSnapshot.size}`);
    const results: any[] = [];

    // We'll collect time-aware candidates so we can pick buses at/after requested time
    const timeCandidates: Array<{result: any; departMinutes?: number; absDiff?: number}> = [];
    const showAll = String(req.query.showAll || '').toLowerCase() === 'true';

    for (const doc of busesSnapshot.docs) {
      const busData = doc.data();
      const bus: any = { id: doc.id, ...busData };
      console.log(`\n[Bus: ${doc.id}] busName='${bus.busName}' from='${bus.from}' to='${bus.to}' type='${bus.type}'`);
      console.log(`  Raw route:`, bus.route);

      // Check if bus type filter is applied
      if (type && type !== 'all' && bus.type !== type) {
        console.log(`  ❌ Type mismatch: ${bus.type} !== ${type}`);
        continue;
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
        console.log(`  ✅ Route contains both stops`);
        // Enforce direction: only match if 'from' appears before 'to' in the route
        if (qFrom === qTo) {
          // same-stop query is allowed
          console.log(`  Same-stop query; treating as valid match at index ${fromIndex}`);
        } else if (fromIndex > toIndex) {
          // Found both stops but in reverse order -> not a match for this direction
          console.log(`  ❌ Stops found but in reverse order (fromIndex=${fromIndex} > toIndex=${toIndex}); skipping`);
          // Do not consider this a match for the user's requested direction
          continue;
        }

        // At this point 'fromIndex' <= 'toIndex' (or same-stop). Use them as aIndex/bIndex
        const aIndex = Math.min(fromIndex, toIndex);
        const bIndex = Math.max(fromIndex, toIndex);

        // Get actual stop names for distance calculation
        const fromStopName = routeArray[aIndex] || bus.route[aIndex] || '';
        const toStopName = routeArray[bIndex] || bus.route[bIndex] || '';
        
        // Calculate real distance using free geocoding + haversine
        const realDistance = await calculateRealDistance(fromStopName, toStopName);
        const distance = realDistance.success ? realDistance.distance : calculateDistance(aIndex, bIndex);
        const estimatedTime = realDistance.success ? realDistance.duration : calculateTime(distance);
        const fare = calculateFare(distance, bus.type);

        // Try to use provided timings on the bus document if available
        let fromTiming: any = null;
        let toTiming: any = null;
        let usedProvidedTimings = false;
        if (Array.isArray(bus.timings)) {
          // Normalize timings and support legacy `{ stop, time }` entries by
          // mapping `time` -> `arrivalTime`/`departureTime` when missing.
          const normalizedTimings = (bus.timings as any[]).map(t => {
            const stopName = t.stopName || t.stop || '';
            const arrival = t.arrivalTime || t.time || t.departureTime || '';
            const departure = t.departureTime || t.time || t.arrivalTime || '';
            return { ...t, stopName, arrivalTime: arrival, departureTime: departure, _n: normalize(stopName) };
          });
          const matchFrom = normalizedTimings.find(t => t._n.includes(qFrom) || qFrom.includes(t._n));
          const matchTo = normalizedTimings.find(t => t._n.includes(qTo) || qTo.includes(t._n));
          if (matchFrom) fromTiming = matchFrom;
          if (matchTo) toTiming = matchTo;
          if (matchFrom && matchTo) usedProvidedTimings = true;
        }

        // Fallback to provided or estimated timings
        const minutesToTimeString = (mins: number) => {
          const m = ((Math.round(mins) % 1440) + 1440) % 1440;
          const h = Math.floor(m / 60);
          const mm = m % 60;
          const ampm = h >= 12 ? 'PM' : 'AM';
          const hh = ((h % 12) === 0) ? 12 : (h % 12);
          return `${hh}:${String(mm).padStart(2, '0')} ${ampm}`;
        };

        if (!fromTiming) {
          // If no provided timing, estimate using requested time as the from departure
          const dep = requestedMinutes;
          fromTiming = {
            stopId: `stop_${aIndex}`,
            stopName: fromStopName,
            arrivalTime: minutesToTimeString(dep),
            departureTime: minutesToTimeString(dep + 5),
          };
        }
        if (!toTiming) {
          // Estimate arrival at destination as requested + estimatedTime
          const arr = requestedMinutes + (typeof estimatedTime === 'number' ? estimatedTime : 0);
          toTiming = {
            stopId: `stop_${bIndex}`,
            stopName: toStopName,
            arrivalTime: minutesToTimeString(arr),
            departureTime: minutesToTimeString(arr + 5),
          };
        }

        // If time filtering is requested, parse the bus departure time at the from stop
        const parseTimeField = (tstr: string) => parseTimeToMinutes(tstr as string);

        // Treat placeholder times like '00', '00:00', '00AM' as missing data and do NOT consider them
        const rawDepartStr = String(fromTiming.departureTime || fromTiming.arrivalTime || fromTiming.time || '').trim();
        const isPlaceholderTime = (s: string) => {
          if (!s) return true;
          const norm = s.replace(/\s+/g, '').toLowerCase();
          // matches '00', '0:00', '00:00', optionally with am/pm like '00am'
          return /^0{1,2}(:0{2})?(am|pm)?$/.test(norm);
        };

        const departMinutes = !isPlaceholderTime(rawDepartStr)
          ? (parseTimeField(fromTiming.departureTime) ?? parseTimeField(fromTiming.arrivalTime) ?? parseTimeField(fromTiming.time) ?? null)
          : null;

        const timingSource = usedProvidedTimings ? 'provided' : 'estimated';
        const resultObj = {
          bus,
          fromTiming,
          toTiming,
          distance,
          estimatedTime,
          fare,
          timingSource,
          // Echo the user's query so frontend can display what was searched
          requestedFrom: (from as string) || '',
          requestedTo: (to as string) || '',
          requestedTime: minutesToTimeString(requestedMinutes),
        };

        // Ensure we always have a textual departure/arrival time on the result (avoid TBD in UI)
        if (!fromTiming.departureTime && fromTiming.arrivalTime) {
          fromTiming.departureTime = fromTiming.arrivalTime;
        }
        if (!toTiming.arrivalTime && toTiming.departureTime) {
          toTiming.arrivalTime = toTiming.departureTime;
        }

        if (departMinutes !== null) {
          const diff = departMinutes - requestedMinutes; // positive => after requested
          timeCandidates.push({ result: resultObj, departMinutes, absDiff: Math.abs(diff) });
        } else {
          // No concrete timing for this bus (or placeholder like '00'); still push to results as fallback
          results.push(resultObj);
        }
        continue; // matched by route, continue to next bus
      }
      // If we reach here, route match failed for this bus (or didn't satisfy direction)
      // For strict two-stop searches (both 'from' and 'to' provided) we do NOT return partial matches.
      // If you want partial matches in the future, consider adding a `partial=true` query param.
      console.log(`  No valid directional route match for this bus; skipping partial matches for strict from->to search.`);

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

        results.push({
          bus,
          fromTiming,
          toTiming,
          distance,
          estimatedTime,
          fare,
          requestedFrom: (from as string) || '',
          requestedTo: (to as string) || '',
          requestedTime: minutesToTimeString(requestedMinutes),
        });
        continue;
      }
      console.log(`  ❌ No match for this bus`);
    }

    console.log(`\n=== SEARCH END === Found ${results.length} result(s)\n`);

    // If we collected time candidates, prefer exact-time matches when the user supplied a time;
    // otherwise fall back to closest-by-time or the previous top-3 behavior when no time param
    if (timeCandidates.length > 0) {
      if (showAll) {
        // Return all directional matches sorted by departure time (earliest first)
        const withDepart = timeCandidates
          .filter(tc => typeof tc.departMinutes === 'number')
          .sort((a, b) => (a.departMinutes! - b.departMinutes!))
          .map(tc => tc.result);
        // Append any non-timed results afterwards, dedup by bus id
        const allResults = [...withDepart, ...results];
        const seen = new Set();
        const deduped = allResults.filter(r => {
          const id = r.bus?.id || JSON.stringify(r.bus);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        console.log(`\n=== SEARCH END === Returning ${deduped.length} time-filtered (showAll) result(s)\n`);
        return res.json({ success: true, data: deduped, count: deduped.length });
      }

      const timeParamProvided = !!timeParam && timeParam.trim() !== '';

      if (timeParamProvided) {
        // First try to return all buses that depart exactly at the requested time
        const exact = timeCandidates
          .filter(tc => typeof tc.departMinutes === 'number' && tc.departMinutes === requestedMinutes)
          .sort((a, b) => (a.departMinutes! - b.departMinutes!))
          .map(tc => tc.result);

        if (exact.length > 0) {
          const merged = [...exact, ...results];
          const seen = new Set();
          const deduped = merged.filter(r => {
            const id = r.bus?.id || JSON.stringify(r.bus);
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
          console.log(`\n=== SEARCH END === Returning ${deduped.length} exact-time result(s)\n`);
          return res.json({ success: true, data: deduped, count: deduped.length });
        }

        // No exact matches — return all buses sorted by closeness to requested time
        const sortedByCloseness = timeCandidates
          .slice()
          .sort((a, b) => (a.absDiff! - b.absDiff!))
          .map(tc => tc.result);

        const merged = [...sortedByCloseness, ...results];
        const seen = new Set();
        const deduped = merged.filter(r => {
          const id = r.bus?.id || JSON.stringify(r.bus);
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        console.log(`\n=== SEARCH END === No exact matches — returning ${deduped.length} closest-by-time result(s)\n`);
        return res.json({ success: true, data: deduped, count: deduped.length });
      }

      // No explicit time requested — keep previous top-3 behavior (prefer at-or-after, else nearest)
      const annotated = timeCandidates.map(tc => {
        const diff = (tc.departMinutes ?? 0) - requestedMinutes;
        return { ...tc, diff };
      });
      const atOrAfter = annotated.filter(a => a.diff >= 0).sort((x, y) => x.diff - y.diff);
      let chosen: any[] = [];
      if (atOrAfter.length > 0) {
        chosen = atOrAfter.map(a => a.result).slice(0, 3);
      } else {
        // No future buses — pick nearest by absolute diff
        const nearest = annotated.sort((x, y) => x.absDiff! - y.absDiff!).slice(0, 3);
        chosen = nearest.map(n => n.result);
      }

      // Merge chosen with any fallback results we added earlier (no timing), keeping chosen first
      const merged = [...chosen, ...results];
      // Deduplicate by bus id
      const seen = new Set();
      const deduped = merged.filter(r => {
        const id = r.bus?.id || JSON.stringify(r.bus);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      }).slice(0, 3); // return top-3 overall

      console.log(`\n=== SEARCH END === Returning ${deduped.length} time-filtered (top-3) result(s)\n`);
      // Detailed debug: print chosen buses and their departure minutes (if available)
      for (const r of deduped) {
        const id = r.bus?.id || JSON.stringify(r.bus);
        const candidate = timeCandidates.find(tc => (tc.result.bus?.id || JSON.stringify(tc.result.bus)) === id);
        const departMin = candidate?.departMinutes;
        console.log(`  -> Bus: ${r.bus?.busName || id} id=${id} departMinutes=${departMin ?? 'N/A'} departTime=${departMin != null ? minutesToTimeString(departMin) : 'N/A'}`);
      }
      return res.json({ success: true, data: deduped, count: deduped.length });
    }

    // Fallback: no time-aware candidates, sort by departureTime string if available
    results.sort((a, b) => (a.fromTiming?.departureTime || '').localeCompare(b.fromTiming?.departureTime || ''));

    res.json({ success: true, data: results, count: results.length });
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
