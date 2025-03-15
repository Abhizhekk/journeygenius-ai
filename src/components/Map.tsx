import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Map as MapIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Fix for Leaflet marker icons in production
// Required because Leaflet's default marker icons reference assets that might not be available
// This sets up a custom icon with embedded SVG data
const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>`,
  className: 'custom-marker-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

interface MapEmbedProps {
  location?: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ location = '' }) => {
  const [coordinates, setCoordinates] = useState<[number, number]>([20.5937, 78.9629]); // Default: Center of India
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!location) return;

    const fetchCoordinates = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Use OpenStreetMap Nominatim for geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        
        if (!response.ok) {
          throw new Error('Geocoding service unavailable');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError('Location not found. Showing default map view.');
          // Keep default coordinates for India
        }
      } catch (err) {
        console.error('Error geocoding location:', err);
        setError('Could not find coordinates for this location.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [location]);

  // Add a small delay to ensure Leaflet loads properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="glass-panel border-0 shadow-glass overflow-hidden">
      <CardContent className="p-4">
        <h3 className="font-medium flex items-center gap-2 mb-4">
          <MapIcon className="h-5 w-5 text-primary" />
          {location ? `Map of ${location}` : 'Destination Map'}
        </h3>
        
        {loading && (
          <div className="h-[400px] w-full bg-muted/30 rounded-lg flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {error && (
          <div className="text-center py-4 text-muted-foreground">
            {error}
          </div>
        )}
        
        {mapLoaded && !loading && (
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
            <MapContainer 
              center={coordinates} 
              zoom={10} 
              style={{ height: '100%', width: '100%' }} 
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={coordinates} icon={customIcon}>
                <Popup>
                  <div className="text-center py-1">
                    <div className="font-medium">{location}</div>
                    <div className="text-xs text-muted-foreground">
                      {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
            
            {!location && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center max-w-xs mx-auto">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Enter a destination to see a detailed map
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapEmbed;
