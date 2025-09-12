// src/config/themeCategories.ts (COMPLETE FIX)
import { Film, Utensils, Gamepad2, MapPin, Users, Plane, Coffee, Camera, Music, Book, Heart, Zap, Target, Brain, Dumbbell } from 'lucide-react'

export interface ThemeCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string
  count: number
  description: string
}

// ✅ FIXED THEME MAPPING - Add all theme variations
export const getThemeCategoriesConfig = (themeId: string): ThemeCategory[] => {
  console.log('🎨 Getting categories for theme ID:', themeId)
  
  const categoryConfigs = {
    // 🌟 ADVENTUROUS THEME
    adventurous: [
      { id: 'outdoor', name: 'Adventures', icon: MapPin, color: 'bg-green-500', count: 25, description: 'Thrilling outdoor activities' },
      { id: 'sports', name: 'Sports', icon: Zap, color: 'bg-red-500', count: 20, description: 'High-energy sports' },
      { id: 'travel', name: 'Exploration', icon: Plane, color: 'bg-blue-500', count: 18, description: 'Adventure trips & exploration' },
      { id: 'games', name: 'Action Games', icon: Gamepad2, color: 'bg-purple-500', count: 15, description: 'Exciting gaming experiences' },
      { id: 'food', name: 'Bold Cuisine', icon: Utensils, color: 'bg-orange-500', count: 12, description: 'Exotic foods & new flavors' },
      { id: 'social', name: 'Group Adventures', icon: Users, color: 'bg-pink-500', count: 10, description: 'Social adventure activities' }
    ],

    // 🛋️ LAZY/RELAXED/CALM & PEACEFUL THEME
    lazy: [
      { id: 'movies', name: 'Calm Movies', icon: Film, color: 'bg-indigo-500', count: 30, description: 'Peaceful, mindful content' },
      { id: 'food', name: 'Healthy Food', icon: Utensils, color: 'bg-orange-500', count: 25, description: 'Organic, healthy dining' },
      { id: 'wellness', name: 'Wellness', icon: Heart, color: 'bg-green-500', count: 20, description: 'Meditation, yoga, spa' },
      { id: 'books', name: 'Reading', icon: Book, color: 'bg-blue-500', count: 18, description: 'Quiet reading, libraries' },
      { id: 'nature', name: 'Nature', icon: MapPin, color: 'bg-emerald-500', count: 15, description: 'Peaceful parks, gardens' },
      { id: 'art', name: 'Art Therapy', icon: Camera, color: 'bg-purple-500', count: 12, description: 'Creative, calming activities' }
    ],
    
    // ✅ ADD RELAXED AS ALIAS FOR LAZY
    relaxed: [
      { id: 'wellness', name: 'Wellness', icon: Heart, color: 'bg-green-500', count: 25, description: 'Meditation, yoga, spa' },
      { id: 'nature', name: 'Nature', icon: MapPin, color: 'bg-emerald-500', count: 22, description: 'Peaceful parks, gardens' },
      { id: 'books', name: 'Reading', icon: Book, color: 'bg-blue-500', count: 18, description: 'Quiet reading, libraries' },
      { id: 'movies', name: 'Calm Movies', icon: Film, color: 'bg-indigo-500', count: 15, description: 'Peaceful, mindful content' },
      { id: 'food', name: 'Healthy Food', icon: Utensils, color: 'bg-orange-500', count: 12, description: 'Organic, healthy dining' },
      { id: 'art', name: 'Art Therapy', icon: Camera, color: 'bg-purple-500', count: 10, description: 'Creative, calming activities' }
    ],

    // ⚡ ENERGETIC THEME
    energetic: [
      { id: 'sports', name: 'Active Sports', icon: Dumbbell, color: 'bg-red-500', count: 28, description: 'High-energy physical activities' },
      { id: 'social', name: 'Social Events', icon: Users, color: 'bg-pink-500', count: 22, description: 'Parties, meetups, gatherings' },
      { id: 'outdoor', name: 'Outdoor Fun', icon: MapPin, color: 'bg-green-500', count: 20, description: 'Active outdoor adventures' },
      { id: 'games', name: 'Action Games', icon: Gamepad2, color: 'bg-purple-500', count: 18, description: 'Fast-paced gaming' },
      { id: 'music', name: 'Live Music', icon: Music, color: 'bg-blue-500', count: 15, description: 'Concerts, live performances' },
      { id: 'dance', name: 'Dancing', icon: Heart, color: 'bg-orange-500', count: 12, description: 'Dance classes, clubs' }
    ],

    // 💕 ROMANTIC THEME
    romantic: [
      { id: 'food', name: 'Fine Dining', icon: Utensils, color: 'bg-red-500', count: 25, description: 'Romantic restaurants & cuisine' },
      { id: 'movies', name: 'Rom-Coms', icon: Film, color: 'bg-pink-500', count: 20, description: 'Romantic movies & shows' },
      { id: 'outdoor', name: 'Scenic Spots', icon: Camera, color: 'bg-green-500', count: 18, description: 'Beautiful parks & viewpoints' },
      { id: 'culture', name: 'Arts & Culture', icon: Book, color: 'bg-purple-500', count: 15, description: 'Museums, galleries, theater' },
      { id: 'wellness', name: 'Couples Spa', icon: Heart, color: 'bg-orange-500', count: 12, description: 'Relaxation for two' },
      { id: 'travel', name: 'Getaways', icon: Plane, color: 'bg-blue-500', count: 10, description: 'Romantic weekend trips' }
    ],

    // 👥 SOCIAL THEME
    social: [
      { id: 'social', name: 'Group Events', icon: Users, color: 'bg-blue-500', count: 30, description: 'Parties, meetups, networking' },
      { id: 'food', name: 'Group Dining', icon: Utensils, color: 'bg-orange-500', count: 25, description: 'Restaurants, food tours' },
      { id: 'games', name: 'Party Games', icon: Gamepad2, color: 'bg-purple-500', count: 20, description: 'Multiplayer games, arcade' },
      { id: 'bars', name: 'Nightlife', icon: Coffee, color: 'bg-pink-500', count: 18, description: 'Bars, clubs, social venues' },
      { id: 'outdoor', name: 'Group Sports', icon: MapPin, color: 'bg-green-500', count: 15, description: 'Team activities, sports' },
      { id: 'events', name: 'Local Events', icon: Music, color: 'bg-yellow-500', count: 12, description: 'Festivals, community events' }
    ],

    // 🎨 CULTURAL THEME
    cultural: [
      { id: 'culture', name: 'Museums', icon: Book, color: 'bg-indigo-500', count: 25, description: 'Museums, galleries, exhibitions' },
      { id: 'music', name: 'Classical Music', icon: Music, color: 'bg-purple-500', count: 20, description: 'Concerts, opera, symphony' },
      { id: 'theater', name: 'Performing Arts', icon: Film, color: 'bg-red-500', count: 18, description: 'Theater, dance, performances' },
      { id: 'food', name: 'Cultural Cuisine', icon: Utensils, color: 'bg-orange-500', count: 15, description: 'Ethnic restaurants, food culture' },
      { id: 'books', name: 'Literature', icon: Book, color: 'bg-green-500', count: 12, description: 'Libraries, book readings, poetry' },
      { id: 'travel', name: 'Cultural Sites', icon: Plane, color: 'bg-blue-500', count: 10, description: 'Historical sites, landmarks' }
    ],

    // 👨‍👩‍👧‍👦 FAMILY THEME
    family: [
      { id: 'outdoor', name: 'Family Parks', icon: MapPin, color: 'bg-green-500', count: 25, description: 'Parks, playgrounds, nature' },
      { id: 'movies', name: 'Family Movies', icon: Film, color: 'bg-blue-500', count: 22, description: 'Kid-friendly entertainment' },
      { id: 'games', name: 'Family Games', icon: Gamepad2, color: 'bg-purple-500', count: 20, description: 'Board games, family fun centers' },
      { id: 'food', name: 'Family Dining', icon: Utensils, color: 'bg-orange-500', count: 18, description: 'Kid-friendly restaurants' },
      { id: 'education', name: 'Learning', icon: Book, color: 'bg-yellow-500', count: 15, description: 'Museums, science centers' },
      { id: 'events', name: 'Family Events', icon: Users, color: 'bg-pink-500', count: 12, description: 'Festivals, community activities' }
    ],

    // ✅ ADD FOCUS MODE THEME
    focus: [
      { id: 'wellness', name: 'Wellness', icon: Heart, color: 'bg-green-500', count: 25, description: 'Meditation, yoga, mindfulness' },
      { id: 'nature', name: 'Nature', icon: MapPin, color: 'bg-emerald-500', count: 22, description: 'Peaceful natural spaces' },
      { id: 'books', name: 'Reading', icon: Book, color: 'bg-blue-500', count: 18, description: 'Focus-enhancing reading' },
      { id: 'movies', name: 'Calm Movies', icon: Film, color: 'bg-indigo-500', count: 15, description: 'Mindful, inspiring content' },
      { id: 'food', name: 'Healthy Food', icon: Utensils, color: 'bg-orange-500', count: 12, description: 'Brain-boosting nutrition' },
      { id: 'art', name: 'Art Therapy', icon: Camera, color: 'bg-purple-500', count: 10, description: 'Creative focus activities' }
    ],

    // ✅ ADD PRODUCTIVE THEME (another name for focus)
    productive: [
      { id: 'work', name: 'Productivity', icon: Target, color: 'bg-blue-500', count: 25, description: 'Goal-oriented activities' },
      { id: 'wellness', name: 'Mind Training', icon: Brain, color: 'bg-green-500', count: 22, description: 'Focus and concentration' },
      { id: 'books', name: 'Learning', icon: Book, color: 'bg-purple-500', count: 18, description: 'Skill development reading' },
      { id: 'food', name: 'Brain Food', icon: Utensils, color: 'bg-orange-500', count: 15, description: 'Productivity-boosting meals' },
      { id: 'nature', name: 'Focus Walks', icon: MapPin, color: 'bg-emerald-500', count: 12, description: 'Mindful outdoor time' },
      { id: 'art', name: 'Creative Work', icon: Camera, color: 'bg-pink-500', count: 10, description: 'Productive creative activities' }
    ],

    // 🧘 CALM & PEACEFUL THEME (Default fallback)
    'calm & peaceful': [
      { id: 'wellness', name: 'Wellness', icon: Heart, color: 'bg-green-500', count: 25, description: 'Meditation, yoga, spa' },
      { id: 'nature', name: 'Nature', icon: MapPin, color: 'bg-emerald-500', count: 22, description: 'Peaceful parks, gardens' },
      { id: 'books', name: 'Reading', icon: Book, color: 'bg-blue-500', count: 18, description: 'Quiet reading, libraries' },
      { id: 'movies', name: 'Calm Movies', icon: Film, color: 'bg-indigo-500', count: 15, description: 'Peaceful, mindful content' },
      { id: 'food', name: 'Healthy Food', icon: Utensils, color: 'bg-orange-500', count: 12, description: 'Organic, healthy dining' },
      { id: 'art', name: 'Art Therapy', icon: Camera, color: 'bg-purple-500', count: 10, description: 'Creative, calming activities' }
    ]
  }

  // ✅ BETTER THEME MATCHING - Try exact match first, then fallbacks
  let themeConfig = categoryConfigs[themeId as keyof typeof categoryConfigs]
  
  if (!themeConfig) {
    // Try common theme name variations
    const themeVariations: Record<string, keyof typeof categoryConfigs> = {
      'focus mode': 'focus',
      'focus-mode': 'focus',
      'focusmode': 'focus',
      'productivity': 'productive',
      'calm-peaceful': 'calm & peaceful',
      'calm_peaceful': 'calm & peaceful',
      'calmpeaceful': 'calm & peaceful'
    }
    
    const normalizedThemeId = themeId.toLowerCase().replace(/[^a-z]/g, '')
    const matchedVariation = Object.keys(themeVariations).find(variation => 
      variation.replace(/[^a-z]/g, '') === normalizedThemeId
    )
    
    if (matchedVariation) {
      themeConfig = categoryConfigs[themeVariations[matchedVariation]]
      console.log('✅ Found theme variation:', matchedVariation, '→', themeVariations[matchedVariation])
    }
  }
  
  if (!themeConfig) {
    console.log('⚠️ Theme not found, using default calm & peaceful for:', themeId)
    themeConfig = categoryConfigs['calm & peaceful']
  }
  
  console.log('📂 Selected theme config:', themeId, '→', themeConfig.length, 'categories')
  return themeConfig
}

// ✅ THEME-SPECIFIC ACTIVITY PROMPT MODIFIERS
export const getThemeActivityModifiers = (themeId: string) => {
  const modifiers = {
    adventurous: {
      prefix: 'Adventure',
      keywords: ['thrilling', 'exciting', 'bold', 'challenging', 'extreme'],
      mood: ['energetic', 'adventurous', 'fun'],
      costBias: 'medium-high'
    },
    lazy: {
      prefix: 'Relaxing',
      keywords: ['cozy', 'comfortable', 'easy', 'peaceful', 'low-key'],
      mood: ['relaxed', 'peaceful', 'cozy'],
      costBias: 'low-medium'
    },
    relaxed: {
      prefix: 'Peaceful',
      keywords: ['calm', 'serene', 'gentle', 'soothing', 'tranquil'],
      mood: ['peaceful', 'relaxed', 'calm'],
      costBias: 'low-medium'
    },
    energetic: {
      prefix: 'High-Energy',
      keywords: ['active', 'dynamic', 'fast-paced', 'exciting', 'vibrant'],
      mood: ['energetic', 'fun', 'social'],
      costBias: 'medium'
    },
    romantic: {
      prefix: 'Romantic',
      keywords: ['intimate', 'beautiful', 'romantic', 'elegant', 'special'],
      mood: ['romantic', 'cozy', 'peaceful'],
      costBias: 'medium-high'
    },
    social: {
      prefix: 'Social',
      keywords: ['group', 'social', 'interactive', 'community', 'shared'],
      mood: ['social', 'fun', 'energetic'],
      costBias: 'medium'
    },
    cultural: {
      prefix: 'Cultural',
      keywords: ['educational', 'artistic', 'refined', 'sophisticated', 'enriching'],
      mood: ['creative', 'peaceful', 'productive'],
      costBias: 'medium'
    },
    family: {
      prefix: 'Family-Friendly',
      keywords: ['safe', 'fun', 'educational', 'wholesome', 'engaging'],
      mood: ['fun', 'social', 'family'],
      costBias: 'low-medium'
    },
    focus: {
      prefix: 'Focus-Enhancing',
      keywords: ['mindful', 'concentrating', 'productive', 'centered', 'purposeful'],
      mood: ['peaceful', 'productive', 'focused'],
      costBias: 'low-medium'
    },
    productive: {
      prefix: 'Productivity-Boosting',
      keywords: ['efficient', 'goal-oriented', 'purposeful', 'structured', 'achievement'],
      mood: ['productive', 'focused', 'energetic'],
      costBias: 'medium'
    }
  }

  return modifiers[themeId as keyof typeof modifiers] || modifiers.relaxed
}
