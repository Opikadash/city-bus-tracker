// Shared types between frontend and backend

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

export interface BusRoute {
  routeId: string;
  name: string;
  stops: string[];
  duration: number;
  distance: number;
  fare: number;
}

export interface JourneyPlan {
  path: string[];
  totalDuration: number;
  routesUsed: string[];
  totalFare: number;
}

export interface BusPosition {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  eta: string;
  route?: string;
}

export interface Ticket {
  _id: string;
  userId: string;
  journey: {
    fromStop: string;
    toStop: string;
    routes: string[];
    totalFare: number;
    departureTime: string;
  };
  qrCode: string;
  status: 'booked' | 'used' | 'cancelled';
  bookingTime: string;
}

export interface User {
  email: string;
  name: string;
  favorites: string[];
}

