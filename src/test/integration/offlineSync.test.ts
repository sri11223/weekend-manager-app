import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DatabaseService } from '../../services/database/DatabaseService'
import { DataSyncService } from '../../services/sync/DataSyncService'
import { OfflineManager } from '../../services/offline/OfflineManager'
import { mockActivity, mockScheduledActivity } from '../utils/testUtils'

// Mock IndexedDB
vi.mock('dexie', () => ({
  Dexie: vi.fn().mockImplementation(() => ({
    scheduledActivities: {
      add: vi.fn(),
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
      where: vi.fn().mockReturnThis(),
      equals: vi.fn().mockReturnThis(),
    },
    activityCache: {
      add: vi.fn(),
      put: vi.fn(),
      get: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
    open: vi.fn().mockResolvedValue(true),
  })),
}))

describe('Offline Sync Integration', () => {
  let databaseService: DatabaseService
  let syncService: DataSyncService
  let offlineManager: OfflineManager

  beforeEach(() => {
    vi.clearAllMocks()
    databaseService = new DatabaseService()
    syncService = new DataSyncService()
    offlineManager = new OfflineManager()
  })

  it('syncs data between localStorage and IndexedDB', async () => {
    // Mock localStorage data
    const localStorageData = [mockScheduledActivity]
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(localStorageData))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})

    // Mock database operations
    const mockSave = vi.spyOn(databaseService, 'saveScheduledActivity').mockResolvedValue()
    const mockGet = vi.spyOn(databaseService, 'getScheduledActivities').mockResolvedValue([])

    await syncService.performInitialSync()

    expect(mockSave).toHaveBeenCalledWith(mockScheduledActivity)
  })

  it('handles offline data caching', async () => {
    const activities = [mockActivity]
    
    const mockCache = vi.spyOn(databaseService, 'cacheActivities').mockResolvedValue()
    const mockGet = vi.spyOn(databaseService, 'getCachedActivities').mockResolvedValue(activities)

    await databaseService.cacheActivities(activities, 'entertainment')
    const cachedActivities = await databaseService.getCachedActivities('entertainment')

    expect(mockCache).toHaveBeenCalledWith(activities, 'entertainment')
    expect(cachedActivities).toEqual(activities)
  })

  it('manages offline queue operations', async () => {
    const operation = {
      id: 'test-op-1',
      type: 'add' as const,
      data: mockScheduledActivity,
      timestamp: Date.now(),
    }

    const mockAdd = vi.spyOn(offlineManager, 'addToSyncQueue').mockResolvedValue()
    const mockProcess = vi.spyOn(offlineManager, 'processSyncQueue').mockResolvedValue()

    await offlineManager.addToSyncQueue(operation)
    await offlineManager.processSyncQueue()

    expect(mockAdd).toHaveBeenCalledWith(operation)
    expect(mockProcess).toHaveBeenCalled()
  })

  it('handles network status changes', () => {
    const mockSyncOnReconnect = vi.spyOn(syncService, 'syncOnNetworkReconnect').mockImplementation(() => {})
    
    // Simulate network status change
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    })

    // Trigger network change event
    const event = new Event('online')
    window.dispatchEvent(event)

    // Should trigger sync when back online
    Object.defineProperty(navigator, 'onLine', {
      value: true,
    })
    window.dispatchEvent(event)

    expect(mockSyncOnReconnect).toHaveBeenCalled()
  })
})
