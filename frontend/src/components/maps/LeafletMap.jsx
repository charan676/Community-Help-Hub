import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker assets in bundler builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const LeafletMap = ({ hospitals = [], center = [17.7034, 83.3032], zoom = 10 }) => {
  const language = localStorage.getItem('language') || 'en';

  return (
    <div className="leaflet-container-wrapper">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitals.map((hospital) => {
          const coords = hospital.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          
          // MongoDB coordinates are [longitude, latitude], Leaflet needs [latitude, longitude]
          const position = [coords[1], coords[0]];
          const name = hospital.name[language] || hospital.name.en;
          const address = hospital.address[language] || hospital.address.en;

          return (
            <Marker key={hospital._id} position={position}>
              <Popup>
                <div style={{ fontSize: '0.85rem' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary)' }}>{name}</h4>
                  <p style={{ margin: '0 0 6px 0', color: 'var(--text-secondary)' }}>{address}</p>
                  <p style={{ margin: '0', fontWeight: 'bold' }}>📞 {hospital.contactNumber}</p>
                  {hospital.googleMapsUrl && (
                    <a 
                      href={hospital.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-block', 
                        marginTop: '8px', 
                        color: 'var(--primary)', 
                        textDecoration: 'underline' 
                      }}
                    >
                      Get Directions
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
