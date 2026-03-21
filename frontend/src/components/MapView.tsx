import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { BusStop } from '../../shared/types'
import { useEffect, useState } from 'react'
import { Bus, MapPin } from 'lucide-react'

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapViewProps {
  center?: [number, number]
  stops?: BusStop[]
  routePath?: [number, number][]
  height?: string
  zoom?: number
  showStops?: boolean
}

const MapView = ({ center = [28.6139, 77.2090], stops = [], routePath = [], height = '400px', zoom = 12, showStops = true }: MapViewProps) => {
  const [position, setPosition] = useState<[number, number]>(center)

  const MapEventListener = () => {
    useMapEvents({
      click: () => {
        console.log('Map clicked')
      },
    })
    return null
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl relative" style={{ height }}>
      <MapContainer 
        center={position} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl"
      >
        <MapEventListener />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {showStops && stops.map((stop) => (
          <Marker 
            key={stop.id} 
            position={[stop.lat, stop.lng]}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-lg mb-1">{stop.name}</h3>
                <p className="text-sm text-gray-600">Routes: {stop.routes.join(', ')}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {routePath.length > 1 && (
          <Polyline 
            positions={routePath} 
            color="#3b82f6" 
            weight={5}
            opacity={0.8}
          >
            <Popup>Recommended route</Popup>
          </Polyline>
        )}
      </MapContainer>
    </div>
  )
}

export default MapView

