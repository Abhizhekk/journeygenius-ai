
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIndianRupees(amount: number): string {
  // Format number to Indian currency format (e.g., 1,00,000 instead of 100,000)
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  });
  return formatter.format(amount);
}

// Function to create a user-friendly notification for missing API keys
export function checkApiKeysAndNotify(requiredKey: string, toast: any): boolean {
  const key = localStorage.getItem(requiredKey) || 
              (requiredKey === 'gemini_api_key' ? import.meta.env.VITE_GEMINI_API_KEY : '') || 
              (requiredKey === 'serp_api_key' ? import.meta.env.VITE_SERP_API_KEY : '');
  
  if (!key) {
    const keyName = requiredKey.replace('_', ' ');
    toast({
      title: `${keyName.charAt(0).toUpperCase() + keyName.slice(1)} Required`,
      description: `Please set up your ${keyName} in Settings to use this feature.`,
      variant: "destructive",
    });
    return false;
  }
  
  return true;
}
