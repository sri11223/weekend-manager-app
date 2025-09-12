import { databaseService } from '../database/DatabaseService'

export class OfflineManager {
  private static instance: OfflineManager
  private serviceWorker: ServiceWorker | null = null
  private isOnline: boolean = navigator.onLine
  private syncQueue: Array<() => Promise<void>> = []
  private listeners: Array<(online: boolean) => void> = []

  constructor() {
    this.initializeServiceWorker()
    this.setupNetworkListeners()
    this.setupPeriodicSync()
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  // Service Worker Management
  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        console.log('✅ Service Worker registered:', registration.scope)

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateAvailable()
              }
            })
          }
        })

        // Get active service worker
        this.serviceWorker = registration.active || registration.waiting || registration.installing

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this))

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error)
      }
    } else {
      console.warn('⚠️ Service Workers not supported')
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data

    switch (type) {
      case 'CACHE_STATUS':
        console.log('📊 Cache Status:', data)
        break
      case 'CACHE_CLEARED':
        console.log('🗑️ Cache cleared successfully')
        break
      case 'SYNC_COMPLETE':
        console.log('🔄 Background sync completed')
        break
    }
  }

  // Network Status Management
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('🌐 Back online - processing sync queue')
      this.processSyncQueue()
      this.notifyListeners(true)
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('📴 Gone offline - queuing operations')
      this.notifyListeners(false)
    })
  }

  // Sync Queue Management
  addToSyncQueue(operation: () => Promise<void>): void {
    this.syncQueue.push(operation)
    
    if (this.isOnline) {
      this.processSyncQueue()
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return

    console.log(`🔄 Processing ${this.syncQueue.length} queued operations`)
    
    const operations = [...this.syncQueue]
    this.syncQueue = []

    for (const operation of operations) {
      try {
        await operation()
      } catch (error) {
        console.error('❌ Sync operation failed:', error)
        // Re-queue failed operations
        this.syncQueue.push(operation)
      }
    }

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('sync-scheduled-activities')
      } catch (error) {
        console.warn('⚠️ Background sync registration failed:', error)
      }
    }
  }

  // Periodic Sync Setup
  private setupPeriodicSync(): void {
    // Sync every 5 minutes when online
    setInterval(() => {
      if (this.isOnline) {
        this.processSyncQueue()
      }
    }, 5 * 60 * 1000)
  }

  // Cache Management
  async prefetchActivities(activities: any[]): Promise<void> {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({
        type: 'PREFETCH_ACTIVITIES',
        data: { activities }
      })
    }

    // Also cache in IndexedDB
    try {
      await databaseService.cacheActivities(activities, 'prefetch', 'local')
    } catch (error) {
      console.error('Failed to cache activities in IndexedDB:', error)
    }
  }

  async getCacheStatus(): Promise<any> {
    return new Promise((resolve) => {
      if (!this.serviceWorker) {
        resolve({})
        return
      }

      const channel = new MessageChannel()
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_STATUS') {
          resolve(event.data.data)
        }
      }

      this.serviceWorker.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [channel.port2]
      )
    })
  }

  async clearCache(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.serviceWorker) {
        resolve()
        return
      }

      const channel = new MessageChannel()
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          resolve()
        }
      }

      this.serviceWorker.postMessage(
        { type: 'CLEAR_CACHE' },
        [channel.port2]
      )
    })
  }

  // Offline Data Management
  async getOfflineActivities(category?: string): Promise<any[]> {
    try {
      // Try to get from IndexedDB first
      const cachedActivities = await databaseService.getCachedActivities(category)
      
      if (cachedActivities.length > 0) {
        return cachedActivities
      }

      // Fallback to static offline data
      return this.getStaticOfflineActivities(category)
    } catch (error) {
      console.error('Failed to get offline activities:', error)
      return this.getStaticOfflineActivities(category)
    }
  }

  private getStaticOfflineActivities(category?: string): any[] {
    const staticActivities = {
      movies: [
        {
          id: 'offline-movie-1',
          name: 'Classic Movie Marathon',
          description: 'Watch your favorite classic movies',
          category: 'entertainment',
          duration: 180,
          mood: 'relaxed',
          icon: '🎬',
          color: '#8B5CF6',
          indoor: true,
          cost: 'free',
          difficulty: 'easy',
          tags: ['movies', 'indoor', 'relaxing'],
          weatherDependent: false
        }
      ],
      food: [
        {
          id: 'offline-food-1',
          name: 'Home Cooking',
          description: 'Try a new recipe from your cookbook',
          category: 'food',
          duration: 90,
          mood: 'creative',
          icon: '👨‍🍳',
          color: '#F59E0B',
          indoor: true,
          cost: 'low',
          difficulty: 'moderate',
          tags: ['cooking', 'home', 'creative'],
          weatherDependent: false
        }
      ],
      games: [
        {
          id: 'offline-game-1',
          name: 'Board Game Night',
          description: 'Play board games with family or friends',
          category: 'entertainment',
          duration: 120,
          mood: 'social',
          icon: '🎲',
          color: '#3B82F6',
          indoor: true,
          cost: 'free',
          difficulty: 'easy',
          tags: ['games', 'social', 'indoor'],
          weatherDependent: false
        }
      ],
      outdoor: [
        {
          id: 'offline-outdoor-1',
          name: 'Nature Walk',
          description: 'Take a peaceful walk in your neighborhood',
          category: 'outdoor',
          duration: 60,
          mood: 'peaceful',
          icon: '🚶‍♂️',
          color: '#10B981',
          indoor: false,
          cost: 'free',
          difficulty: 'easy',
          tags: ['walking', 'nature', 'exercise'],
          weatherDependent: true
        }
      ]
    }

    if (category && staticActivities[category as keyof typeof staticActivities]) {
      return staticActivities[category as keyof typeof staticActivities]
    }

    return Object.values(staticActivities).flat()
  }

  // Network Status
  isOffline(): boolean {
    return !this.isOnline
  }

  onNetworkChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(online: boolean): void {
    this.listeners.forEach(callback => callback(online))
  }

  // Update Management
  private showUpdateAvailable(): void {
    // Show update notification to user
    console.log('🔄 App update available')
    
    // You can integrate with your notification system here
    if (window.confirm('A new version of Weekendly is available. Reload to update?')) {
      window.location.reload()
    }
  }

  async forceUpdate(): Promise<void> {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  // Performance Monitoring
  async getPerformanceStats(): Promise<{
    cacheHitRate: number
    offlineCapability: boolean
    syncQueueSize: number
    storageUsage: any
  }> {
    const cacheStatus = await this.getCacheStatus()
    const storageStats = await databaseService.getStorageStats()
    
    return {
      cacheHitRate: 0.85, // Placeholder - would be calculated from actual metrics
      offlineCapability: Object.keys(cacheStatus).length > 0,
      syncQueueSize: this.syncQueue.length,
      storageUsage: storageStats
    }
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance()
