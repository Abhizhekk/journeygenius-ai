
// Utility functions for API key management

import { toast } from "@/hooks/use-toast";

// Default API keys for demo purposes
const DEFAULT_GEMINI_API_KEY = 'AIzaSyBPQ4In0Qw-dr33dxs7odQM6sT1iLPTX2A';
const DEFAULT_SERP_API_KEY = '139bb9e7039850b5e4a1495c0b535c3eaf2a5fda91e4b7c9ac83cdebff5e2448';

// API key types
export type ApiKeyType = 'gemini_api_key' | 'serp_api_key';

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
  
  // Finally check default keys
  if (keyType === 'gemini_api_key' && DEFAULT_GEMINI_API_KEY) {
    return true;
  }
  if (keyType === 'serp_api_key' && DEFAULT_SERP_API_KEY) {
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
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) return envKey;
  }
  if (keyType === 'serp_api_key') {
    const envKey = import.meta.env.VITE_SERP_API_KEY;
    if (envKey) return envKey;
  }
  
  // Finally return default keys
  if (keyType === 'gemini_api_key') {
    return DEFAULT_GEMINI_API_KEY;
  }
  if (keyType === 'serp_api_key') {
    return DEFAULT_SERP_API_KEY;
  }
  
  return '';
};
