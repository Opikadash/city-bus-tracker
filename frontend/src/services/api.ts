import axios from 'axios'
import { BusStop, JourneyPlan, Ticket } from 'shared/types'

// Base API client with default config
const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : '/api',
  timeout: 10000
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const apiClient = {
  // Journey planning
  getStops: () => api.get<BusStop[]>('/planner/stops'),
  planJourney: (fromStop: string, toStop: string) => 
    api.post<{ plan: JourneyPlan }>('/planner/plan-journey', { fromStop, toStop }),

  // Tracking
  getBus: (busId: string) => api.get(`/tracking/bus/${busId}`),
  getBusesOnRoute: (routeId: string) => api.get(`/tracking/route/${routeId}/buses`),

  // Booking
  bookTicket: (data: any) => api.post('/booking/book', data),
  getMyTickets: (userId: string) => api.get<Ticket[]>(`/booking/my-tickets/${userId}`),

  // Auth (future)
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data)
}

export default apiClient

