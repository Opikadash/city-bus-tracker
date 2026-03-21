import { Routes, Route, Link } from 'react-router-dom'
import Planner from './pages/Planner'
import Tracker from './pages/Tracker'
import Booking from './pages/Booking.tsx'

import { Bus, MapPin, Ticket } from 'lucide-react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-blue-600 mr-3" />
              <Link to="/" className="text-2xl font-bold text-gray-900">CityBus Tracker</Link>
            </div>
            <div className="flex space-x-8 items-center">
              <Link to="/planner" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                <MapPin className="h-5 w-5" />
                <span>Plan Journey</span>
              </Link>
              <Link to="/tracker" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                <Bus className="h-5 w-5" />
                <span>Live Tracker</span>
              </Link>
              <Link to="/booking" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                <Ticket className="h-5 w-5" />
                <span>Tickets</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Planner />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

