import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Bus, Navigation2 } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const Tracker = () => {
  const [buses, setBuses] = useState<any[]>([])
  const [center] = useState([28.6139, 77.2090])

  useEffect(() => {
    // Fetch buses
    fetch('/api/tracking/route/1A/buses')
      .then(res => res.json())
      .then(setBuses)
    
    // Update every 10 seconds
    const interval = setInterval(() => {
      fetch('/api/tracking/route/1A/buses')
        .then(res => res.json())
        .then(setBuses)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const busIcon = L.divIcon({
    className: 'bus-marker',
    html: '<div style="background: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Live Bus Tracker
        </h1>
        <p className="text-xl text-gray-600 flex items-center justify-center space-x-2">
          <Navigation2 className="h-6 w-6" />
          <span>Real-time bus locations and ETAs</span>
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
        <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <h2 className="text-2xl font-bold">Route 1A - Airport Express</h2>
          <p className="opacity-90">{buses.length} buses active</p>
        </div>
        
        <div className="h-[600px] relative">
          <MapContainer 
            center={center as [number, number]} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
            className="rounded-b-3xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {buses.map(bus => (
              <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-lg">{bus.id}</h3>
                    <p>Speed: {bus.speed?.toFixed(0)} km/h</p>
                    <p>ETA: {bus.etaNextStop}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            {/* Sample route line */}
            <Polyline positions={[[28.5665, 77.1031], [28.6139, 77.2090]] as [number, number][]} color="blue" weight={4} />
          </MapContainer>
        </div>
        
        <div className="p-6 grid md:grid-cols-3 gap-4">
          {buses.slice(0, 3).map((bus, i) => (
            <div key={bus.id} className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-bold">{bus.id}</span>
              </div>
              <div className="text-sm opacity-90">ETA: {bus.etaNextStop}</div>
              <div className="text-sm opacity-90">Speed: {bus.speed?.toFixed(0)} km/h</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tracker

