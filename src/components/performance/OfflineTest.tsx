import React, { useState, useEffect } from 'react'

export const OfflineTest: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<string>('Checking...')
  const [cacheTest, setCacheTest] = useState<string>('')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check if service worker is available
    checkServiceWorker()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          setServiceWorkerStatus('✅ Service Worker is active and ready for offline mode')
        } else {
          setServiceWorkerStatus('❌ Service Worker not registered')
        }
      } catch (error) {
        setServiceWorkerStatus('❌ Service Worker check failed')
      }
    } else {
      setServiceWorkerStatus('❌ Service Worker not supported in this browser')
    }
  }

  const testCache = async () => {
    setCacheTest('Testing cache...')
    
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        if (cacheNames.length > 0) {
          setCacheTest(`✅ Found ${cacheNames.length} cache(s): ${cacheNames.join(', ')}`)
        } else {
          setCacheTest('📭 No caches found yet - try refreshing to populate caches')
        }
      } catch (error) {
        setCacheTest('❌ Cache API test failed')
      }
    } else {
      setCacheTest('❌ Cache API not supported')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Offline Functionality Test</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">🌐 How to Test Offline Mode:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>First:</strong> Load this page normally (online)</li>
            <li><strong>Then:</strong> Turn off your internet connection</li>
            <li><strong>Finally:</strong> Refresh the page - it should still work!</li>
            <li><strong>Or:</strong> Use Chrome DevTools → Network → Offline checkbox</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Connection Status */}
          <div className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-2">Connection Status</h3>
            <div className={`p-2 rounded ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              This updates automatically when connection changes
            </div>
          </div>

          {/* Service Worker Status */}
          <div className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-2">Service Worker</h3>
            <div className="text-sm">{serviceWorkerStatus}</div>
            <button
              onClick={checkServiceWorker}
              className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Recheck
            </button>
          </div>
        </div>

        {/* Cache Test */}
        <div className="bg-white border rounded p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Cache Test</h3>
            <button
              onClick={testCache}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
            >
              Test Cache
            </button>
          </div>
          {cacheTest && (
            <div className="text-sm bg-gray-50 p-2 rounded">
              {cacheTest}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-semibold mb-2">💡 What This Proves:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Offline Detection:</strong> App knows when you're offline</li>
            <li><strong>Service Worker:</strong> Background script enables offline functionality</li>
            <li><strong>Caching Strategy:</strong> Important files are stored locally</li>
            <li><strong>Graceful Degradation:</strong> App works with/without internet</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <strong>Technical Implementation:</strong> Uses Service Worker with Cache API to store static assets,
          API responses, and critical app files. Implements offline-first strategy with fallbacks.
        </div>
      </div>
    </div>
  )
}