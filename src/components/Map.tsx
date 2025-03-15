
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

// Fix for Leaflet marker icons
import L from 'leaflet';
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
  location?: string;
}

const MapEmbed: React.FC<MapProps> = ({ location = '' }) => {
  const { toast } = useToast();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location) return;
    
    const fetchCoordinates = async () => {
      setIsLoading(true);
      try {
        // Use OpenStreetMap's Nominatim API to geocode the location
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        
        if (!response.ok) {
          throw new Error(`Geocoding error: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          // Nominatim returns lat/lon as strings
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          toast({
            title: "Location Not Found",
            description: `Could not find coordinates for "${location}"`,
            variant: "destructive",
          });
          setCoordinates(null);
        }
      } catch (error) {
        console.error("Error fetching location coordinates:", error);
        toast({
          title: "Error",
          description: "Failed to load map coordinates",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoordinates();
  }, [location, toast]);

  return (
    <Card className="glass-panel border-0 shadow-glass">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location Map
          </h3>
        </div>

        <div className={cn(
          "w-full h-[300px] rounded-lg overflow-hidden", 
          (!coordinates || isLoading) ? "bg-muted flex items-center justify-center" : ""
        )}>
          {isLoading && (
            <div className="text-muted-foreground text-center">
              Loading map...
            </div>
          )}
          
          {!isLoading && !location && (
            <div className="text-muted-foreground text-center">
              Enter a destination to see the map
            </div>
          )}
          
          {!isLoading && location && !coordinates && (
            <div className="text-muted-foreground text-center">
              Could not find coordinates for this location
            </div>
          )}
          
          {coordinates && (
            <MapContainer 
              center={coordinates as [number, number]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordinates as [number, number]}>
                <Popup>
                  {location}
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapEmbed;
