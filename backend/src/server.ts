import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import plannerRouter from './routes/planner';
import trackingRouter from './routes/tracking';
import bookingRouter from './routes/booking';
import analyticsRouter from './routes/analytics';

dotenv.config({ path: '.env.auth0', override: true }); // Auth0 token

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citybus')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/planner', plannerRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io for real-time
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  // Join bus tracking room
  socket.on('join-bus', (busId: string) => {
    socket.join(`bus:${busId}`);
  });
  
  // Broadcast bus positions (simulated)
  setInterval(() => {
    const fakeBusData = {
      id: 'bus-123',
      lat: 28.6139 + Math.sin(Date.now() / 10000) * 0.01,
      lng: 77.2090 + Math.cos(Date.now() / 10000) * 0.01,
      speed: 35
    };
    io.emit('bus-update', fakeBusData);
  }, 5000);

  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

server.listen(Number(PORT), () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
});
export { io };

