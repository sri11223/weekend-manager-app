import richActivitiesData from '../data/richMockActivities.json'

export interface EnhancedActivity {
  id: string
  title: string
  category: string
  duration: number
  cost: number
  weatherPreference: string
  moodTags: string[]
  description: string
  image: string
  rating?: number
  ageRating: string
  accessibility: string[]
  tags: string[]
  popularity: number
  timeAvailability: string
  location: string
  weatherRequirement?: string
  [key: string]: any
}

export class EnhancedMockService {
  private activities: EnhancedActivity[]

  constructor() {
    this.activities = [
      ...richActivitiesData.movies,
      ...richActivitiesData.games,
      ...richActivitiesData.outdoor,
      ...richActivitiesData.food,
      ...richActivitiesData.events,
      ...richActivitiesData.social,
      ...richActivitiesData.wellness
    ]
  }

  // Get activities by mood
  async getActivitiesByMood(mood: string): Promise<EnhancedActivity[]> {
    await this.delay(200)
    return this.activities.filter(activity => 
      activity.moodTags.includes(mood.toLowerCase())
    )
  }

  // Get activities by weather condition
  async getActivitiesByWeather(weather: string): Promise<EnhancedActivity[]> {
    await this.delay(200)
    
    const weatherMap = {
      'sunny': ['sunny', 'outdoor', 'any'],
      'rainy': ['indoor', 'any'],
      'cloudy': ['indoor', 'outdoor', 'partly_cloudy', 'any'],
      'clear': ['outdoor', 'sunny', 'any']
    }
    
    const validWeathers = weatherMap[weather.toLowerCase()] || ['any']
    
    return this.activities.filter(activity => 
      validWeathers.includes(activity.weatherPreference) &&
      (!activity.weatherRequirement || this.weatherMatches(weather, activity.weatherRequirement))
    )
  }

  // Smart recommendations based on mood + weather + budget
  async getSmartRecommendations(
    mood?: string, 
    weather?: string, 
    maxBudget?: number,
    timeOfDay?: string
  ): Promise<EnhancedActivity[]> {
    await this.delay(300)
    
    let filtered = this.activities

    // Filter by mood
    if (mood) {
      filtered = filtered.filter(a => a.moodTags.includes(mood.toLowerCase()))
    }

    // Filter by weather
    if (weather) {
      const weatherActivities = await this.getActivitiesByWeather(weather)
      filtered = filtered.filter(a => weatherActivities.some(wa => wa.id === a.id))
    }

    // Filter by budget
    if (maxBudget !== undefined) {
      filtered = filtered.filter(a => a.cost <= maxBudget)
    }

    // Filter by time availability
    if (timeOfDay) {
      filtered = filtered.filter(a => 
        a.timeAvailability === 'all_day' || 
        a.timeAvailability.includes(timeOfDay.toLowerCase())
      )
    }

    // Sort by popularity and return top 8
    return filtered
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8)
  }

  // Get budget-friendly activities (under $15)
  async getBudgetFriendlyActivities(): Promise<EnhancedActivity[]> {
    await this.delay(200)
    return this.activities
      .filter(a => a.cost <= 15)
      .sort((a, b) => a.cost - b.cost)
  }

  // Get free activities
  async getFreeActivities(): Promise<EnhancedActivity[]> {
    await this.delay(200)
    return this.activities.filter(a => a.cost === 0)
  }

  // Get trending activities (high popularity)
  async getTrendingActivities(): Promise<EnhancedActivity[]> {
    await this.delay(200)
    return this.activities
      .filter(a => a.popularity >= 8.0)
      .sort((a, b) => b.popularity - a.popularity)
  }

  // Search with advanced filters
  async advancedSearch(filters: {
    query?: string
    mood?: string
    weather?: string
    maxCost?: number
    category?: string
    minRating?: number
    tags?: string[]
  }): Promise<EnhancedActivity[]> {
    await this.delay(250)
    
    let results = this.activities

    // Text search
    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(a => 
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }

    // Apply all other filters
    if (filters.mood) {
      results = results.filter(a => a.moodTags.includes(filters.mood!.toLowerCase()))
    }
    
    if (filters.weather) {
      const weatherActivities = await this.getActivitiesByWeather(filters.weather)
      results = results.filter(a => weatherActivities.some(wa => wa.id === a.id))
    }
    
    if (filters.maxCost !== undefined) {
      results = results.filter(a => a.cost <= filters.maxCost!)
    }
    
    if (filters.category) {
      results = results.filter(a => a.category.toLowerCase().includes(filters.category!.toLowerCase()))
    }
    
    if (filters.minRating) {
      results = results.filter(a => (a.rating || 0) >= filters.minRating!)
    }
    
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(a => 
        filters.tags!.some(tag => a.tags.includes(tag.toLowerCase()))
      )
    }

    return results.sort((a, b) => b.popularity - a.popularity)
  }

  // Get all activities
  async getAllActivities(): Promise<EnhancedActivity[]> {
    await this.delay(200)
    return this.activities
  }

  // Get activities by category
  async getActivitiesByCategory(category: string): Promise<EnhancedActivity[]> {
    await this.delay(200)
    return this.activities.filter(activity => 
      activity.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  // Helper methods
  private weatherMatches(current: string, required: string): boolean {
    const weatherMappings = {
      'sunny': ['clear_skies', 'clear_morning', 'clear_evening', 'no_rain'],
      'rainy': ['indoor_preferred'],
      'cloudy': ['no_heavy_rain', 'partly_cloudy'],
      'clear': ['clear_skies', 'clear_morning', 'clear_evening']
    }
    
    const currentConditions = weatherMappings[current.toLowerCase()] || []
    return currentConditions.includes(required) || required === 'any'
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const enhancedMockService = new EnhancedMockService()
