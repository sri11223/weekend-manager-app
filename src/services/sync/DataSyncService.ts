import { databaseService } from '../database/DatabaseService'
import { offlineManager } from '../offline/OfflineManager'
import { ScheduledActivity } from '../../types/index'

export class DataSyncService {
  private static instance: DataSyncService
  private syncInProgress: boolean = false
  private lastSyncTime: number = 0
  private readonly SYNC_INTERVAL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.initializeSync()
  }

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService()
    }
    return DataSyncService.instance
  }

  private initializeSync(): void {
    // Sync on app startup
    this.performInitialSync()

    // Set up periodic sync
    setInterval(() => {
      if (!this.syncInProgress && Date.now() - this.lastSyncTime > this.SYNC_INTERVAL) {
        this.syncData()
      }
    }, this.SYNC_INTERVAL)

    // Sync when coming back online
    offlineManager.onNetworkChange((online) => {
      if (online && !this.syncInProgress) {
        setTimeout(() => this.syncData(), 1000) // Delay to ensure connection is stable
      }
    })
  }

  // Initial sync when app loads
  private async performInitialSync(): Promise<void> {
    try {
      console.log('🔄 Performing initial data sync...')
      
      // Load data from IndexedDB to memory
      const dbActivities = await databaseService.getScheduledActivities()
      
      // Check if localStorage has newer data
      const localStorageData = this.getLocalStorageData()
      
      if (localStorageData && localStorageData.state?.scheduledActivities) {
        const localActivities = localStorageData.state.scheduledActivities
        
        // Merge data (IndexedDB takes precedence for conflicts)
        const mergedActivities = this.mergeActivities(dbActivities, localActivities)
        
        // Update both stores
        await this.updateBothStores(mergedActivities)
      } else if (dbActivities.length > 0) {
        // Update localStorage with IndexedDB data
        this.updateLocalStorage(dbActivities)
      }
      
      console.log('✅ Initial sync completed')
    } catch (error) {
      console.error('❌ Initial sync failed:', error)
    }
  }

  // Main sync method
  async syncData(): Promise<void> {
    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress, skipping...')
      return
    }

    this.syncInProgress = true
    
    try {
      console.log('🔄 Starting data sync...')
      
      // Get data from both sources
      const [dbActivities, localStorageData] = await Promise.all([
        databaseService.getScheduledActivities(),
        Promise.resolve(this.getLocalStorageData())
      ])

      const localActivities = localStorageData?.state?.scheduledActivities || []

      // Determine which source is more recent
      const dbLastModified = this.getLastModifiedTime(dbActivities)
      const localLastModified = localStorageData?.lastModified || 0

      let mergedActivities: ScheduledActivity[]

      if (dbLastModified > localLastModified) {
        // IndexedDB is more recent
        mergedActivities = dbActivities
        this.updateLocalStorage(mergedActivities)
        console.log('📱 Updated localStorage from IndexedDB')
      } else if (localLastModified > dbLastModified) {
        // localStorage is more recent
        mergedActivities = localActivities
        await this.updateIndexedDB(mergedActivities)
        console.log('💾 Updated IndexedDB from localStorage')
      } else {
        // Same timestamp, merge both
        mergedActivities = this.mergeActivities(dbActivities, localActivities)
        await this.updateBothStores(mergedActivities)
        console.log('🔀 Merged data from both sources')
      }

      this.lastSyncTime = Date.now()
      console.log('✅ Data sync completed successfully')

    } catch (error) {
      console.error('❌ Data sync failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  // Force sync (called when user makes changes)
  async forceSyncFromZustand(activities: ScheduledActivity[]): Promise<void> {
    try {
      // Update both localStorage and IndexedDB
      await Promise.all([
        this.updateLocalStorage(activities),
        this.updateIndexedDB(activities)
      ])
      
      console.log('🔄 Force sync completed')
    } catch (error) {
      console.error('❌ Force sync failed:', error)
    }
  }

  // Merge activities from different sources
  private mergeActivities(
    dbActivities: ScheduledActivity[], 
    localActivities: ScheduledActivity[]
  ): ScheduledActivity[] {
    const merged = new Map<string, ScheduledActivity>()
    
    // Add all activities from both sources
    const allActivities = dbActivities.concat(localActivities)
    allActivities.forEach(activity => {
      const existing = merged.get(activity.id)
      
      if (!existing) {
        merged.set(activity.id, activity)
      } else {
        // Keep the one with later timestamp (if available)
        const existingTime = this.getActivityTimestamp(existing)
        const newTime = this.getActivityTimestamp(activity)
        
        if (newTime > existingTime) {
          merged.set(activity.id, activity)
        }
      }
    })
    
    return Array.from(merged.values())
  }

  // Update localStorage
  private updateLocalStorage(activities: ScheduledActivity[]): void {
    try {
      const data = {
        state: {
          scheduledActivities: activities
        },
        version: 1,
        lastModified: Date.now()
      }
      
      localStorage.setItem('weekendly-schedule', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to update localStorage:', error)
    }
  }

  // Update IndexedDB
  private async updateIndexedDB(activities: ScheduledActivity[]): Promise<void> {
    try {
      // Clear existing activities
      await databaseService.clearAllScheduledActivities()
      
      // Add new activities
      for (const activity of activities) {
        await databaseService.saveScheduledActivity(activity)
      }
    } catch (error) {
      console.error('Failed to update IndexedDB:', error)
      throw error
    }
  }

  // Update both stores
  private async updateBothStores(activities: ScheduledActivity[]): Promise<void> {
    await Promise.all([
      this.updateIndexedDB(activities),
      Promise.resolve(this.updateLocalStorage(activities))
    ])
  }

  // Get data from localStorage
  private getLocalStorageData(): any {
    try {
      const data = localStorage.getItem('weekendly-schedule')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to read localStorage:', error)
      return null
    }
  }

  // Get last modified time from activities
  private getLastModifiedTime(activities: ScheduledActivity[]): number {
    if (activities.length === 0) return 0
    
    return Math.max(...activities.map(activity => 
      this.getActivityTimestamp(activity)
    ))
  }

  // Get timestamp from activity (fallback to creation time)
  private getActivityTimestamp(activity: any): number {
    return activity.updatedAt?.getTime?.() || 
           activity.createdAt?.getTime?.() || 
           Date.now()
  }

  // Export data for backup
  async exportAllData(): Promise<{
    scheduledActivities: ScheduledActivity[]
    userPreferences: any
    exportedAt: Date
    version: string
  }> {
    try {
      const [dbData, userPrefs] = await Promise.all([
        databaseService.getScheduledActivities(),
        databaseService.getUserPreference('all')
      ])

      return {
        scheduledActivities: dbData,
        userPreferences: userPrefs || {},
        exportedAt: new Date(),
        version: '1.0.0'
      }
    } catch (error) {
      console.error('Failed to export data:', error)
      throw error
    }
  }

  // Import data from backup
  async importAllData(data: {
    scheduledActivities: ScheduledActivity[]
    userPreferences: any
  }): Promise<void> {
    try {
      // Clear existing data
      await databaseService.clearAllScheduledActivities()
      
      // Import scheduled activities
      for (const activity of data.scheduledActivities) {
        await databaseService.saveScheduledActivity(activity)
      }
      
      // Import user preferences
      if (data.userPreferences) {
        for (const [key, value] of Object.entries(data.userPreferences)) {
          await databaseService.saveUserPreference(key, value)
        }
      }
      
      // Update localStorage
      this.updateLocalStorage(data.scheduledActivities)
      
      console.log('✅ Data import completed')
    } catch (error) {
      console.error('❌ Data import failed:', error)
      throw error
    }
  }

  // Get sync status
  getSyncStatus(): {
    inProgress: boolean
    lastSyncTime: number
    nextSyncTime: number
  } {
    return {
      inProgress: this.syncInProgress,
      lastSyncTime: this.lastSyncTime,
      nextSyncTime: this.lastSyncTime + this.SYNC_INTERVAL
    }
  }

  // Manual sync trigger
  async manualSync(): Promise<void> {
    if (this.syncInProgress) {
      throw new Error('Sync already in progress')
    }
    
    await this.syncData()
  }
}

// Export singleton instance
export const dataSyncService = DataSyncService.getInstance()
