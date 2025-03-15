
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

// Sample images for fallback scenarios
const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=480&q=80',
];

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=480&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=480&q=80',
];

// Function to search for hotel recommendations
export const searchHotels = async (location: string): Promise<HotelRecommendation[]> => {
  const apiKey = getApiKey('serp_api_key');
  
  if (!apiKey) {
    console.error('SerpAPI key not found');
    toast({
      title: "API Key Missing",
      description: "Using sample hotel data since SerpAPI key is not configured.",
      variant: "warning",
    });
    return generateSampleHotels(location);
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
        description: `Using sample data. Error: (${response.status})`,
        variant: "warning",
      });
      return generateSampleHotels(location);
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
          imageUrl: hotel.thumbnail || HOTEL_IMAGES[Math.floor(Math.random() * HOTEL_IMAGES.length)],
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
          imageUrl: result.thumbnail || HOTEL_IMAGES[Math.floor(Math.random() * HOTEL_IMAGES.length)],
          address: result.address,
        });
      });
    }
    
    // If no hotel data found, create placeholder data
    if (hotels.length === 0) {
      return generateSampleHotels(location);
    }
    
    return hotels;
  } catch (error) {
    console.error('Error in hotel search:', error);
    toast({
      title: "Using Sample Data",
      description: "Could not fetch hotel recommendations",
      variant: "warning",
    });
    return generateSampleHotels(location);
  }
};

// Function to search for food recommendations
export const searchFoods = async (location: string): Promise<FoodRecommendation[]> => {
  const apiKey = getApiKey('serp_api_key');
  
  if (!apiKey) {
    console.error('SerpAPI key not found');
    toast({
      title: "API Key Missing",
      description: "Using sample food data since SerpAPI key is not configured.",
      variant: "warning",
    });
    return generateSampleFoods(location);
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
        description: `Using sample data. Error: (${response.status})`,
        variant: "warning",
      });
      return generateSampleFoods(location);
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
        
        const imageUrl = result.original || result.thumbnail || FOOD_IMAGES[index % FOOD_IMAGES.length];
        
        foods.push({
          name: foodNames[index % foodNames.length],
          description: descriptions[index % descriptions.length],
          price: randomPrice,
          imageUrl: imageUrl,
          restaurant: `${location} Authentic Restaurant ${index + 1}`
        });
      });
    }
    
    // If no food data found, create placeholder data
    if (foods.length === 0) {
      return generateSampleFoods(location);
    }
    
    return foods;
  } catch (error) {
    console.error('Error in food search:', error);
    toast({
      title: "Using Sample Data",
      description: "Could not fetch food recommendations",
      variant: "warning",
    });
    return generateSampleFoods(location);
  }
};

// Generate sample hotels for fallback
const generateSampleHotels = (location: string): HotelRecommendation[] => {
  return [
    {
      name: `Grand ${location} Luxury Hotel`,
      rating: 4.8,
      pricePerNight: 12000,
      description: `Experience luxury accommodation in ${location} with spectacular views and premium service.`,
      imageUrl: HOTEL_IMAGES[0],
    },
    {
      name: `${location} Comfort Inn`,
      rating: 4.2,
      pricePerNight: 6500,
      description: `Comfortable and affordable lodging in the heart of ${location}.`,
      imageUrl: HOTEL_IMAGES[1],
    },
    {
      name: `Heritage Resort ${location}`,
      rating: 4.6,
      pricePerNight: 9000,
      description: `Experience the cultural heritage of ${location} at this beautiful resort.`,
      imageUrl: HOTEL_IMAGES[2],
    },
    {
      name: `${location} Royal Palace Hotel`,
      rating: 4.7,
      pricePerNight: 15000,
      description: `A luxurious stay with royal treatment in the cultural hub of ${location}.`,
      imageUrl: HOTEL_IMAGES[3],
    }
  ];
};

// Generate sample foods for fallback
const generateSampleFoods = (location: string): FoodRecommendation[] => {
  return [
    {
      name: `${location} Spicy Curry`,
      description: `A traditional spicy curry that captures the essence of ${location} flavors.`,
      price: 350,
      imageUrl: FOOD_IMAGES[0],
      restaurant: 'Spice Garden Restaurant'
    },
    {
      name: `${location} Special Thali`,
      description: `A complete meal featuring all the local specialties of ${location}.`,
      price: 450,
      imageUrl: FOOD_IMAGES[1],
      restaurant: 'Heritage Dining'
    },
    {
      name: `${location} Sweet Delight`,
      description: `A famous dessert that completes any authentic ${location} meal.`,
      price: 175,
      imageUrl: FOOD_IMAGES[2],
      restaurant: 'Sweet Traditions'
    },
    {
      name: `${location} Street Food Platter`,
      description: `Collection of popular street foods from ${location} in one delicious platter.`,
      price: 275,
      imageUrl: FOOD_IMAGES[3],
      restaurant: 'Street Flavors'
    },
    {
      name: `${location} Breakfast Special`,
      description: `Start your day with this energizing traditional breakfast from ${location}.`,
      price: 225,
      imageUrl: FOOD_IMAGES[4],
      restaurant: 'Morning Delights'
    },
    {
      name: `Royal ${location} Biryani`,
      description: `A royal preparation of aromatic rice dish with authentic ${location} spices.`,
      price: 550,
      imageUrl: FOOD_IMAGES[5],
      restaurant: 'Royal Kitchens'
    }
  ];
};
