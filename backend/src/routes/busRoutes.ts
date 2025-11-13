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

    // Fetch all buses
    const busesSnapshot = await db.collection('buses').get();
    const results: any[] = [];

    busesSnapshot.forEach((doc) => {
      const busData = doc.data();
      const bus: any = { id: doc.id, ...busData };
      
      // Check if bus type filter is applied
      if (type && type !== 'all' && bus.type !== type) {
        return;
      }

      // Check if bus route includes both stops
      const fromIndex = bus.route?.findIndex((stop: string) => 
        stop.toLowerCase().includes((from as string).toLowerCase())
      );
      const toIndex = bus.route?.findIndex((stop: string) => 
        stop.toLowerCase().includes((to as string).toLowerCase())
      );

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        // Mock data for timings - in production, fetch from database
        const fromTiming = {
          stopId: `stop_${fromIndex}`,
          stopName: bus.route[fromIndex],
          arrivalTime: '08:00 AM',
          departureTime: '08:05 AM',
        };

        const toTiming = {
          stopId: `stop_${toIndex}`,
          stopName: bus.route[toIndex],
          arrivalTime: '10:30 AM',
          departureTime: '10:35 AM',
        };

        // Calculate approximate values
        const distance = calculateDistance(fromIndex, toIndex);
        const estimatedTime = calculateTime(distance);
        const fare = calculateFare(distance, bus.type);

        results.push({
          bus,
          fromTiming,
          toTiming,
          distance,
          estimatedTime,
          fare,
        });
      }
    });

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
