
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
