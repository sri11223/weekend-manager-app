import activitiesData from '../data/mockActivities.json'

export interface Activity { 
  id: string
  title: string
  category: 'Movies & Shows' | 'Gaming' | 'Events & Culture' | 'Outdoor Fun' | 'Food & Dining'
  duration: number // minutes
  cost: number // dollars
  weatherPreference: 'indoor' | 'outdoor' | 'sunny' | 'any'
  description: string
  image: string
  [key: string]: any // Additional properties per category
}

export class MockActivitiesService {
  private activities: Activity[]

  constructor() {
    this.activities = [
      ...activitiesData.movies,
      ...activitiesData.games, 
      ...activitiesData.events,
      ...activitiesData.outdoor,
      ...activitiesData.food
    ]
  }

  // Get all activities
  async getAllActivities(): Promise<Activity[]> {
    // Simulate API delay
    await this.delay(300)
    return this.activities
  }

  // Get activities by category  
  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    await this.delay(200)
    return this.activities.filter(activity => 
      activity.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  // Get activities by weather preference
  async getActivitiesByWeather(weather: string): Promise<Activity[]> {
    await this.delay(200)
    return this.activities.filter(activity => 
      activity.weatherPreference === weather || activity.weatherPreference === 'any'
    )
  }

  // Search activities
  async searchActivities(query: string): Promise<Activity[]> {
    await this.delay(250)
    const lowerQuery = query.toLowerCase()
    return this.activities.filter(activity =>
      activity.title.toLowerCase().includes(lowerQuery) ||
      activity.description.toLowerCase().includes(lowerQuery) ||
      activity.category.toLowerCase().includes(lowerQuery)
    )
  }

  // Get activity by ID
  async getActivityById(id: string): Promise<Activity | null> {
    await this.delay(100)
    return this.activities.find(activity => activity.id === id) || null
  }

  // Get recommended activities based on weather
  async getRecommendedActivities(weatherCondition: string, maxCost?: number): Promise<Activity[]> {
    await this.delay(300)
    let recommended = this.activities

    // Filter by weather
    if (weatherCondition.toLowerCase().includes('rain')) {
      recommended = recommended.filter(a => a.weatherPreference === 'indoor')
    } else if (weatherCondition.toLowerCase().includes('sun')) {
      recommended = recommended.filter(a => 
        a.weatherPreference === 'outdoor' || a.weatherPreference === 'sunny' || a.weatherPreference === 'any'
      )
    }

    // Filter by budget
    if (maxCost !== undefined) {
      recommended = recommended.filter(a => a.cost <= maxCost)
    }

    // Return random 6 activities
    return this.shuffleArray(recommended).slice(0, 6)
  }

  // Helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
}

export const mockActivitiesService = new MockActivitiesService()
