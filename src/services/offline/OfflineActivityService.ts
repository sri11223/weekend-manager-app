import { Activity, ActivityCategory } from '../../types/index'
import { databaseService } from '../database/DatabaseService'
import { offlineManager } from './OfflineManager'

export class OfflineActivityService {
  private static instance: OfflineActivityService
  private cachedActivities: Map<string, Activity[]> = new Map()
  private lastFetchTime: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  static getInstance(): OfflineActivityService {
    if (!OfflineActivityService.instance) {
      OfflineActivityService.instance = new OfflineActivityService()
    }
    return OfflineActivityService.instance
  }

  // Main method to get activities with offline support
  async getActivities(
    category: string,
    options: {
      limit?: number
      offset?: number
      forceRefresh?: boolean
      searchQuery?: string
    } = {}
  ): Promise<{
    activities: Activity[]
    hasMore: boolean
    total: number
    fromCache: boolean
    offline: boolean
  }> {
    const { limit = 20, offset = 0, forceRefresh = false, searchQuery } = options
    const isOnline = !offlineManager.isOffline()
    
    try {
      // Check if we have fresh cached data
      if (!forceRefresh && this.hasFreshCache(category)) {
        const cached = this.cachedActivities.get(category) || []
        const filtered = this.filterActivities(cached, searchQuery)
        
        return {
          activities: filtered.slice(offset, offset + limit),
          hasMore: offset + limit < filtered.length,
          total: filtered.length,
          fromCache: true,
          offline: !isOnline
        }
      }

      // Try to fetch from network if online
      if (isOnline && !offlineManager.isOffline()) {
        try {
          const networkActivities = await this.fetchFromNetwork(category)
          
          // Cache the results
          this.cachedActivities.set(category, networkActivities)
          this.lastFetchTime.set(category, Date.now())
          
          // Store in IndexedDB for offline access
          await databaseService.cacheActivities(networkActivities, category, 'api')
          
          const filtered = this.filterActivities(networkActivities, searchQuery)
          
          return {
            activities: filtered.slice(offset, offset + limit),
            hasMore: offset + limit < filtered.length,
            total: filtered.length,
            fromCache: false,
            offline: false
          }
        } catch (networkError) {
          console.warn('Network fetch failed, falling back to cache:', networkError)
        }
      }

      // Fallback to IndexedDB cache
      const dbActivities = await databaseService.getCachedActivities(category)
      if (dbActivities.length > 0) {
        this.cachedActivities.set(category, dbActivities)
        const filtered = this.filterActivities(dbActivities, searchQuery)
        
        return {
          activities: filtered.slice(offset, offset + limit),
          hasMore: offset + limit < filtered.length,
          total: filtered.length,
          fromCache: true,
          offline: !isOnline
        }
      }

      // Final fallback to static offline data
      const offlineActivities = await offlineManager.getOfflineActivities(category)
      const filtered = this.filterActivities(offlineActivities, searchQuery)
      
      return {
        activities: filtered.slice(offset, offset + limit),
        hasMore: offset + limit < filtered.length,
        total: filtered.length,
        fromCache: true,
        offline: true
      }

    } catch (error) {
      console.error('Failed to get activities:', error)
      
      // Return empty result with error indication
      return {
        activities: [],
        hasMore: false,
        total: 0,
        fromCache: false,
        offline: !isOnline
      }
    }
  }

  // Search activities across all categories
  async searchActivities(
    query: string,
    options: {
      categories?: string[]
      limit?: number
    } = {}
  ): Promise<Activity[]> {
    const { categories, limit = 50 } = options
    const searchCategories = categories || ['movies', 'food', 'games', 'outdoor', 'social']
    
    const allResults: Activity[] = []
    
    for (const category of searchCategories) {
      try {
        const result = await this.getActivities(category, { 
          searchQuery: query,
          limit: Math.ceil(limit / searchCategories.length)
        })
        allResults.push(...result.activities)
      } catch (error) {
        console.warn(`Search failed for category ${category}:`, error)
      }
    }

    // Sort by relevance (simple scoring based on query match)
    return allResults
      .map(activity => ({
        ...activity,
        relevanceScore: this.calculateRelevanceScore(activity, query)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
      .map(({ relevanceScore, ...activity }) => activity)
  }

  // Prefetch activities for offline use
  async prefetchForOffline(categories: string[] = ['movies', 'food', 'games', 'outdoor']): Promise<void> {
    console.log('📦 Prefetching activities for offline use...')
    
    const prefetchPromises = categories.map(async (category) => {
      try {
        const result = await this.getActivities(category, { 
          limit: 50, 
          forceRefresh: true 
        })
        
        console.log(`✅ Prefetched ${result.activities.length} ${category} activities`)
        return result.activities
      } catch (error) {
        console.error(`❌ Failed to prefetch ${category} activities:`, error)
        return []
      }
    })

    const allActivities = (await Promise.all(prefetchPromises)).flat()
    
    // Prefetch images through service worker
    await offlineManager.prefetchActivities(allActivities)
    
    console.log(`🎯 Prefetch complete: ${allActivities.length} total activities cached`)
  }

  // Get activity recommendations based on weather, mood, etc.
  async getRecommendations(context: {
    weather?: string
    mood?: string
    timeOfDay?: 'morning' | 'afternoon' | 'evening'
    duration?: number
    indoor?: boolean
  }): Promise<Activity[]> {
    const allCategories = ['movies', 'food', 'games', 'outdoor', 'social']
    const recommendations: Activity[] = []

    for (const category of allCategories) {
      try {
        const result = await this.getActivities(category, { limit: 10 })
        const filtered = this.filterByContext(result.activities, context)
        recommendations.push(...filtered)
      } catch (error) {
        console.warn(`Failed to get recommendations for ${category}:`, error)
      }
    }

    // Score and sort recommendations
    return recommendations
      .map(activity => ({
        ...activity,
        score: this.calculateContextScore(activity, context)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(({ score, ...activity }) => activity)
  }

  // Private helper methods
  private async fetchFromNetwork(category: string): Promise<Activity[]> {
    // This would integrate with your existing API services
    // For now, returning a placeholder that would call the actual APIs
    
    switch (category) {
      case 'movies':
        // return await tmdbService.getMovies()
        return this.getMockMovieActivities()
      case 'food':
        // return await foodService.getRestaurants()
        return this.getMockFoodActivities()
      case 'games':
        // return await gamesService.getGames()
        return this.getMockGameActivities()
      case 'outdoor':
        return this.getMockOutdoorActivities()
      default:
        return []
    }
  }

  private hasFreshCache(category: string): boolean {
    const lastFetch = this.lastFetchTime.get(category)
    if (!lastFetch) return false
    
    return Date.now() - lastFetch < this.CACHE_DURATION
  }

  private filterActivities(activities: Activity[], query?: string): Activity[] {
    if (!query) return activities
    
    const searchTerm = query.toLowerCase()
    return activities.filter(activity =>
      activity.name.toLowerCase().includes(searchTerm) ||
      activity.description.toLowerCase().includes(searchTerm) ||
      activity.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  private calculateRelevanceScore(activity: Activity, query: string): number {
    const searchTerm = query.toLowerCase()
    let score = 0
    
    // Name match (highest weight)
    if (activity.name.toLowerCase().includes(searchTerm)) {
      score += 10
    }
    
    // Description match
    if (activity.description.toLowerCase().includes(searchTerm)) {
      score += 5
    }
    
    // Tag matches
    const tagMatches = activity.tags.filter(tag => 
      tag.toLowerCase().includes(searchTerm)
    ).length
    score += tagMatches * 3
    
    return score
  }

  private filterByContext(activities: Activity[], context: any): Activity[] {
    return activities.filter(activity => {
      // Weather-based filtering
      if (context.weather === 'rain' && activity.weatherDependent) {
        return false
      }
      
      // Indoor/outdoor preference
      if (context.indoor !== undefined && activity.indoor !== context.indoor) {
        return false
      }
      
      // Duration filtering
      if (context.duration && Math.abs(activity.duration - context.duration) > 60) {
        return false
      }
      
      return true
    })
  }

  private calculateContextScore(activity: Activity, context: any): number {
    let score = 0
    
    // Mood matching
    if (context.mood && activity.mood === context.mood) {
      score += 5
    }
    
    // Time of day preferences
    if (context.timeOfDay === 'evening' && activity.category === 'entertainment') {
      score += 3
    }
    
    // Weather bonus
    if (context.weather === 'sunny' && !activity.indoor) {
      score += 2
    }
    
    return score
  }

  // Mock data methods (replace with actual API calls)
  private getMockMovieActivities(): Activity[] {
    return [
      {
        id: 'movie-1',
        name: 'Watch Latest Blockbuster',
        description: 'Enjoy the newest action movie at the cinema',
        category: 'entertainment' as ActivityCategory,
        duration: 150,
        mood: 'energetic',
        icon: '🎬',
        color: '#8B5CF6',
        indoor: true,
        cost: 'medium',
        difficulty: 'easy',
        tags: ['movies', 'cinema', 'action'],
        weatherDependent: false
      }
    ]
  }

  private getMockFoodActivities(): Activity[] {
    return [
      {
        id: 'food-1',
        name: 'Try New Restaurant',
        description: 'Discover a highly-rated local restaurant',
        category: 'food' as ActivityCategory,
        duration: 90,
        mood: 'social',
        icon: '🍽️',
        color: '#F59E0B',
        indoor: true,
        cost: 'medium',
        difficulty: 'easy',
        tags: ['dining', 'restaurant', 'food'],
        weatherDependent: false
      }
    ]
  }

  private getMockGameActivities(): Activity[] {
    return [
      {
        id: 'game-1',
        name: 'Play New Video Game',
        description: 'Try out the latest indie game release',
        category: 'entertainment' as ActivityCategory,
        duration: 120,
        mood: 'relaxed',
        icon: '🎮',
        color: '#3B82F6',
        indoor: true,
        cost: 'low',
        difficulty: 'moderate',
        tags: ['gaming', 'video games', 'indie'],
        weatherDependent: false
      }
    ]
  }

  private getMockOutdoorActivities(): Activity[] {
    return [
      {
        id: 'outdoor-1',
        name: 'Hiking Trail',
        description: 'Explore a scenic hiking trail nearby',
        category: 'outdoor' as ActivityCategory,
        duration: 180,
        mood: 'adventurous',
        icon: '🥾',
        color: '#10B981',
        indoor: false,
        cost: 'free',
        difficulty: 'challenging',
        tags: ['hiking', 'nature', 'exercise'],
        weatherDependent: true
      }
    ]
  }
}

// Export singleton instance
export const offlineActivityService = OfflineActivityService.getInstance()
