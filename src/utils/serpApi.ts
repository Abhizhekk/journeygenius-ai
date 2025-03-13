
// Function to get SerpAPI key from environment
const getSerpApiKey = (): string => {
  // For development, first check for the key in localStorage
  const localKey = localStorage.getItem('serp_api_key');
  if (localKey) return localKey;
  
  // Then check for environment variable
  return import.meta.env.VITE_SERP_API_KEY || '';
};

// Function to search for flights
export const searchFlights = async (source: string, destination: string, date: string): Promise<any> => {
  const apiKey = getSerpApiKey();
  
  if (!apiKey) {
    console.error('SerpAPI key not found');
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
      throw new Error(`SerpAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in SerpAPI flight search:', error);
    throw error;
  }
};
