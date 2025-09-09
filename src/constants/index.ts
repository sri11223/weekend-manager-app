import type { Activity, PlanTheme } from '@/types'

export const WEEKEND_THEMES: Record<string, PlanTheme> = {
  LAZY: 'lazy',
  ADVENTUROUS: 'adventurous',
  FAMILY: 'family', 
  ROMANTIC: 'romantic',
  PRODUCTIVE: 'productive',
  SOCIAL: 'social',
  WELLNESS: 'wellness',
  CULTURAL: 'cultural',
  FOODIE: 'foodie'
} as const

export const TIME_SLOTS = [
  { id: '06:00', label: '6:00 AM', value: '06:00' },
  { id: '09:00', label: '9:00 AM', value: '09:00' },
  { id: '12:00', label: '12:00 PM', value: '12:00' },
  { id: '15:00', label: '3:00 PM', value: '15:00' },
  { id: '18:00', label: '6:00 PM', value: '18:00' },
  { id: '21:00', label: '9:00 PM', value: '21:00' }
] as const

export const ACTIVITY_CATEGORIES = {
  FOOD: 'food',
  ENTERTAINMENT: 'entertainment',
  OUTDOOR: 'outdoor',
  INDOOR: 'indoor',
  SOCIAL: 'social',
  WELLNESS: 'wellness',
  CULTURE: 'culture',
  SPORTS: 'sports',
  CREATIVE: 'creative',
  LEARNING: 'learning'
} as const

export const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: 'brunch-1',
    name: 'Weekend Brunch',
    description: 'Delicious brunch with friends or family at a cozy cafe',
    category: 'food',
    duration: 90,
    mood: 'social',
    icon: '🍳',
    color: '#f59e0b',
    indoor: false,
    cost: 'medium',
    difficulty: 'easy',
    tags: ['food', 'social', 'weekend'],
    location: 'Restaurant/Cafe',
    weatherDependent: false
  },
  {
    id: 'hiking-1',
    name: 'Nature Hiking',
    description: 'Explore scenic trails and enjoy beautiful nature views',
    category: 'outdoor',
    duration: 180,
    mood: 'adventurous',
    icon: '🥾',
    color: '#10b981',
    indoor: false,
    cost: 'free',
    difficulty: 'moderate',
    tags: ['outdoor', 'exercise', 'nature'],
    location: 'National Park/Trail',
    weatherDependent: true
  },
  {
    id: 'movie-1',
    name: 'Movie Marathon',
    description: 'Cozy movie night with popcorn and your favorite films',
    category: 'entertainment',
    duration: 120,
    mood: 'relaxed',
    icon: '🎬',
    color: '#6366f1',
    indoor: true,
    cost: 'low',
    difficulty: 'easy',
    tags: ['entertainment', 'indoor', 'relaxing'],
    weatherDependent: false
  },
  {
    id: 'workout-1',
    name: 'Gym Session',
    description: 'High-energy workout to boost endorphins and stay fit',
    category: 'wellness',
    duration: 75,
    mood: 'energetic',
    icon: '💪',
    color: '#06b6d4',
    indoor: true,
    cost: 'medium',
    difficulty: 'moderate',
    tags: ['fitness', 'health', 'energy'],
    location: 'Gym/Fitness Center',
    weatherDependent: false
  },
  {
    id: 'coffee-1',
    name: 'Coffee Shop Visit',
    description: 'Catch up with friends over artisanal coffee and pastries',
    category: 'social',
    duration: 60,
    mood: 'social',
    icon: '☕',
    color: '#8b5cf6',
    indoor: true,
    cost: 'low',
    difficulty: 'easy',
    tags: ['social', 'coffee', 'conversation'],
    location: 'Coffee Shop',
    weatherDependent: false
  },
  {
    id: 'cooking-1',
    name: 'Home Cooking',
    description: 'Try a new recipe and enjoy the art of cooking',
    category: 'creative',
    duration: 120,
    mood: 'creative',
    icon: '👨‍🍳',
    color: '#ec4899',
    indoor: true,
    cost: 'medium',
    difficulty: 'moderate',
    tags: ['cooking', 'creative', 'food'],
    location: 'Home Kitchen',
    weatherDependent: false
  },
  {
    id: 'reading-1',
    name: 'Reading Session',
    description: 'Dive into a good book and expand your knowledge',
    category: 'learning',
    duration: 90,
    mood: 'peaceful',
    icon: '📚',
    color: '#14b8a6',
    indoor: true,
    cost: 'free',
    difficulty: 'easy',
    tags: ['reading', 'learning', 'quiet'],
    location: 'Home/Library',
    weatherDependent: false
  },
  {
    id: 'party-1',
    name: 'House Party',
    description: 'Fun party with friends, music, and great vibes',
    category: 'social',
    duration: 240,
    mood: 'energetic',
    icon: '🎉',
    color: '#f97316',
    indoor: false,
    cost: 'medium',
    difficulty: 'easy',
    tags: ['party', 'social', 'music'],
    location: 'Home/Venue',
    weatherDependent: false
  },
  {
    id: 'yoga-1',
    name: 'Yoga Session',
    description: 'Mindful yoga practice for flexibility and inner peace',
    category: 'wellness',
    duration: 60,
    mood: 'peaceful',
    icon: '🧘‍♀️',
    color: '#84cc16',
    indoor: false,
    cost: 'low',
    difficulty: 'easy',
    tags: ['yoga', 'mindfulness', 'flexibility'],
    location: 'Studio/Home',
    weatherDependent: false
  },
  {
    id: 'museum-1',
    name: 'Museum Visit',
    description: 'Explore art, history, and culture at a local museum',
    category: 'culture',
    duration: 150,
    mood: 'peaceful',
    icon: '🏛️',
    color: '#a855f7',
    indoor: true,
    cost: 'medium',
    difficulty: 'easy',
    tags: ['culture', 'art', 'learning'],
    location: 'Museum',
    weatherDependent: false
  }
]

export const COST_COLORS = {
  free: '#22c55e',
  low: '#84cc16', 
  medium: '#f59e0b',
  high: '#ef4444'
} as const

export const DIFFICULTY_COLORS = {
  easy: '#22c55e',
  moderate: '#f59e0b', 
  challenging: '#ef4444'
} as const

export const CATEGORY_COLORS = {
  food: '#f59e0b',
  entertainment: '#6366f1',
  outdoor: '#10b981',
  indoor: '#06b6d4',
  social: '#ec4899',
  wellness: '#84cc16',
  culture: '#a855f7',
  sports: '#ef4444',
  creative: '#f97316',
  learning: '#14b8a6'
} as const
