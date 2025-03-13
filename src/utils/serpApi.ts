
import { getApiKey, hasApiKey } from "@/utils/apiKeyUtils";
import { toast } from "@/hooks/use-toast";

// Function to search for flights
export const searchFlights = async (source: string, destination: string, date: string): Promise<any> => {
  const apiKey = getApiKey('serp_api_key');
  
  if (!apiKey) {
    console.error('SerpAPI key not found');
    toast({
      title: "API Key Missing",
      description: "Please set up your SerpAPI key in Settings to use flight search features.",
      variant: "destructive",
    });
    throw new Error('API key not configured');
  }
  
  try {
    // Format parameters for SerpAPI
    const formattedSource = encodeURIComponent(source);
    const formattedDestination = encodeURIComponent(destination);
    const formattedDate = encodeURIComponent(date);
    
    // Make the API request to SerpAPI's flight search endpoint
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_flights&departure_id=${formattedSource}&arrival_id=${formattedDestination}&outbound_date=${formattedDate}&api_key=${apiKey}`
    );
    
    if (!response.ok) {
      toast({
        title: "API Error",
        description: `Error connecting to SerpAPI (${response.status}). Please check your API key.`,
        variant: "destructive",
      });
      throw new Error(`SerpAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in SerpAPI flight search:', error);
    throw error;
  }
};
