
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface MapProps {
  location?: string;
}

const MapEmbed: React.FC<MapProps> = ({ location = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapKey, setMapKey] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [isEditingKey, setIsEditingKey] = useState(false);
  const { toast } = useToast();

  // On component mount, check localStorage for saved API key
  useEffect(() => {
    const savedKey = localStorage.getItem('mapbox_api_key');
    if (savedKey) {
      setMapKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (!mapKey || !location || !mapContainerRef.current) return;

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
    iframe.src = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+3b82f6(${encodedLocation})/auto/500x300?access_token=${mapKey}`;
    
    mapContainerRef.current.appendChild(iframe);
  }, [mapKey, location]);

  const handleSaveKey = () => {
    if (!inputKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('mapbox_api_key', inputKey);
    setMapKey(inputKey);
    setIsEditingKey(false);
    toast({
      title: "Success",
      description: "Mapbox API key saved successfully",
    });
  };

  return (
    <Card className="glass-panel border-0 shadow-glass">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location Map
          </h3>
          {!isEditingKey && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditingKey(true)}
              className="text-xs"
            >
              {mapKey ? 'Change API Key' : 'Add API Key'}
            </Button>
          )}
        </div>

        {isEditingKey ? (
          <div className="space-y-3 mb-3">
            <div className="text-sm text-muted-foreground">
              Enter your Mapbox API key to display maps. Get one from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="pk.eyJ1..."
                className="flex-1"
              />
              <Button onClick={handleSaveKey} size="sm">Save</Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditingKey(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <div 
          ref={mapContainerRef} 
          className={`w-full h-[300px] rounded-lg ${!mapKey || !location ? 'bg-muted flex items-center justify-center' : ''}`}
        >
          {!mapKey && !isEditingKey && (
            <div className="text-center p-4">
              <p className="text-muted-foreground mb-2">Map requires a Mapbox API key</p>
              <Button 
                size="sm" 
                onClick={() => setIsEditingKey(true)}
              >
                Add API Key
              </Button>
            </div>
          )}
          {mapKey && !location && (
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
