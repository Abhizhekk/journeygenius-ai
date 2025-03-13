
// Utility functions for API key management

import { toast } from "@/hooks/use-toast";

// API key types
export type ApiKeyType = 'gemini_api_key' | 'serp_api_key' | 'mapbox_api_key';

// Check if an API key exists
export const hasApiKey = (keyType: ApiKeyType): boolean => {
  // First check localStorage
  const storedKey = localStorage.getItem(keyType);
  if (storedKey) return true;
  
  // Then check environment variables
  if (keyType === 'gemini_api_key' && import.meta.env.VITE_GEMINI_API_KEY) {
    return true;
  }
  if (keyType === 'serp_api_key' && import.meta.env.VITE_SERP_API_KEY) {
    return true;
  }
  
  return false;
};

// Save API key to localStorage
export const saveApiKey = (keyType: ApiKeyType, value: string): void => {
  if (!value.trim()) {
    toast({
      title: "Error",
      description: `Cannot save empty ${keyType.replace('_', ' ')}`,
      variant: "destructive",
    });
    return;
  }
  
  localStorage.setItem(keyType, value.trim());
  
  toast({
    title: "Success",
    description: `${keyType.replace('_', ' ')} saved successfully`,
  });
};

// Get API key from localStorage or environment
export const getApiKey = (keyType: ApiKeyType): string => {
  // First check localStorage
  const storedKey = localStorage.getItem(keyType);
  if (storedKey) return storedKey;
  
  // Then check environment variables
  if (keyType === 'gemini_api_key') {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  }
  if (keyType === 'serp_api_key') {
    return import.meta.env.VITE_SERP_API_KEY || '';
  }
  
  return '';
};
