import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { ArrowLeft } from 'lucide-react'
import { mockSavedItems } from '../data/mockData'
import L from 'leaflet'

// Fix Leaflet's default marker icon broken in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Only items with a location
const locationItems = mockSavedItems.filter(item => item.location)

export function MapView() {
  const navigate = useNavigate()

  return (
    <div className="h-screen w-full relative">

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-[1000] w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <ArrowLeft className="w-4 h-4 text-gray-700" />
      </button>

      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locationItems.map(item => (
          <Marker
            key={item.id}
            position={[item.location!.lat, item.location!.lng]}
          >
            <Popup>
              <div className="w-40">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <p className="text-xs font-semibold text-gray-900 leading-snug">
                  {item.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.location!.name}
                </p>
                <button
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="mt-2 w-full text-xs text-blue-500 font-medium text-left"
                >
                  View details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  )
}