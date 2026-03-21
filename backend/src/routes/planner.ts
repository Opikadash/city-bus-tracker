import express from 'express';
import fs from 'fs';
import * as pathModule from 'path';
import BusStop from '../models/BusStop';
import BusRoute from '../models/BusRoute';

const router = express.Router();

interface JourneyPlanRequest {
  fromStop: string;
  toStop: string;
  time?: string;
}

// Simple Dijkstra-like pathfinding using graph from stops/routes data
router.post('/plan-journey', async (req, res) => {
  try {
    const { fromStop, toStop }: JourneyPlanRequest = req.body;

    // Load JSON data
    const stopsData = JSON.parse(fs.readFileSync(pathModule.join(__dirname, '../../data/stops.json'), 'utf8'));
    const routesData = JSON.parse(fs.readFileSync(pathModule.join(__dirname, '../../data/routes.json'), 'utf8'));

    // Build graph: stopId -> connected stops with cost (duration)
    const graph: { [key: string]: { to: string, routeId: string, duration: number }[] } = {};
    routesData.forEach((route: any) => {
      for (let i = 0; i < route.stops.length - 1; i++) {
        const from = route.stops[i];
        const to = route.stops[i + 1];
        if (!graph[from]) graph[from] = [];
        graph[from].push({ to, routeId: route.routeId, duration: route.duration / route.stops.length });
        // Bidirectional for simplicity
        if (!graph[to]) graph[to] = [];
        graph[to].push({ to: from, routeId: route.routeId, duration: route.duration / route.stops.length });
      }
    });

    // Dijkstra
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: { to: string, routeId: string } } = {};
    const stops = Object.keys(graph);

    stops.forEach(stop => distances[stop] = Infinity);
    distances[fromStop!] = 0;

    while (stops.length > 0) {
      const current = stops.reduce((min, stop) => distances[stop] < distances[min] ? stop : min);
      stops.splice(stops.indexOf(current), 1);

      if (distances[current] === Infinity) break;

      graph[current || '']?.forEach(neighbor => {
        const alt = distances[current || ''] + neighbor.duration;
        if (alt < (distances[neighbor.to] || Infinity)) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = { to: current || '', routeId: neighbor.routeId };
        }
      });
    }

    // Reconstruct path
    const journeyPath: string[] = [];
    let currentStop = toStop;
    while (previous[currentStop || '']) {
      journeyPath.unshift(currentStop || '');
      currentStop = previous[currentStop || ''].to;
    }

    const plan = {
      path: journeyPath,
      totalDuration: distances[toStop || ''],
      routesUsed: journeyPath.map((_, i) => routesData.find((r: any) => r.stops.includes(journeyPath[i]) && r.stops.includes(journeyPath[i+1]))?.routeId),
      totalFare: 50  // TODO calculate
    };

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/stops', async (req, res) => {
  try {
    const stopsData = JSON.parse(fs.readFileSync(pathModule.join(__dirname, '../../data/stops.json'), 'utf8'));
    res.json(stopsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stops' });
  }
});

export default router;

