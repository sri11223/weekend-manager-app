import { Activity, ActivityCategory, Mood, CostLevel, DifficultyLevel } from '../types'

// AI Context and Request Types
export interface AIContext {
  location: string
  theme: string
  weather?: {
    temperature: number
    condition: string
    isGoodForOutdoor: boolean
  }
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  budget?: number
  userPreferences?: string[]
}

export interface AIActivityRequest {
  category: string
  count: number
  context: AIContext
}

export interface AIResponse {
  activities: Activity[]
  insights?: string[]
  recommendations?: string[]
}

class GroqAIService {
  private apiKey: string
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions'
  private cache = new Map<string, Activity[]>()
  // private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes - unused
  
  // ✅ WORKING MODELS ONLY (removed deprecated ones)
  private models = [
    'gemma2-9b-it',             // Primary - working model
    'llama3-8b-8192'            // Backup - if available
  ]

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!this.apiKey) {
      console.warn('⚠️ Groq API key not found. Using mock data.')
    }
  }

  // Helper methods for mapping AI response to Activity type
  private mapMoodFromTags(moodTags: string[]): Mood {
    if (!moodTags || moodTags.length === 0) return 'relaxed'
    
    const moodMap: Record<string, Mood> = {
      'energetic': 'energetic',
      'relaxed': 'relaxed',
      'adventurous': 'adventurous',
      'social': 'social',
      'peaceful': 'peaceful',
      'creative': 'creative',
      'romantic': 'romantic',
      'family': 'family'
    }
    
    for (const tag of moodTags) {
      if (moodMap[tag.toLowerCase()]) {
        return moodMap[tag.toLowerCase()]
      }
    }
    return 'relaxed'
  }

  private mapCostLevel(cost: number): CostLevel {
    if (cost === 0) return 'free'
    if (cost <= 25) return 'low'
    if (cost <= 75) return 'medium'
    return 'high'
  }

  private getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'food': '🍽️',
      'movies': '🎬',
      'games': '🎮',
      'outdoor': '🌲',
      'social': '👥',
      'entertainment': '🎭',
      'indoor': '🏠',
      'wellness': '🧘',
      'culture': '🎨',
      'sports': '⚽',
      'creative': '🎨',
      'learning': '📚',
      'trip-planning': '✈️'
    }
    return iconMap[category] || '📅'
  }

  private getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
      'food': '#FF6B6B',
      'movies': '#4ECDC4',
      'games': '#45B7D1',
      'outdoor': '#96CEB4',
      'social': '#FFEAA7',
      'entertainment': '#DDA0DD',
      'indoor': '#98D8C8',
      'wellness': '#F7DC6F',
      'culture': '#BB8FCE',
      'sports': '#85C1E9',
      'creative': '#F8C471',
      'learning': '#82E0AA',
      'trip-planning': '#F39C12'
    }
    return colorMap[category] || '#95A5A6'
  }

  // ✅ SIMPLE & RELIABLE PROMPT
  private buildPrompt(request: AIActivityRequest): string {
    const { category, count, context } = request
    const { location, theme } = context

    return `Generate ${count} ${category} activities for ${location} with ${theme} theme.

Return ONLY a JSON array with this exact format:
[
  {
    "id": "activity-1", 
    "title": "Activity Name",
    "description": "Brief description",
    "duration": 90,
    "cost": 20,
    "moodTags": ["relaxed"],
    "difficulty": "easy",
    "location": "Specific location"
  }
]`
  }

  private getCacheKey(request: AIActivityRequest): string {
    const { category, count, context } = request
    return `${category}-${count}-${context.location}-${context.theme}`
  }

  private formatAndValidateActivities(activities: any[], category: string): Activity[] {
    return activities.map((activity: any, index: number) => ({
      id: activity.id || `${category}-${index + 1}`,
      name: activity.title || activity.name || `${category} Activity ${index + 1}`,
      description: activity.description || `Great ${category} activity`,
      category: category as ActivityCategory,
      duration: Math.max(30, Math.min(240, activity.duration || 90)),
      mood: this.mapMoodFromTags(activity.moodTags) as Mood,
      icon: this.getCategoryIcon(category),
      color: this.getCategoryColor(category),
      indoor: activity.weatherPreference === 'indoor' || category === 'movies' || category === 'games',
      cost: this.mapCostLevel(activity.cost || 0) as CostLevel,
      difficulty: (activity.difficulty || 'moderate') as DifficultyLevel,
      tags: activity.moodTags || [category],
      location: activity.location || 'Local area',
      weatherDependent: activity.weatherPreference === 'outdoor'
    }))
  }

  // ✅ TRY MULTIPLE MODELS WITH FALLBACK
  async generateActivities(request: AIActivityRequest): Promise<Activity[]> {
    const cacheKey = this.getCacheKey(request)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`✅ Using cached activities for ${request.category}`)
      return this.cache.get(cacheKey)!
    }

    // If no API key, use mock data immediately
    if (!this.apiKey) {
      console.log('🔄 No API key, using mock activities')
      return this.generateMockActivities(request)
    }

    // Try each model until one works
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i]
      
      try {
        console.log(`🤖 Trying model ${model} for ${request.category}...`)
        
        const prompt = this.buildPrompt(request)
        
        const requestPayload = {
          model: model, // ✅ Use current working model
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Respond only with valid JSON arrays.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          top_p: 1,
          stream: false
        }

        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(requestPayload)
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.warn(`⚠️ Model ${model} failed:`, errorText)
          
          // If it's a model error, try next model
          if (errorText.includes('model') || errorText.includes('decommissioned')) {
            continue
          }
          
          throw new Error(`API error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        const content = data.choices[0]?.message?.content

        if (!content) {
          console.warn(`⚠️ Model ${model} returned no content, trying next...`)
          continue
        }

        // Parse JSON response
        let activities
        try {
          const cleanedContent = content.trim().replace(/``````/g, '')
          activities = JSON.parse(cleanedContent)
        } catch (parseError) {
          console.warn(`⚠️ Model ${model} returned invalid JSON, trying next...`)
          continue
        }

        // Validate response format
        if (!Array.isArray(activities)) {
          if (activities.activities && Array.isArray(activities.activities)) {
            activities = activities.activities
          } else {
            console.warn(`⚠️ Model ${model} returned invalid format, trying next...`)
            continue
          }
        }

        // Success! Format and cache the results
        const formattedActivities = this.formatAndValidateActivities(activities, request.category)
        this.cache.set(cacheKey, formattedActivities)
        
        console.log(`✅ Success with model ${model}! Generated ${formattedActivities.length} activities for ${request.category}`)
        return formattedActivities

      } catch (error) {
        console.warn(`⚠️ Model ${model} failed:`, error)
        
        // If this is the last model, fall back to mock data
        if (i === this.models.length - 1) {
          console.log('❌ All models failed, using mock activities')
          return this.generateMockActivities(request)
        }
        
        // Otherwise, try the next model
        continue
      }
    }

    // Fallback if all models fail
    console.log('🔄 All AI models failed, falling back to mock activities')
    return this.generateMockActivities(request)
  }

  // ✅ THEME-AWARE MOCK ACTIVITIES
  private generateMockActivities(request: AIActivityRequest): Activity[] {
    const { category, count, context } = request
    const { theme, location } = context

    // Theme-specific activity variations
    const themeAdjustments = {
      'adventurous': { prefix: 'Adventure', moodTags: ['adventurous', 'energetic'] },
      'lazy': { prefix: 'Relaxed', moodTags: ['relaxed', 'peaceful'] },
      'energetic': { prefix: 'High-Energy', moodTags: ['energetic', 'fun'] },
      'romantic': { prefix: 'Romantic', moodTags: ['romantic', 'cozy'] },
      'social': { prefix: 'Social', moodTags: ['social', 'fun'] },
      'cultural': { prefix: 'Cultural', moodTags: ['cultural', 'educational'] },
      'family': { prefix: 'Family-Friendly', moodTags: ['family', 'fun'] },
      'calm & peaceful': { prefix: 'Peaceful', moodTags: ['peaceful', 'relaxed'] }
    }

    const adjustment = themeAdjustments[theme as keyof typeof themeAdjustments] || 
                     { prefix: 'Weekend', moodTags: ['fun', 'relaxed'] }

    // Enhanced templates with theme variations
    const templates: Record<string, any[]> = {
      movies: [
        {
          title: `${adjustment.prefix} Cinema Experience`,
          description: `Enjoy ${theme} movies at ${location}'s premier theater`,
          duration: 120,
          cost: theme === 'lazy' ? 12 : 18,
          moodTags: adjustment.moodTags,
          difficulty: 'easy',
          location: 'Downtown Cinema Complex'
        },
        {
          title: `${adjustment.prefix} Film Festival`,
          description: `Curated film selection perfect for a ${theme} weekend`,
          duration: 150,
          cost: theme === 'cultural' ? 25 : 15,
          moodTags: adjustment.moodTags,
          difficulty: 'easy',
          location: 'Art House Theater'
        }
      ],
      food: [
        {
          title: `${adjustment.prefix} Dining Experience`,
          description: `Perfect ${theme} restaurant experience in ${location}`,
          duration: theme === 'lazy' ? 60 : 90,
          cost: theme === 'romantic' ? 75 : 35,
          moodTags: adjustment.moodTags,
          difficulty: 'easy',
          location: 'Local Restaurant District'
        },
        {
          title: `${adjustment.prefix} Food Tour`,
          description: `Explore ${location}'s cuisine with a ${theme} twist`,
          duration: theme === 'adventurous' ? 180 : 120,
          cost: 45,
          moodTags: adjustment.moodTags,
          difficulty: theme === 'adventurous' ? 'moderate' : 'easy',
          location: 'Food Market Area'
        }
      ],
      games: [
        {
          title: `${adjustment.prefix} Gaming Session`,
          description: `Perfect ${theme} gaming experience for your weekend`,
          duration: theme === 'energetic' ? 180 : 120,
          cost: 25,
          moodTags: adjustment.moodTags,
          difficulty: theme === 'lazy' ? 'easy' : 'moderate',
          location: 'Gaming Center'
        },
        {
          title: `${adjustment.prefix} Game Night`,
          description: `${theme} board games and activities`,
          duration: 150,
          cost: 20,
          moodTags: adjustment.moodTags,
          difficulty: 'easy',
          location: 'Board Game Cafe'
        }
      ],
      outdoor: [
        {
          title: `${adjustment.prefix} Nature Experience`,
          description: `${theme} outdoor adventure in ${location}'s natural areas`,
          duration: theme === 'adventurous' ? 240 : theme === 'lazy' ? 90 : 150,
          cost: theme === 'lazy' ? 0 : 15,
          moodTags: adjustment.moodTags,
          difficulty: theme === 'adventurous' ? 'challenging' : theme === 'lazy' ? 'easy' : 'moderate',
          location: 'Regional Park'
        },
        {
          title: `${adjustment.prefix} Outdoor Activity`,
          description: `Perfect ${theme} outdoor experience for the weekend`,
          duration: 120,
          cost: 10,
          moodTags: adjustment.moodTags,
          difficulty: 'moderate',
          location: 'Outdoor Recreation Area'
        }
      ],
      social: [
        {
          title: `${adjustment.prefix} Social Gathering`,
          description: `${theme} social experience in ${location}`,
          duration: theme === 'energetic' ? 180 : 120,
          cost: theme === 'romantic' ? 50 : 30,
          moodTags: adjustment.moodTags,
          difficulty: 'easy',
          location: 'Social District'
        },
        {
          title: `${adjustment.prefix} Community Event`,
          description: `Join ${theme} community activities and meet locals`,
          duration: 150,
          cost: 15,
          moodTags: adjustment.moodTags,
          difficulty: 'easy',
          location: 'Community Center'
        }
      ],
      'trip-planning': [
        {
          title: `${adjustment.prefix} Day Trip`,
          description: `${theme} day trip adventure from ${location}`,
          duration: theme === 'adventurous' ? 480 : 360,
          cost: theme === 'romantic' ? 120 : 80,
          moodTags: adjustment.moodTags,
          difficulty: theme === 'lazy' ? 'easy' : 'moderate',
          location: 'Scenic Destinations'
        },
        {
          title: `${adjustment.prefix} Weekend Getaway`,
          description: `Perfect ${theme} weekend escape near ${location}`,
          duration: 720,
          cost: 200,
          moodTags: adjustment.moodTags,
          difficulty: 'moderate',
          location: 'Weekend Destination'
        }
      ]
    }

    const categoryTemplates = templates[category] || templates.movies
    const mockActivities = []

    // Generate activities with theme-based variations
    for (let i = 0; i < count; i++) {
      const template = categoryTemplates[i % categoryTemplates.length]
      mockActivities.push({
        ...template,
        id: `${category}-${theme.replace(/\s+/g, '-')}-${i + 1}`,
        title: i > 0 ? `${template.title} ${i + 1}` : template.title,
        description: template.description
      })
    }

    console.log(`🎭 Generated ${mockActivities.length} mock ${category} activities for ${theme} theme`)
    return this.formatAndValidateActivities(mockActivities, category)
  }

  // Generate activities for all categories using mock data
  async generateAllCategories(context: AIContext): Promise<Record<string, Activity[]>> {
    // Import mock data service
    const { MockActivityService } = await import('../data/mockActivities')
    const { getThemeCategoriesConfig } = await import('../config/themeCategories')
    
    const themeCategories = getThemeCategoriesConfig(context.theme)
    const categories = themeCategories.map(cat => cat.id)
    
    const results: Record<string, Activity[]> = {}

    console.log(`🎭 Loading mock activities for theme: ${context.theme}`, categories)

    // Load mock activities for each category
    categories.forEach(category => {
      const mockActivities = MockActivityService.getActivitiesByThemeAndCategory(context.theme, category)
      if (mockActivities.length > 0) {
        results[category] = mockActivities
      } else {
        // Fallback to empty array if no mock data
        results[category] = []
      }
    })

    console.log(`🎯 Loaded mock activities for all categories with ${context.theme} theme`)
    return results
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear()
    console.log('🧹 AI cache cleared')
  }

  // Get activity counts by category
  getCategoryCounts(allActivities: Record<string, Activity[]>): Record<string, number> {
    const counts: Record<string, number> = {}
    Object.entries(allActivities).forEach(([category, activities]) => {
      counts[category] = activities.length
    })
    return counts
  }

  // ✅ TEST WITH CURRENT MODELS
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      console.log('❌ No API key for testing')
      return false
    }

    for (const model of this.models) {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 10
          })
        })

        if (response.ok) {
          console.log(`✅ Groq API connection successful with model: ${model}`)
          return true
        }
      } catch (error) {
        console.log(`⚠️ Model ${model} failed test:`, error)
      }
    }

    console.error('❌ All models failed API test')
    return false
  }
}

export default new GroqAIService()
