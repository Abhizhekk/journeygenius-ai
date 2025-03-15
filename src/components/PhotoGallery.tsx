
import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiKey } from "@/utils/apiKeyUtils";
import { toast } from "@/hooks/use-toast";

interface PhotoGalleryProps {
  location?: string;
}

interface Photo {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user?: {
    name: string;
    links?: {
      html: string;
    };
  };
  links?: {
    html: string;
  };
  original?: string;
  thumbnail?: string;
  title?: string;
  position?: number;
  source?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ location = '' }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location) return;

    const fetchPhotos = async () => {
      setLoading(true);
      setError('');
      
      try {
        const apiKey = getApiKey('serp_api_key');
        
        if (apiKey) {
          // Try to use SerpAPI first
          const formattedQuery = encodeURIComponent(`${location} travel destination`);
          const response = await fetch(
            `https://serpapi.com/search.json?engine=google_images&q=${formattedQuery}&api_key=${apiKey}`
          );
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.images_results && data.images_results.length > 0) {
              // Map SerpAPI results to common format
              const serpPhotos = data.images_results.slice(0, 8).map((img: any, index: number) => ({
                id: `serp-${index}`,
                urls: {
                  regular: img.original || img.thumbnail,
                  small: img.thumbnail
                },
                alt_description: img.title || `Photo of ${location}`,
                original: img.original,
                thumbnail: img.thumbnail,
                title: img.title,
                position: img.position,
                source: img.source
              }));
              
              setPhotos(serpPhotos);
              setLoading(false);
              return;
            }
          }
        }
        
        // Fallback to Unsplash if SerpAPI fails or returns no results
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            location
          )}&per_page=8&client_id=_Vw_xQGg7YKcJFEYFdsXLU9y3YP8pKDIcCZETrVnkhs`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        setPhotos(data.results || []);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError('Failed to fetch photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [location]);

  return (
    <Card className="glass-panel border-0 shadow-glass">
      <CardContent className="p-4">
        <h3 className="font-medium flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-primary" />
          {location ? `Photos of ${location}` : 'Destination Photos'}
        </h3>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-muted-foreground">
            {error}
          </div>
        )}

        {!loading && !error && photos.length === 0 && location && (
          <div className="text-center py-8 text-muted-foreground">
            No photos found for this location.
          </div>
        )}

        {!location && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            Enter a destination to see photos
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer relative group img-loading"
                    style={{
                      backgroundImage: `url(${photo.urls.small || photo.thumbnail})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs">View larger</span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 bg-transparent border-0 shadow-none">
                  <div className="relative">
                    <img
                      src={photo.urls.regular || photo.original || photo.urls.small || photo.thumbnail}
                      alt={photo.alt_description || photo.title || location}
                      className="w-full h-auto object-contain rounded-lg max-h-[80vh]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-3 rounded-b-lg flex justify-between items-center">
                      <span>
                        {photo.user?.name ? 
                          `Photo by ${photo.user.name} on Unsplash` : 
                          `Photo of ${location}`
                        }
                      </span>
                      {photo.links?.html && (
                        <a
                          href={photo.links.html}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoGallery;
