import express from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import Ticket from '../models/Ticket';

const router = express.Router();

// Book ticket
router.post('/book', async (req, res) => {
  try {
    const { userId, journey, totalFare } = req.body;
    
    const ticketId = uuidv4();
    const qrCodeData = `TICKET:${ticketId}:${journey.fromStop}-${journey.toStop}`;
    
    const qrCode = await QRCode.toDataURL(qrCodeData);
    
    const ticket = new Ticket({
      userId,
      journey,
      qrCode,
      totalFare: totalFare || 100,
      status: 'booked'
    });
    
    await ticket.save();
    
    res.json({ success: true, ticketId: ticket._id, qrCode });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get user tickets
router.get('/my-tickets/:userId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId })
      .sort({ bookingTime: -1 })
      .limit(10);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

