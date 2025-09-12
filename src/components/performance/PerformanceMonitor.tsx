import React, { useState, useEffect, useCallback } from 'react'
import { offlineManager } from '../../services/offline/OfflineManager'
import { databaseService } from '../../services/database/DatabaseService'
import { dataSyncService } from '../../services/sync/DataSyncService'
import { offlineActivityService } from '../../services/offline/OfflineActivityService'

interface PerformanceStats {
  loadTime: number
  renderTime: number
  memoryUsage: number
  cacheHitRate: number
  offlineCapability: boolean
  syncStatus: string
  storageUsage: any
  activitiesCount: number
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  // Collect performance stats
  const collectStats = useCallback(async () => {
    const startTime = performance.now()
    
    try {
      const [
        offlineStats,
        storageStats,
        syncStatus
      ] = await Promise.all([
        offlineManager.getPerformanceStats(),
        databaseService.getStorageStats(),
        dataSyncService.getSyncStatus()
      ])

      const loadTime = performance.now() - startTime
      const memoryInfo = (performance as any).memory
      
      setStats({
        loadTime,
        renderTime: 0, // Would be measured during actual renders
        memoryUsage: memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0,
        cacheHitRate: offlineStats.cacheHitRate,
        offlineCapability: offlineStats.offlineCapability,
        syncStatus: syncStatus.inProgress ? 'syncing' : 'idle',
        storageUsage: storageStats,
        activitiesCount: storageStats.cachedActivities
      })
    } catch (error) {
      console.error('Failed to collect performance stats:', error)
    }
  }, [])

  // Run comprehensive tests
  const runPerformanceTests = useCallback(async () => {
    setIsRunningTests(true)
    const results: any[] = []

    try {
      // Test 1: Load 50+ activities performance
      console.log('🧪 Testing 50+ activities performance...')
      const startTime = performance.now()
      
      await offlineActivityService.getActivities('movies', { limit: 50 })
      await offlineActivityService.getActivities('food', { limit: 50 })
      await offlineActivityService.getActivities('games', { limit: 50 })
      
      const loadTime = performance.now() - startTime
      results.push({
        test: 'Load 150 Activities',
        duration: `${loadTime.toFixed(2)}ms`,
        status: loadTime < 2000 ? 'PASS' : 'SLOW',
        details: `Loaded 150 activities in ${loadTime.toFixed(2)}ms`
      })

      // Test 2: Search performance
      console.log('🧪 Testing search performance...')
      const searchStart = performance.now()
      
      await offlineActivityService.searchActivities('movie', { limit: 20 })
      await offlineActivityService.searchActivities('food', { limit: 20 })
      await offlineActivityService.searchActivities('game', { limit: 20 })
      
      const searchTime = performance.now() - searchStart
      results.push({
        test: 'Search Performance',
        duration: `${searchTime.toFixed(2)}ms`,
        status: searchTime < 500 ? 'PASS' : 'SLOW',
        details: `3 searches completed in ${searchTime.toFixed(2)}ms`
      })

      // Test 3: Offline capability
      console.log('🧪 Testing offline capability...')
      const offlineStart = performance.now()
      
      const offlineActivities = await offlineManager.getOfflineActivities()
      const offlineTime = performance.now() - offlineStart
      
      results.push({
        test: 'Offline Data Access',
        duration: `${offlineTime.toFixed(2)}ms`,
        status: offlineActivities.length > 0 ? 'PASS' : 'FAIL',
        details: `${offlineActivities.length} offline activities available`
      })

      // Test 4: Database operations
      console.log('🧪 Testing database operations...')
      const dbStart = performance.now()
      
      const testActivity = {
        id: 'perf-test-' + Date.now(),
        scheduledId: 'test-scheduled-' + Date.now(),
        name: 'Performance Test Activity',
        description: 'Testing database performance',
        category: 'entertainment' as any,
        duration: 60,
        mood: 'relaxed' as any,
        icon: '🧪',
        color: '#000000',
        indoor: true,
        cost: 'free' as any,
        difficulty: 'easy' as any,
        tags: ['test'],
        weatherDependent: false,
        day: 'saturday' as any,
        startTime: '10:00',
        endTime: '11:00'
      }
      
      await databaseService.saveScheduledActivity(testActivity)
      const activities = await databaseService.getScheduledActivities()
      await databaseService.removeScheduledActivity(testActivity.id)
      
      const dbTime = performance.now() - dbStart
      results.push({
        test: 'Database Operations',
        duration: `${dbTime.toFixed(2)}ms`,
        status: dbTime < 100 ? 'PASS' : 'SLOW',
        details: `CRUD operations on ${activities.length} activities`
      })

      // Test 5: Memory usage
      console.log('🧪 Testing memory usage...')
      const memoryInfo = (performance as any).memory
      if (memoryInfo) {
        const memoryMB = memoryInfo.usedJSHeapSize / 1024 / 1024
        results.push({
          test: 'Memory Usage',
          duration: `${memoryMB.toFixed(2)}MB`,
          status: memoryMB < 50 ? 'PASS' : memoryMB < 100 ? 'WARN' : 'HIGH',
          details: `${memoryMB.toFixed(2)}MB heap used`
        })
      }

      // Test 6: Cache performance
      console.log('🧪 Testing cache performance...')
      const cacheStart = performance.now()
      
      const cacheStatus = await offlineManager.getCacheStatus()
      const cacheTime = performance.now() - cacheStart
      
      results.push({
        test: 'Cache Access',
        duration: `${cacheTime.toFixed(2)}ms`,
        status: cacheTime < 50 ? 'PASS' : 'SLOW',
        details: `${Object.keys(cacheStatus).length} cache stores accessed`
      })

      setTestResults(results)
      console.log('✅ Performance tests completed')

    } catch (error) {
      console.error('❌ Performance tests failed:', error)
      results.push({
        test: 'Test Suite',
        duration: 'N/A',
        status: 'ERROR',
        details: `Tests failed: ${error.message}`
      })
      setTestResults(results)
    } finally {
      setIsRunningTests(false)
    }
  }, [])

  // Auto-collect stats on mount and periodically
  useEffect(() => {
    collectStats()
    const interval = setInterval(collectStats, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [collectStats])

  // Only show in development or when explicitly enabled
  useEffect(() => {
    const showMonitor = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('weekendly-debug') === 'true'
    setIsVisible(showMonitor)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black bg-opacity-90 text-white p-4 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Performance Monitor</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {stats && (
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>Load Time: {stats.loadTime.toFixed(2)}ms</div>
              <div>Memory: {stats.memoryUsage.toFixed(1)}MB</div>
              <div>Cache Hit: {(stats.cacheHitRate * 100).toFixed(1)}%</div>
              <div>Activities: {stats.activitiesCount}</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                stats.offlineCapability ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span>Offline Ready</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                stats.syncStatus === 'idle' ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              <span>Sync: {stats.syncStatus}</span>
            </div>

            <div className="text-gray-400">
              Storage: {stats.storageUsage.estimatedSize}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <button
            onClick={runPerformanceTests}
            disabled={isRunningTests}
            className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-xs"
          >
            {isRunningTests ? 'Running Tests...' : 'Run Performance Tests'}
          </button>

          <button
            onClick={collectStats}
            className="w-full px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs"
          >
            Refresh Stats
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            <h4 className="text-xs font-semibold mb-2">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="text-xs mb-1">
                <div className="flex items-center justify-between">
                  <span>{result.test}</span>
                  <span className={`px-1 rounded text-xs ${
                    result.status === 'PASS' ? 'bg-green-600' :
                    result.status === 'WARN' ? 'bg-yellow-600' :
                    result.status === 'SLOW' ? 'bg-orange-600' :
                    'bg-red-600'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div className="text-gray-400 text-xs">
                  {result.duration} - {result.details}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Hook for performance monitoring in components
export const usePerformanceMonitor = () => {
  const [renderTime, setRenderTime] = useState(0)

  const measureRender = useCallback((componentName: string) => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      setRenderTime(duration)
      
      if (duration > 16) { // More than one frame at 60fps
        console.warn(`🐌 Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`)
      }
    }
  }, [])

  return { renderTime, measureRender }
}
