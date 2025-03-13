
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApiKey, saveApiKey } from "@/utils/apiKeyUtils";

interface MapProps {
  location?: string;
}

const MapEmbed: React.FC<MapProps> = ({ location = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get API key from our utility
  const mapboxApiKey = getApiKey('mapbox_api_key');

  useEffect(() => {
    if (!mapboxApiKey || !location || !mapContainerRef.current) return;

    // Clean up previous map iframe
    if (mapContainerRef.current.firstChild) {
      mapContainerRef.current.removeChild(mapContainerRef.current.firstChild);
    }

    // Create the map iframe
    const encodedLocation = encodeURIComponent(location);
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '1rem';
    
    // Use Mapbox static maps API
    iframe.src = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+3b82f6(${encodedLocation})/auto/500x300?access_token=${mapboxApiKey}`;
    
    mapContainerRef.current.appendChild(iframe);
  }, [mapboxApiKey, location]);

  return (
    <Card className="glass-panel border-0 shadow-glass">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location Map
          </h3>
        </div>

        <div 
          ref={mapContainerRef} 
          className={`w-full h-[300px] rounded-lg ${!mapboxApiKey || !location ? 'bg-muted flex items-center justify-center' : ''}`}
        >
          {!mapboxApiKey && (
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-2">Map requires a Mapbox API key</p>
              <Button
                size="sm"
                onClick={() => {
                  toast({
                    title: "API Key Required",
                    description: "Please set up your Mapbox API key in Settings to view maps.",
                  });
                }}
              >
                Set up in Settings
              </Button>
            </div>
          )}
          {mapboxApiKey && !location && (
            <div className="text-muted-foreground text-center">
              Enter a destination to see the map
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapEmbed;
