import express from 'express';

const router = express.Router();

// Mock analytics from ETL
router.get('/busiest-routes', (req, res) => {
  res.json({
    data: [
      { route: '1A Airport Express', trips: 145, avgDelay: 4.2 },
      { route: '2B ISBT-CP', trips: 89, avgDelay: 2.8 },
      { route: '10C South Ex', trips: 67, avgDelay: 6.1 }
    ],
    peakHour: '17:00-18:00',
    totalEvents: 1240
  });
});

router.get('/delays', (req, res) => {
  res.json({
    avgDelay: 4.5,
    routesWithDelays: [
      { route: '1A', delay: 5.2 },
      { route: '747', delay: 8.1 }
    ]
  });
});

export default router;

