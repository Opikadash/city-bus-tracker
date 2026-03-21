import { Schema, model, models, Model } from 'mongoose';

export interface ITicket {
  userId: string;
  journey: {
    fromStop: string;
    toStop: string;
    routes: string[];
    totalFare: number;
    departureTime: Date;
  };
  qrCode: string;
  status: 'booked' | 'used' | 'cancelled';
  bookingTime: Date;
}

const ticketSchema = new Schema<ITicket>({
  userId: { type: String, ref: 'User', required: true },
  journey: {
    fromStop: String,
    toStop: String,
    routes: [String],
    totalFare: Number,
    departureTime: Date
  },
  qrCode: { type: String, required: true },
  status: { type: String, enum: ['booked', 'used', 'cancelled'], default: 'booked' },
  bookingTime: { type: Date, default: Date.now }
});

const Ticket = models.Ticket || model<ITicket>('Ticket', ticketSchema);

export default Ticket as Model<ITicket>;

