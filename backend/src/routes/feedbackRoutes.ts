import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// Submit feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { busId, message, type } = req.body;

    if (!busId || !message || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const feedbackData = {
      userId: 'user_1', // In production, get from authentication
      busId,
      message,
      type,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await db.collection('feedback').add(feedbackData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...feedbackData },
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get all feedback (admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const feedbackSnapshot = await db.collection('feedback').get();
    const feedback = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Update feedback status (admin)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.collection('feedback').doc(id).update({ status });

    res.json({
      success: true,
      message: 'Feedback status updated successfully',
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

export default router;
