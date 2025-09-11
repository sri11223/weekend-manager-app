// Common types for all API services
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  source: 'api' | 'fallback' | 'jsonplaceholder';
}

export interface Location {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  mood: ActivityMood[];
  duration: number; // in minutes
  image?: string;
  rating?: number;
  price?: 'free' | 'low' | 'medium' | 'high';
  location?: {
    name: string;
    address?: string;
    coordinates?: Location;
  };
  tags: string[];
  weatherDependent?: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
}

export type ActivityCategory = 
  | 'food' 
  | 'outdoor' 
  | 'entertainment' 
  | 'cultural' 
  | 'social' 
  | 'wellness' 
  | 'gaming' 
  | 'shopping'
  | 'trip-planning';

export type ActivityMood = 
  | 'relaxed' 
  | 'adventurous' 
  | 'social' 
  | 'romantic' 
  | 'energetic' 
  | 'creative' 
  | 'peaceful' 
  | 'fun' 
  | 'productive' 
  | 'cozy';

export interface ApiServiceConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retries: number;
  cacheDuration: number; // in milliseconds
}

export interface SearchFilters {
  category?: ActivityCategory;
  mood?: ActivityMood[];
  location?: Location;
  radius?: number; // in meters
  priceRange?: ('free' | 'low' | 'medium' | 'high')[];
  timeOfDay?: ('morning' | 'afternoon' | 'evening' | 'night')[];
  weatherDependent?: boolean;
  limit?: number;
}
