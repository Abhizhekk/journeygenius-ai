
import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface PhotoGalleryProps {
  location?: string;
}

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ location = '' }) => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location) return;

    const fetchPhotos = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Use the Unsplash demo API (limited to 50 requests per hour)
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
                      backgroundImage: `url(${photo.urls.small})`,
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
                      src={photo.urls.regular}
                      alt={photo.alt_description || location}
                      className="w-full h-auto object-contain rounded-lg max-h-[80vh]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-3 rounded-b-lg flex justify-between items-center">
                      <span>Photo by {photo.user.name} on Unsplash</span>
                      <a
                        href={photo.links.html}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Source
                      </a>
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
