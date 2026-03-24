import express from 'express';
import { uploadBusData } from '../services/s3Service';

const router = express.Router();

// Get current position of specific bus
router.get('/bus/:busId', async (req, res) => {
  const { busId } = req.params;
  // Simulated real-time data
  const busPosition = {
    id: busId,
    lat: 28.6139 + Math.random() * 0.05,
    lng: 77.2090 + Math.random() * 0.05,
    speed: 25 + Math.random() * 20,
    eta: new Date(Date.now() + Math.random() * 300000).toISOString(),
    route: '1A'
  };
  
  // Upload to S3 cloud storage
  try {
    const s3Key = await uploadBusData({
      ...busPosition,
      busId,
      timestamp: new Date().toISOString(),
      source: 'tracking-api'
    });
    console.log(`S3 stored: ${s3Key}`);
  } catch (error) {
    console.error('S3 upload failed:', error);
  }
  
  res.json(busPosition);
});

// Get buses on specific route
router.get('/route/:routeId/buses', async (req, res) => {
  const routeId = req.params.routeId;
  const buses = Array.from({ length: 4 }, (_, i) => ({
    id: `bus-${routeId}-${i + 1}`,
    lat: 28.6 + i * 0.01,
    lng: 77.2 + i * 0.005,
    speed: 30,
    etaNextStop: `${5 + i * 2} min`
  }));
  
  // Upload route buses to S3
  try {
    await Promise.all(buses.map(bus => uploadBusData({
      ...bus,
      routeId,
      timestamp: new Date().toISOString(),
      source: 'route-api'
    })));
    console.log(`S3 stored route ${routeId} buses`);
  } catch (error) {
    console.error('S3 batch upload failed:', error);
  }
  
  res.json(buses);
});

export default router;

