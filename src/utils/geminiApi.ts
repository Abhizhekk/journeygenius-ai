
import { toast } from "@/hooks/use-toast";

// Type for Gemini API response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

// Function to get API key from environment
const getGeminiApiKey = (): string => {
  // For development, first check for the key in localStorage
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey) return localKey;
  
  // Then check for environment variable
  // Note: In production, this should be properly configured
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Generic function to interact with Gemini API
export const generateGeminiResponse = async (
  prompt: string,
  context: string = '',
  options: any = {}
): Promise<string> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    console.error('Gemini API key not found');
    throw new Error('API key not configured');
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: context ? `${context}\n\n${prompt}` : prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            ...options,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0].text
    ) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    throw error;
  }
};

// Function to generate a travel plan
export const generateTravelPlan = async (formData: any): Promise<any> => {
  const { 
    source, 
    destination, 
    date, 
    budget, 
    travelers, 
    interests, 
    showTransportation 
  } = formData;

  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = `
    Please create a detailed travel plan with the following requirements:
    
    From: ${source}
    To: ${destination}
    Travel Date: ${dateStr}
    Budget: ₹${budget}
    Number of Travelers: ${travelers}
    Interests: ${interests || 'General sightseeing'}
    
    The response should be in JSON format with the following structure:
    {
      "destination": "${destination}",
      "summary": "A one paragraph summary of the destination and what makes it special",
      "budget": {
        "total": number (in Indian Rupees),
        "accommodation": number (in Indian Rupees),
        "food": number (in Indian Rupees),
        "activities": number (in Indian Rupees),
        "transportation": number (in Indian Rupees)
      },
      "duration": number (recommended number of days),
      "itinerary": [
        {
          "day": number,
          "activities": [
            {
              "time": "string (e.g. '9:00 AM')",
              "activity": "string",
              "description": "string",
              "location": "string",
              "cost": number (in Indian Rupees)
            }
          ]
        }
      ],
      "foodSuggestions": [
        {
          "name": "string (dish name)",
          "description": "string (short description of the dish)",
          "price": number (average price in Indian Rupees),
          "imageUrl": "string (URL to a photo of the dish - generate a plausible URL for Unsplash like https://source.unsplash.com/random/?food,dishname,${destination})"
        }
      ],
      "tips": ["string", "string", ...],
      ${showTransportation ? `
      "transportation": {
        "flights": [
          {
            "airline": "string",
            "flightNumber": "string",
            "departure": {
              "airport": "string",
              "time": "string"
            },
            "arrival": {
              "airport": "string",
              "time": "string"
            },
            "price": number (in Indian Rupees),
            "duration": "string"
          }
        ],
        "localTransportation": ["string", "string", ...]
      }` : ''}
    }
    
    Please make sure:
    1. The itinerary is realistic and accounts for travel time between activities
    2. The budget breakdown is reasonable for the destination
    3. Activities match the listed interests
    4. Include local cultural experiences and hidden gems
    5. Include 3-5 popular local food dishes with descriptions, approximate prices, and valid image URLs
    6. All prices should be in Indian Rupees (₹)
    7. Only include the JSON in your response, with no other text
  `;

  try {
    const rawResponse = await generateGeminiResponse(prompt);
    
    // Extract JSON from the response
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response');
    }
    
    const jsonString = jsonMatch[0];
    const tripData = JSON.parse(jsonString);
    
    return tripData;
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw error;
  }
};

// Function to send message to chatbot
export const sendMessageToGemini = async (
  message: string,
  destination: string = ''
): Promise<string> => {
  const context = destination 
    ? `You are a helpful and knowledgeable travel assistant helping a tourist plan their trip to ${destination}. 
       Provide detailed, accurate and helpful information about ${destination}, including attractions, 
       local customs, food, transportation, and practical travel tips. Keep your answers focused on travel-related information.
       When discussing prices, always use Indian Rupees (₹).`
    : `You are a helpful travel assistant. The user hasn't selected a specific destination yet, 
       so you're helping them with general travel planning questions or destination recommendations.
       Focus only on travel-related assistance and advice. When discussing prices, always use Indian Rupees (₹).`;

  return generateGeminiResponse(message, context);
};
