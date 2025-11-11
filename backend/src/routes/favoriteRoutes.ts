import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// Get all favorites
router.get('/', async (req: Request, res: Response) => {
  try {
    // In production, filter by user ID from authentication
    const favoritesSnapshot = await db.collection('favorites').get();
    const favorites = favoritesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add favorite
router.post('/', async (req: Request, res: Response) => {
  try {
    const { fromStop, toStop } = req.body;

    if (!fromStop || !toStop) {
      return res.status(400).json({ error: 'From and to stops are required' });
    }

    const favoriteData = {
      userId: 'user_1', // In production, get from authentication
      fromStop,
      toStop,
      createdAt: new Date(),
    };

    const docRef = await db.collection('favorites').add(favoriteData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...favoriteData },
      message: 'Favorite added successfully',
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Delete favorite
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.collection('favorites').doc(id).delete();

    res.json({
      success: true,
      message: 'Favorite removed successfully',
    });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

export default router;
