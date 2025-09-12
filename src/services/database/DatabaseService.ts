import { db, DBScheduledActivity } from './WeekendlyDB'
import { ScheduledActivity, Activity } from '../../types/index'

export class DatabaseService {
  private static instance: DatabaseService
  private isOnline: boolean = navigator.onLine
  private syncQueue: (() => Promise<void>)[] = []

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.processSyncQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // Scheduled Activities Management
  async saveScheduledActivity(activity: ScheduledActivity): Promise<string> {
    try {
      const id = await db.addScheduledActivity(activity)
      
      // Add to sync queue if offline
      if (!this.isOnline) {
        this.addToSyncQueue(() => this.syncScheduledActivity(id))
      }
      
      return id
    } catch (error) {
      console.error('Failed to save scheduled activity:', error)
      throw error
    }
  }

  async updateScheduledActivity(id: string, updates: Partial<ScheduledActivity>): Promise<void> {
    try {
      await db.updateScheduledActivity(id, updates)
      
      if (!this.isOnline) {
        this.addToSyncQueue(() => this.syncScheduledActivity(id))
      }
    } catch (error) {
      console.error('Failed to update scheduled activity:', error)
      throw error
    }
  }

  async removeScheduledActivity(id: string): Promise<void> {
    try {
      await db.removeScheduledActivity(id)
    } catch (error) {
      console.error('Failed to remove scheduled activity:', error)
      throw error
    }
  }

  async getScheduledActivities(): Promise<ScheduledActivity[]> {
    try {
      const dbActivities = await db.getScheduledActivities()
      return dbActivities.map(this.mapDBActivityToScheduledActivity)
    } catch (error) {
      console.error('Failed to get scheduled activities:', error)
      return []
    }
  }

  async getScheduledActivitiesForDay(day: 'saturday' | 'sunday'): Promise<ScheduledActivity[]> {
    try {
      const dbActivities = await db.getScheduledActivitiesForDay(day)
      return dbActivities.map(this.mapDBActivityToScheduledActivity)
    } catch (error) {
      console.error('Failed to get scheduled activities for day:', error)
      return []
    }
  }

  async clearAllScheduledActivities(): Promise<void> {
    try {
      await db.clearAllScheduledActivities()
    } catch (error) {
      console.error('Failed to clear all scheduled activities:', error)
      throw error
    }
  }

  // Activity Caching for Performance
  async cacheActivities(activities: Activity[], category: string, source: 'api' | 'local' = 'api'): Promise<void> {
    try {
      // Use bulk operation for better performance
      await db.bulkCacheActivities(activities, category, source)
    } catch (error) {
      console.error('Failed to cache activities:', error)
    }
  }

  async getCachedActivities(category?: string): Promise<Activity[]> {
    try {
      const cachedActivities = await db.getCachedActivities(category)
      return cachedActivities.map(cached => ({
        id: cached.id,
        title: cached.title,
        description: cached.description,
        duration: cached.duration,
        category: cached.category,
        image: cached.image,
        rating: cached.rating,
        difficulty: cached.difficulty,
        indoor: cached.indoor,
        cost: cached.cost,
        tags: cached.tags,
        location: cached.location
      }))
    } catch (error) {
      console.error('Failed to get cached activities:', error)
      return []
    }
  }

  // API Response Caching
  async cacheAPIResponse(endpoint: string, params: any, response: any, ttlHours: number = 1): Promise<void> {
    try {
      await db.cacheAPIResponse(endpoint, params, response, ttlHours)
    } catch (error) {
      console.error('Failed to cache API response:', error)
    }
  }

  async getCachedAPIResponse(endpoint: string, params: any): Promise<any> {
    try {
      return await db.getCachedAPIResponse(endpoint, params)
    } catch (error) {
      console.error('Failed to get cached API response:', error)
      return null
    }
  }

  // User Preferences
  async saveUserPreference(key: string, value: any): Promise<void> {
    try {
      await db.setUserPreference(key, value)
    } catch (error) {
      console.error('Failed to save user preference:', error)
    }
  }

  async getUserPreference(key: string): Promise<any> {
    try {
      return await db.getUserPreference(key)
    } catch (error) {
      console.error('Failed to get user preference:', error)
      return null
    }
  }

  // Sync Management
  private addToSyncQueue(syncFn: () => Promise<void>): void {
    this.syncQueue.push(syncFn)
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return

    console.log(`🔄 Processing ${this.syncQueue.length} sync operations...`)
    
    const queue = [...this.syncQueue]
    this.syncQueue = []

    for (const syncFn of queue) {
      try {
        await syncFn()
      } catch (error) {
        console.error('Sync operation failed:', error)
        // Re-add failed operations back to queue
        this.syncQueue.push(syncFn)
      }
    }
  }

  private async syncScheduledActivity(id: string): Promise<void> {
    // Placeholder for future cloud sync functionality
    console.log(`📤 Syncing scheduled activity: ${id}`)
  }

  // Performance Optimization Methods
  async getActivitiesWithPagination(
    category?: string, 
    offset: number = 0, 
    limit: number = 20
  ): Promise<{ activities: Activity[], hasMore: boolean, total: number }> {
    try {
      const cachedActivities = await db.getCachedActivities(category)
      const total = cachedActivities.length
      const activities = cachedActivities
        .slice(offset, offset + limit)
        .map(cached => ({
          id: cached.id,
          title: cached.title,
          description: cached.description,
          duration: cached.duration,
          category: cached.category,
          image: cached.image,
          rating: cached.rating,
          difficulty: cached.difficulty,
          indoor: cached.indoor,
          cost: cached.cost,
          tags: cached.tags,
          location: cached.location
        }))

      return {
        activities,
        hasMore: offset + limit < total,
        total
      }
    } catch (error) {
      console.error('Failed to get activities with pagination:', error)
      return { activities: [], hasMore: false, total: 0 }
    }
  }

  async searchActivities(query: string, category?: string): Promise<Activity[]> {
    try {
      const cachedActivities = await db.getCachedActivities(category)
      const searchTerm = query.toLowerCase()
      
      return cachedActivities
        .filter(activity => 
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm) ||
          activity.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        )
        .map(cached => ({
          id: cached.id,
          title: cached.title,
          description: cached.description,
          duration: cached.duration,
          category: cached.category,
          image: cached.image,
          rating: cached.rating,
          difficulty: cached.difficulty,
          indoor: cached.indoor,
          cost: cached.cost,
          tags: cached.tags,
          location: cached.location
        }))
    } catch (error) {
      console.error('Failed to search activities:', error)
      return []
    }
  }

  // Data Export/Import for Backup
  async exportUserData(): Promise<Blob> {
    try {
      const data = await db.exportData()
      const jsonString = JSON.stringify(data, null, 2)
      return new Blob([jsonString], { type: 'application/json' })
    } catch (error) {
      console.error('Failed to export user data:', error)
      throw error
    }
  }

  async importUserData(file: File): Promise<void> {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await db.importData(data)
    } catch (error) {
      console.error('Failed to import user data:', error)
      throw error
    }
  }

  // Utility Methods
  private mapDBActivityToScheduledActivity(dbActivity: DBScheduledActivity): ScheduledActivity {
    const { createdAt, updatedAt, syncStatus, ...activity } = dbActivity
    return activity
  }

  async getStorageStats(): Promise<{
    scheduledActivities: number
    cachedActivities: number
    apiCache: number
    userPreferences: number
    estimatedSize: string
  }> {
    try {
      const [scheduled, cached, apiCacheCount, preferences] = await Promise.all([
        db.scheduledActivities.count(),
        db.activityCache.count(),
        db.apiCache.count(),
        db.userPreferences.count()
      ])

      // Rough estimation of storage size (not exact)
      const estimatedSize = `~${Math.round((scheduled * 2 + cached * 1.5 + apiCacheCount * 3) / 10) / 100}MB`

      return {
        scheduledActivities: scheduled,
        cachedActivities: cached,
        apiCache: apiCacheCount,
        userPreferences: preferences,
        estimatedSize
      }
    } catch (error) {
      console.error('Failed to get storage stats:', error)
      return {
        scheduledActivities: 0,
        cachedActivities: 0,
        apiCache: 0,
        userPreferences: 0,
        estimatedSize: '0MB'
      }
    }
  }

  // Health Check
  async healthCheck(): Promise<{
    database: boolean
    online: boolean
    syncQueueSize: number
  }> {
    try {
      await db.scheduledActivities.limit(1).toArray()
      return {
        database: true,
        online: this.isOnline,
        syncQueueSize: this.syncQueue.length
      }
    } catch (error) {
      return {
        database: false,
        online: this.isOnline,
        syncQueueSize: this.syncQueue.length
      }
    }
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance()
