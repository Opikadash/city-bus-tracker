import express from 'express';

const router = express.Router();

// Get current position of specific bus
router.get('/bus/:busId', (req, res) => {
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
  res.json(busPosition);
});

// Get buses on specific route
router.get('/route/:routeId/buses', (req, res) => {
  const buses = Array.from({ length: 4 }, (_, i) => ({
    id: `bus-${req.params.routeId}-${i + 1}`,
    lat: 28.6 + i * 0.01,
    lng: 77.2 + i * 0.005,
    speed: 30,
    etaNextStop: `${5 + i * 2} min`
  }));
  res.json(buses);
});

export default router;

