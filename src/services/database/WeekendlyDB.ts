import Dexie, { Table } from 'dexie'
import { ScheduledActivity, Activity } from '../../types/index'

// Database schema interfaces
export interface DBScheduledActivity extends ScheduledActivity {
  id: string
  createdAt: Date
  updatedAt: Date
  syncStatus: 'synced' | 'pending' | 'error'
}

export interface DBActivityCache extends Activity {
  cachedAt: Date
  expiresAt: Date
  source: 'api' | 'local'
}

export interface DBUserPreference {
  id: string
  key: string
  value: any
  updatedAt: Date
}

export interface DBAPICache {
  id: string
  endpoint: string
  params: string
  response: any
  cachedAt: Date
  expiresAt: Date
}

// Dexie database class
export class WeekendlyDB extends Dexie {
  // Tables
  scheduledActivities!: Table<DBScheduledActivity>
  activityCache!: Table<DBActivityCache>
  userPreferences!: Table<DBUserPreference>
  apiCache!: Table<DBAPICache>

  constructor() {
    super('WeekendlyDB')
    
    this.version(1).stores({
      scheduledActivities: '++id, day, timeSlot, createdAt, updatedAt, syncStatus',
      activityCache: '++id, category, source, cachedAt, expiresAt',
      userPreferences: '++id, key, updatedAt',
      apiCache: '++id, endpoint, params, cachedAt, expiresAt'
    })

    // Hooks for automatic timestamps
    this.scheduledActivities.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date()
      obj.updatedAt = new Date()
      obj.syncStatus = 'pending'
    })

    this.scheduledActivities.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date()
      modifications.syncStatus = 'pending'
    })

    this.activityCache.hook('creating', (primKey, obj, trans) => {
      obj.cachedAt = new Date()
      // Default expiry: 24 hours for API data, 7 days for local data
      const hoursToAdd = obj.source === 'api' ? 24 : 168
      obj.expiresAt = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000)
    })

    this.userPreferences.hook('creating', (primKey, obj, trans) => {
      obj.updatedAt = new Date()
    })

    this.userPreferences.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date()
    })

    this.apiCache.hook('creating', (primKey, obj, trans) => {
      obj.cachedAt = new Date()
      // API cache expires in 1 hour by default
      obj.expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    })
  }

  // Scheduled Activities Methods
  async addScheduledActivity(activity: ScheduledActivity): Promise<string> {
    const dbActivity: Omit<DBScheduledActivity, 'id'> = {
      ...activity,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending'
    }
    return await this.scheduledActivities.add(dbActivity as DBScheduledActivity)
  }

  async updateScheduledActivity(id: string, updates: Partial<ScheduledActivity>): Promise<number> {
    return await this.scheduledActivities.update(id, {
      ...updates,
      updatedAt: new Date(),
      syncStatus: 'pending'
    })
  }

  async removeScheduledActivity(id: string): Promise<void> {
    await this.scheduledActivities.delete(id)
  }

  async getScheduledActivities(): Promise<DBScheduledActivity[]> {
    return await this.scheduledActivities.orderBy('createdAt').toArray()
  }

  async getScheduledActivitiesForDay(day: 'saturday' | 'sunday'): Promise<DBScheduledActivity[]> {
    return await this.scheduledActivities.where('day').equals(day).toArray()
  }

  async clearAllScheduledActivities(): Promise<void> {
    await this.scheduledActivities.clear()
  }

  // Activity Cache Methods
  async cacheActivity(activity: Activity, category: string, source: 'api' | 'local' = 'api'): Promise<string> {
    const cachedActivity: Omit<DBActivityCache, 'id'> = {
      ...activity,
      category,
      source,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + (source === 'api' ? 24 : 168) * 60 * 60 * 1000)
    }
    return await this.activityCache.add(cachedActivity as DBActivityCache)
  }

  async getCachedActivities(category?: string): Promise<DBActivityCache[]> {
    const now = new Date()
    let query = this.activityCache.where('expiresAt').above(now)
    
    if (category) {
      query = query.and(activity => activity.category === category)
    }
    
    return await query.toArray()
  }

  async clearExpiredCache(): Promise<void> {
    const now = new Date()
    await this.activityCache.where('expiresAt').below(now).delete()
  }

  // User Preferences Methods
  async setUserPreference(key: string, value: any): Promise<string> {
    const existing = await this.userPreferences.where('key').equals(key).first()
    
    if (existing) {
      await this.userPreferences.update(existing.id, { value, updatedAt: new Date() })
      return existing.id
    } else {
      return await this.userPreferences.add({
        id: crypto.randomUUID(),
        key,
        value,
        updatedAt: new Date()
      })
    }
  }

  async getUserPreference(key: string): Promise<any> {
    const pref = await this.userPreferences.where('key').equals(key).first()
    return pref?.value
  }

  // API Cache Methods
  async cacheAPIResponse(endpoint: string, params: any, response: any, ttlHours: number = 1): Promise<string> {
    const paramsString = JSON.stringify(params)
    const cacheKey = `${endpoint}:${paramsString}`
    
    // Remove existing cache for this endpoint+params
    await this.apiCache.where('endpoint').equals(endpoint).and(cache => cache.params === paramsString).delete()
    
    return await this.apiCache.add({
      id: crypto.randomUUID(),
      endpoint,
      params: paramsString,
      response,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + ttlHours * 60 * 60 * 1000)
    })
  }

  async getCachedAPIResponse(endpoint: string, params: any): Promise<any> {
    const paramsString = JSON.stringify(params)
    const now = new Date()
    
    const cached = await this.apiCache
      .where('endpoint').equals(endpoint)
      .and(cache => cache.params === paramsString && cache.expiresAt > now)
      .first()
    
    return cached?.response
  }

  async clearExpiredAPICache(): Promise<void> {
    const now = new Date()
    await this.apiCache.where('expiresAt').below(now).delete()
  }

  // Database maintenance
  async performMaintenance(): Promise<void> {
    await Promise.all([
      this.clearExpiredCache(),
      this.clearExpiredAPICache()
    ])
  }

  // Bulk operations for performance
  async bulkAddScheduledActivities(activities: ScheduledActivity[]): Promise<string[]> {
    const dbActivities: Omit<DBScheduledActivity, 'id'>[] = activities.map(activity => ({
      ...activity,
      createdAt: new Date(),
      updatedAt: new Date(),
      syncStatus: 'pending'
    }))
    return await this.scheduledActivities.bulkAdd(dbActivities as DBScheduledActivity[], { allKeys: true })
  }

  async bulkCacheActivities(activities: Activity[], category: string, source: 'api' | 'local' = 'api'): Promise<string[]> {
    const cachedActivities: Omit<DBActivityCache, 'id'>[] = activities.map(activity => ({
      ...activity,
      category,
      source,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + (source === 'api' ? 24 : 168) * 60 * 60 * 1000)
    }))
    return await this.activityCache.bulkAdd(cachedActivities as DBActivityCache[], { allKeys: true })
  }

  // Export/Import for backup
  async exportData(): Promise<{
    scheduledActivities: DBScheduledActivity[]
    userPreferences: DBUserPreference[]
    version: string
    exportedAt: Date
  }> {
    return {
      scheduledActivities: await this.scheduledActivities.toArray(),
      userPreferences: await this.userPreferences.toArray(),
      version: '1.0.0',
      exportedAt: new Date()
    }
  }

  async importData(data: {
    scheduledActivities: DBScheduledActivity[]
    userPreferences: DBUserPreference[]
  }): Promise<void> {
    await this.transaction('rw', this.scheduledActivities, this.userPreferences, async () => {
      await this.scheduledActivities.clear()
      await this.userPreferences.clear()
      
      await this.scheduledActivities.bulkAdd(data.scheduledActivities)
      await this.userPreferences.bulkAdd(data.userPreferences)
    })
  }
}

// Singleton instance
export const db = new WeekendlyDB()

// Initialize database and perform maintenance on startup
db.open().then(() => {
  console.log('✅ WeekendlyDB initialized successfully')
  // Perform maintenance every hour
  setInterval(() => {
    db.performMaintenance().catch(console.error)
  }, 60 * 60 * 1000)
}).catch(error => {
  console.error('❌ Failed to initialize WeekendlyDB:', error)
})
