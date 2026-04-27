import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { countryToCurrency } from './currencies';

export function getCurrencySymbol(location: string): string {
  if (!location) return '$';
  
  const parts = location.split(',');
  const countryName = parts[parts.length - 1].trim();
  
  // Try exact match
  if (countryToCurrency[countryName]) {
    return countryToCurrency[countryName];
  }

  // Try fuzzy match
  const loc = location.toLowerCase();
  for (const [country, symbol] of Object.entries(countryToCurrency)) {
    if (loc.includes(country.toLowerCase())) {
      return symbol;
    }
  }

  return '$'; // Default
}
