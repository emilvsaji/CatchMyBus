import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';

const router = Router();

// ─── POST /api/bus-requests — Submit a bus request (Authenticated users) ─────
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      busName,
      busNumber,
      from,
      via,
      to,
      type,
      route,
      timings,
      submittedBy,
      submittedByEmail,
      submittedByName,
      submittedByPhone,
    } = req.body;

    if (!busName || !from || !to || !type || !route || !timings) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const requestData = {
      busName: String(busName).toUpperCase().trim(),
      busNumber: busNumber ? String(busNumber).trim() : '',
      from: String(from).trim(),
      via: via ? String(via).trim() : '',
      to: String(to).trim(),
      type,
      route: Array.isArray(route) ? route.map((s: string) => String(s).trim()).filter(Boolean) : [String(route).trim()],
      timings: Array.isArray(timings) ? timings : [],
      submittedBy: submittedBy || 'anonymous',
      submittedByEmail: submittedByEmail || '',
      submittedByName: submittedByName ? String(submittedByName).trim() : '',
      submittedByPhone: submittedByPhone ? String(submittedByPhone).trim() : '',
      status: 'pending',
      createdAt: new Date(),
    };

    console.log('📝 New bus request received:', requestData.busName, 'by', requestData.submittedByEmail);
    const docRef = await db.collection('busRequests').add(requestData);

    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...requestData },
      message: 'Bus suggestion submitted for review',
    });
  } catch (error) {
    console.error('❌ Error submitting bus request:', error);
    res.status(500).json({
      error: 'Failed to submit bus suggestion',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ─── GET /api/bus-requests — List requests (Admin queue) ──────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const statusFilter = (req.query.status as string) || 'pending';
    let queryRef = db.collection('busRequests');

    const snapshot = await queryRef.get();
    let requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Filter by status if specified
    if (statusFilter && statusFilter !== 'all') {
      requests = requests.filter(r => r.status === statusFilter);
    }

    // Sort newest first
    requests.sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('❌ Error fetching bus requests:', error);
    res.status(500).json({ error: 'Failed to fetch bus requests' });
  }
});

// ─── PUT /api/bus-requests/:id/approve — Approve request & create live bus ────
router.put('/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminEmail, adminId } = req.body;

    const requestDoc = await db.collection('busRequests').doc(id).get();
    if (!requestDoc.exists) {
      return res.status(404).json({ error: 'Bus request not found' });
    }

    const reqData = requestDoc.data() as any;
    if (reqData.status === 'approved') {
      return res.status(400).json({ error: 'This request has already been approved' });
    }

    // 1. Build live bus data matching existing bus creation schema
    const busData = {
      busName: String(reqData.busName).toUpperCase().trim(),
      busNumber: reqData.busNumber || '',
      from: reqData.from,
      via: reqData.via || '',
      to: reqData.to,
      type: reqData.type,
      route: Array.isArray(reqData.route) ? reqData.route : [reqData.route],
      timings: Array.isArray(reqData.timings) ? reqData.timings : [],
      createdAt: new Date(),
      approvedFromRequestId: id,
    };

    // 2. Add to live 'buses' collection
    console.log('🚌 Approving bus request into live buses collection:', busData.busName);
    const newBusRef = await db.collection('buses').add(busData);

    // 3. Mark request as approved
    await db.collection('busRequests').doc(id).update({
      status: 'approved',
      approvedBusId: newBusRef.id,
      reviewedAt: new Date(),
      reviewedBy: adminEmail || adminId || 'admin',
    });

    res.json({
      success: true,
      message: 'Bus approved and published to live listings',
      data: { id: newBusRef.id, ...busData },
    });
  } catch (error) {
    console.error('❌ Error approving bus request:', error);
    res.status(500).json({ error: 'Failed to approve bus request' });
  }
});

// ─── PUT /api/bus-requests/:id/reject — Reject request (does not touch buses) ─
router.put('/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejectionReason, adminEmail, adminId } = req.body;

    const requestDoc = await db.collection('busRequests').doc(id).get();
    if (!requestDoc.exists) {
      return res.status(404).json({ error: 'Bus request not found' });
    }

    await db.collection('busRequests').doc(id).update({
      status: 'rejected',
      rejectionReason: rejectionReason || '',
      reviewedAt: new Date(),
      reviewedBy: adminEmail || adminId || 'admin',
    });

    res.json({
      success: true,
      message: 'Bus request marked as rejected',
    });
  } catch (error) {
    console.error('❌ Error rejecting bus request:', error);
    res.status(500).json({ error: 'Failed to reject bus request' });
  }
});

export default router;
