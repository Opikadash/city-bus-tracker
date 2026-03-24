import express from 'express';
import Stripe from 'stripe';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import Ticket from '../models/Ticket';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

// Book ticket - create PaymentIntent
router.post('/book', async (req, res) => {
  try {
    const { userId, journey, totalFare } = req.body;
    
    const ticketId = uuidv4();
    const qrCodeData = `TICKET:${ticketId}:${journey.fromStop}-${journey.toStop}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);
    
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: (totalFare || 100) * 100,
      currency: 'inr',
      metadata: {
        userId,
        ticketId,
        journey: JSON.stringify(journey)
      }
    });
    
    // Save pending ticket
    const ticket = new Ticket({
      _id: ticketId,
      userId,
      journey,
      qrCode,
      totalFare: totalFare || 100,
      status: 'payment_pending',
      paymentIntentId: paymentIntent.id
    });
    await ticket.save();
    
    res.json({
      success: true,
      ticketId,
      qrCode,
      clientSecret: paymentIntent.client_secret
    });
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

