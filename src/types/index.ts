export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  duration: number; // in minutes
  mood: Mood;
  icon: string;
  color: string;
  indoor: boolean;
  cost: CostLevel;
  difficulty: DifficultyLevel;
  tags: string[];
  location?: string;
  weatherDependent: boolean;
}

export interface ScheduledActivity extends Activity {
  scheduledId: string;
  day: 'saturday' | 'sunday' | 'friday' | 'monday';
  startTime: string; // HH:MM format
  endTime: string;
  notes?: string;
  completed?: boolean;
  photos?: string[];
  // Multi-hour spanning properties
  isMainActivity?: boolean; // True for the primary activity slot
  isBlocked?: boolean; // True for continuation/blocking slots
  parentActivityId?: string; // Reference to main activity for blocked slots
  spansDuration?: boolean; // True if activity spans multiple hours
}

export interface WeekendPlan {
  id: string;
  name: string;
  theme: PlanTheme;
  createdAt: Date;
  updatedAt: Date;
  activities: ScheduledActivity[];
  budget?: number;
  totalCost?: number;
  isLongWeekend: boolean;
  sharedWith?: string[];
}

export type ActivityCategory = 
  | 'food' 
  | 'entertainment' 
  | 'outdoor' 
  | 'indoor' 
  | 'social' 
  | 'wellness' 
  | 'culture' 
  | 'sports' 
  | 'creative' 
  | 'learning';

export type Mood = 
  | 'energetic' 
  | 'relaxed' 
  | 'adventurous' 
  | 'social' 
  | 'peaceful' 
  | 'creative' 
  | 'romantic' 
  | 'family';

export type CostLevel = 'free' | 'low' | 'medium' | 'high';

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging';

export type PlanTheme = 
  | 'lazy' 
  | 'adventurous' 
  | 'family' 
  | 'romantic' 
  | 'productive' 
  | 'social' 
  | 'wellness' 
  | 'cultural' 
  | 'foodie' 
  | 'custom';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: DayForecast[];
}

export interface DayForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

export interface User {
  id: string;
  name: string;
  preferences: UserPreferences;
  savedPlans: string[];
  achievements: Achievement[];
}

export interface UserPreferences {
  favoriteCategories: ActivityCategory[];
  preferredMoods: Mood[];
  budgetRange: [number, number];
  location: string;
  themes: PlanTheme[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'planner' | 'explorer' | 'social' | 'wellness';
}

export interface ExternalEvent {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  category: string;
  price?: number;
  url?: string;
  source: 'eventbrite' | 'facebook' | 'local' | 'custom';
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceLevel: CostLevel;
  location: string;
  openHours: string;
  phone?: string;
  website?: string;
}

export interface AppState {
  currentPlan: WeekendPlan | null;
  activities: Activity[];
  weather: WeatherData | null;
  user: User | null;
  theme: 'light' | 'dark' | 'auto';
  isLoading: boolean;
  error: string | null;
}
