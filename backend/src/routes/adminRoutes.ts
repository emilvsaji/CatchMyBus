import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// Add new bus
router.post('/buses', async (req: Request, res: Response) => {
  try {
    console.log('📝 Received bus data:', req.body);
    
    const { busNumber, busName, type, route } = req.body;

    if (!busNumber || !busName || !type || !route) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const busData = {
      busNumber,
      busName,
      type,
      route: Array.isArray(route) ? route : [route],
      timings: [],
      createdAt: new Date(),
    };

    console.log('💾 Attempting to save bus to Firestore:', busData);
    const docRef = await db.collection('buses').add(busData);
    console.log('✅ Bus saved successfully with ID:', docRef.id);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...busData },
      message: 'Bus added successfully',
    });
  } catch (error) {
    console.error('❌ Error adding bus:', error);
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to add bus',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add new bus stop
router.post('/stops', async (req: Request, res: Response) => {
  try {
    const { name, district, location } = req.body;

    if (!name || !district || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const stopData = {
      name,
      district,
      location: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      },
      createdAt: new Date(),
    };

    const docRef = await db.collection('stops').add(stopData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...stopData },
      message: 'Bus stop added successfully',
    });
  } catch (error) {
    console.error('Error adding stop:', error);
    res.status(500).json({ error: 'Failed to add bus stop' });
  }
});

// Update bus
router.put('/buses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db.collection('buses').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Bus updated successfully',
    });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Failed to update bus' });
  }
});

// Delete bus
router.delete('/buses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.collection('buses').doc(id).delete();

    res.json({
      success: true,
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Failed to delete bus' });
  }
});

// Get all buses (for admin)
router.get('/buses', async (req: Request, res: Response) => {
  try {
    const busesSnapshot = await db.collection('buses').get();
    const buses = busesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: buses,
    });
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

export default router;
