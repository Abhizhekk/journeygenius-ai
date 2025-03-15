
import { getApiKey } from "@/utils/apiKeyUtils";
import { toast } from "@/hooks/use-toast";
import { formatIndianRupees } from "@/lib/utils";

export interface HotelRecommendation {
  name: string;
  rating: number;
  pricePerNight: number;
  description: string;
  imageUrl: string;
  address?: string;
}

export interface FoodRecommendation {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurant?: string;
}

// Function to search for hotel recommendations
export const searchHotels = async (location: string): Promise<HotelRecommendation[]> => {
  const apiKey = getApiKey('serp_api_key');
  
  if (!apiKey) {
    console.error('SerpAPI key not found');
    toast({
      title: "API Key Missing",
      description: "Please set up your SerpAPI key in Settings to use hotel recommendations.",
      variant: "destructive",
    });
    return [];
  }
  
  try {
    // Format parameters for SerpAPI
    const formattedLocation = encodeURIComponent(`hotels in ${location}`);
    
    // Make the API request to SerpAPI
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${formattedLocation}&api_key=${apiKey}`
    );
    
    if (!response.ok) {
      toast({
        title: "API Error",
        description: `Error connecting to SerpAPI (${response.status}). Please check your API key.`,
        variant: "destructive",
      });
      return [];
    }
    
    const data = await response.json();
    
    // Process hotels from results
    const hotels: HotelRecommendation[] = [];
    
    // Parse hotel data from SerpAPI response
    if (data.hotels_results) {
      // Use hotels_results if available
      data.hotels_results.slice(0, 5).forEach((hotel: any) => {
        const priceRaw = hotel.price ? parseFloat(hotel.price.replace(/[^0-9.]/g, '')) : 5000;
        hotels.push({
          name: hotel.name || 'Luxury Hotel',
          rating: hotel.rating || 4.5,
          pricePerNight: priceRaw * 83, // Convert USD to INR (approximate)
          description: hotel.description || `Experience the beauty of ${location} at this wonderful hotel featuring modern amenities and excellent service.`,
          imageUrl: hotel.thumbnail || 'https://placehold.co/600x400?text=Hotel',
          address: hotel.address,
        });
      });
    } else if (data.local_results) {
      // Fallback to local_results if hotels_results not available
      data.local_results.slice(0, 5).forEach((result: any) => {
        hotels.push({
          name: result.title || 'Luxury Hotel',
          rating: result.rating || 4.5,
          pricePerNight: 8500, // Default price in INR
          description: `Experience the beauty of ${location} at this wonderful hotel featuring modern amenities and excellent service.`,
          imageUrl: result.thumbnail || 'https://placehold.co/600x400?text=Hotel',
          address: result.address,
        });
      });
    }
    
    // If no hotel data found, create placeholder data
    if (hotels.length === 0) {
      hotels.push(
        {
          name: 'Grand Luxury Hotel',
          rating: 4.8,
          pricePerNight: 12000,
          description: `Experience luxury accommodation in ${location} with spectacular views and premium service.`,
          imageUrl: 'https://placehold.co/600x400?text=Luxury+Hotel',
        },
        {
          name: 'Comfort Inn',
          rating: 4.2,
          pricePerNight: 6500,
          description: `Comfortable and affordable lodging in the heart of ${location}.`,
          imageUrl: 'https://placehold.co/600x400?text=Comfort+Inn',
        },
        {
          name: 'Heritage Resort',
          rating: 4.6,
          pricePerNight: 9000,
          description: `Experience the cultural heritage of ${location} at this beautiful resort.`,
          imageUrl: 'https://placehold.co/600x400?text=Heritage+Resort',
        }
      );
    }
    
    return hotels;
  } catch (error) {
    console.error('Error in hotel search:', error);
    toast({
      title: "Error",
      description: "Could not fetch hotel recommendations",
      variant: "destructive",
    });
    return [];
  }
};

// Function to search for food recommendations
export const searchFoods = async (location: string): Promise<FoodRecommendation[]> => {
  const apiKey = getApiKey('serp_api_key');
  
  if (!apiKey) {
    console.error('SerpAPI key not found');
    toast({
      title: "API Key Missing",
      description: "Please set up your SerpAPI key in Settings to use food recommendations.",
      variant: "destructive",
    });
    return [];
  }
  
  try {
    // Format parameters for SerpAPI
    const formattedQuery = encodeURIComponent(`popular food in ${location}`);
    
    // Make the API request to SerpAPI
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_images&q=${formattedQuery}&api_key=${apiKey}`
    );
    
    if (!response.ok) {
      toast({
        title: "API Error",
        description: `Error connecting to SerpAPI (${response.status}). Please check your API key.`,
        variant: "destructive",
      });
      return [];
    }
    
    const data = await response.json();
    
    // Process foods from results
    const foods: FoodRecommendation[] = [];
    
    // Parse food data from SerpAPI response
    if (data.images_results) {
      data.images_results.slice(0, 6).forEach((result: any, index: number) => {
        // Generate a random price between 150 and 800 INR
        const randomPrice = Math.floor(Math.random() * (800 - 150 + 1)) + 150;
        
        const foodNames = [
          `${location} Special Curry`,
          `Traditional ${location} Thali`,
          `${location} Style Biryani`,
          `Famous ${location} Street Food`,
          `${location} Sweet Delicacy`,
          `Local ${location} Breakfast`
        ];
        
        const descriptions = [
          `A flavorful local specialty made with regional spices and fresh ingredients.`,
          `Traditional dish loved by locals and tourists alike.`,
          `A must-try culinary delight when visiting ${location}.`,
          `Popular street food with a perfect balance of flavors.`,
          `This authentic dish represents the true essence of ${location} cuisine.`,
          `A perfect blend of local spices and traditional cooking methods.`
        ];
        
        foods.push({
          name: foodNames[index % foodNames.length],
          description: descriptions[index % descriptions.length],
          price: randomPrice,
          imageUrl: result.original || result.thumbnail || 'https://placehold.co/600x400?text=Food',
          restaurant: `${location} Authentic Restaurant ${index + 1}`
        });
      });
    }
    
    // If no food data found, create placeholder data
    if (foods.length === 0) {
      foods.push(
        {
          name: `${location} Spicy Curry`,
          description: `A traditional spicy curry that captures the essence of ${location} flavors.`,
          price: 350,
          imageUrl: 'https://placehold.co/600x400?text=Spicy+Curry',
          restaurant: 'Spice Garden Restaurant'
        },
        {
          name: `${location} Special Thali`,
          description: `A complete meal featuring all the local specialties of ${location}.`,
          price: 450,
          imageUrl: 'https://placehold.co/600x400?text=Special+Thali',
          restaurant: 'Heritage Dining'
        },
        {
          name: `${location} Sweet Delight`,
          description: `A famous dessert that completes any authentic ${location} meal.`,
          price: 175,
          imageUrl: 'https://placehold.co/600x400?text=Sweet+Delight',
          restaurant: 'Sweet Traditions'
        }
      );
    }
    
    return foods;
  } catch (error) {
    console.error('Error in food search:', error);
    toast({
      title: "Error",
      description: "Could not fetch food recommendations",
      variant: "destructive",
    });
    return [];
  }
};
