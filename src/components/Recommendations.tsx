
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils, Hotel, Star, MapPin, Clock } from 'lucide-react';
import { formatIndianRupees } from '@/lib/utils';
import { HotelRecommendation, FoodRecommendation, searchHotels, searchFoods } from '@/utils/recommendationApi';
import { useToast } from '@/hooks/use-toast';

interface RecommendationsProps {
  location?: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({ location = '' }) => {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<HotelRecommendation[]>([]);
  const [foods, setFoods] = useState<FoodRecommendation[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);

  useEffect(() => {
    if (!location) return;
    
    const fetchRecommendations = async () => {
      // Fetch hotels
      setIsLoadingHotels(true);
      try {
        const hotelData = await searchHotels(location);
        setHotels(hotelData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setIsLoadingHotels(false);
      }
      
      // Fetch foods
      setIsLoadingFoods(true);
      try {
        const foodData = await searchFoods(location);
        setFoods(foodData);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setIsLoadingFoods(false);
      }
    };
    
    fetchRecommendations();
  }, [location, toast]);

  if (!location) {
    return (
      <Card className="glass-panel border-0 shadow-glass">
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            Enter a destination to see recommendations
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-0 shadow-glass">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          Recommendations for {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hotels" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="h-4 w-4" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Local Food
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hotels" className="space-y-6">
            {isLoadingHotels ? (
              <HotelsSkeleton />
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotels.map((hotel, index) => (
                  <HotelCard key={index} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hotel recommendations available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="food" className="space-y-6">
            {isLoadingFoods ? (
              <FoodsSkeleton />
            ) : foods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {foods.map((food, index) => (
                  <FoodCard key={index} food={food} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No food recommendations available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const HotelCard = ({ hotel }: { hotel: HotelRecommendation }) => (
  <Card className="overflow-hidden border border-border/30 hover:shadow-md transition-shadow">
    <div className="aspect-video w-full overflow-hidden bg-muted">
      <img 
        src={hotel.imageUrl} 
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
    </div>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-base">{hotel.name}</h4>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          <span className="text-sm">{hotel.rating}</span>
        </div>
      </div>
      
      {hotel.address && (
        <div className="flex items-center text-xs text-muted-foreground mb-2">
          <MapPin className="h-3 w-3 mr-1" /> {hotel.address}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mb-2">{hotel.description}</p>
      
      <Badge variant="outline" className="font-normal">
        ₹{formatIndianRupees(hotel.pricePerNight)}/night
      </Badge>
    </CardContent>
  </Card>
);

const FoodCard = ({ food }: { food: FoodRecommendation }) => (
  <Card className="overflow-hidden border border-border/30 hover:shadow-md transition-shadow">
    <div className="aspect-video w-full overflow-hidden bg-muted">
      <img 
        src={food.imageUrl} 
        alt={food.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Food';
        }}
      />
    </div>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-base">{food.name}</h4>
        <Badge variant="outline" className="font-normal">
          ₹{formatIndianRupees(food.price)}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{food.description}</p>
      
      {food.restaurant && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Restaurant:</span> {food.restaurant}
        </div>
      )}
    </CardContent>
  </Card>
);

const HotelsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="overflow-hidden border border-border/30 animate-pulse">
        <div className="aspect-video w-full bg-slate-200"></div>
        <CardContent className="p-4">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const FoodsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="overflow-hidden border border-border/30 animate-pulse">
        <div className="aspect-video w-full bg-slate-200"></div>
        <CardContent className="p-4">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default Recommendations;
