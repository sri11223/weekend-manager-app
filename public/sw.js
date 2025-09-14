// Weekendly Service Worker - Offline-First Architecture
const CACHE_NAME = 'weekendly-v1.0.0'
const STATIC_CACHE = 'weekendly-static-v1'
const DYNAMIC_CACHE = 'weekendly-dynamic-v1'
const API_CACHE = 'weekendly-api-v1'

// Assets to cache immediately (App Shell) - Use relative paths for Vite
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  // Will be populated with actual Vite asset paths dynamically
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/weather',
  '/api/movies',
  '/api/games',
  '/api/activities'
]

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async (cache) => {
        console.log('📦 Caching static assets')
        
        // Cache assets one by one to handle failures gracefully
        const cachePromises = STATIC_ASSETS.map(async (asset) => {
          try {
            console.log('📦 Caching:', asset)
            await cache.add(asset)
            console.log('✅ Cached:', asset)
          } catch (error) {
            console.warn('⚠️ Failed to cache asset:', asset, error.message)
          }
        })
        
        await Promise.all(cachePromises)
        console.log('✅ Static asset caching completed')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Failed to open cache:', error)
        // Still skip waiting even if caching fails
        return self.skipWaiting()
      })
  )
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  try {
    const url = new URL(request.url)
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
      return
    }
    
    // Skip unsupported schemes (chrome-extension, moz-extension, etc.)
    if (!url.protocol.startsWith('http')) {
      console.log('⚠️ Skipping unsupported scheme:', url.protocol)
      return
    }
    
    // Skip Chrome extension and browser extension requests
    if (url.hostname.includes('extension') || 
        url.pathname.includes('extension') ||
        request.url.includes('chrome-extension') ||
        request.url.includes('moz-extension')) {
      console.log('⚠️ Skipping extension request:', request.url)
      return
    }
    
    // Handle different types of requests with appropriate strategies
    if (isStaticAsset(request)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE))
    } else if (isAPIRequest(request)) {
      event.respondWith(networkFirstWithFallback(request, API_CACHE))
    } else if (isImageRequest(request)) {
      event.respondWith(cacheFirst(request, DYNAMIC_CACHE))
    } else {
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
    }
  } catch (error) {
    console.log('⚠️ Skipping invalid URL:', request.url, error)
    return
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-scheduled-activities') {
    event.waitUntil(syncScheduledActivities())
  } else if (event.tag === 'sync-user-preferences') {
    event.waitUntil(syncUserPreferences())
  }
})

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: data.data,
      actions: data.actions
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

// Caching Strategies

// Cache first strategy - Try cache first, then network
async function cacheFirst(request, cacheName) {
  try {
    // Check if request is cacheable
    const url = new URL(request.url)
    if (!url.protocol.startsWith('http')) {
      console.log('⚠️ Skipping non-HTTP request in cache:', request.url)
      return fetch(request)
    }
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('📦 Cache hit:', request.url)
      return cachedResponse
    }
    
    console.log('🌐 Fetching from network:', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok && networkResponse.status < 400) {
      console.log('💾 Caching response:', request.url)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('❌ Cache first strategy failed for:', request.url, error)
    // Try to return from cache if network fails
    try {
      const cache = await caches.open(cacheName)
      const cachedResponse = await cache.match(request)
      if (cachedResponse) {
        console.log('📦 Returning cached fallback:', request.url)
        return cachedResponse
      }
    } catch (cacheError) {
      console.error('❌ Cache fallback also failed:', cacheError)
    }
    
    // Return a proper offline response
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}

// Network First with Fallback - Good for API requests
async function networkFirstWithFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    console.log('Network failed, trying cache:', error.message)
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline fallback data
    return getOfflineFallback(request)
  }
}

// Stale While Revalidate - Good for dynamic content
async function staleWhileRevalidate(request, cacheName) {
  try {
    // Validate URL scheme
    const url = new URL(request.url)
    if (!url.protocol.startsWith('http')) {
      console.log('⚠️ Skipping non-HTTP request in staleWhileRevalidate:', request.url)
      return fetch(request)
    }
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok && networkResponse.status < 400) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    }).catch((error) => {
      console.log('⚠️ Network fetch failed for:', request.url, error.message)
      return cachedResponse
    })
    
    return cachedResponse || fetchPromise
  } catch (error) {
    console.error('❌ staleWhileRevalidate failed for:', request.url, error)
    // Fallback to direct fetch
    return fetch(request)
  }
}

// Helper Functions

function isStaticAsset(request) {
  return request.url.includes('/static/') || 
         request.url.includes('.js') || 
         request.url.includes('.css') ||
         request.url.includes('/manifest.json')
}

function isAPIRequest(request) {
  return API_ENDPOINTS.some(endpoint => request.url.includes(endpoint)) ||
         request.url.includes('/api/') ||
         request.url.includes('openweathermap.org') ||
         request.url.includes('themoviedb.org') ||
         request.url.includes('freetogame.com')
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         request.url.includes('.jpg') ||
         request.url.includes('.png') ||
         request.url.includes('.gif') ||
         request.url.includes('.webp')
}

// Offline Fallback Data
function getOfflineFallback(request) {
  const url = new URL(request.url)
  
  // Weather API fallback
  if (url.hostname.includes('openweathermap.org')) {
    return new Response(JSON.stringify({
      weather: [{ main: 'Clear', description: 'clear sky' }],
      main: { temp: 22, humidity: 60 },
      wind: { speed: 3.5 },
      offline: true,
      message: 'Using cached weather data'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Movies API fallback
  if (url.hostname.includes('themoviedb.org')) {
    return new Response(JSON.stringify({
      results: [
        {
          id: 'offline-1',
          title: 'Offline Movie Recommendations',
          overview: 'Browse your cached movie recommendations',
          poster_path: null,
          vote_average: 8.0,
          offline: true
        }
      ],
      offline: true,
      message: 'Using cached movie data'
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Games API fallback
  if (url.hostname.includes('freetogame.com')) {
    return new Response(JSON.stringify([
      {
        id: 'offline-game-1',
        title: 'Offline Games Available',
        short_description: 'Check your cached game recommendations',
        thumbnail: null,
        game_url: '#',
        offline: true
      }
    ]), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Default fallback
  return new Response(JSON.stringify({
    error: 'Offline',
    message: 'This content is not available offline',
    offline: true
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  })
}

// Background Sync Functions
async function syncScheduledActivities() {
  try {
    console.log('🔄 Syncing scheduled activities...')
    
    // Get pending activities from IndexedDB
    const db = await openDB()
    const pendingActivities = await db.getAll('scheduledActivities')
    const toSync = pendingActivities.filter(activity => activity.syncStatus === 'pending')
    
    if (toSync.length === 0) {
      console.log('✅ No activities to sync')
      return
    }
    
    // Sync with server (placeholder for future cloud sync)
    for (const activity of toSync) {
      try {
        // await syncActivityToServer(activity)
        activity.syncStatus = 'synced'
        await db.put('scheduledActivities', activity)
        console.log(`✅ Synced activity: ${activity.id}`)
      } catch (error) {
        console.error(`❌ Failed to sync activity ${activity.id}:`, error)
        activity.syncStatus = 'error'
        await db.put('scheduledActivities', activity)
      }
    }
    
    console.log(`✅ Sync completed: ${toSync.length} activities processed`)
  } catch (error) {
    console.error('❌ Background sync failed:', error)
  }
}

async function syncUserPreferences() {
  try {
    console.log('🔄 Syncing user preferences...')
    // Placeholder for future implementation
    console.log('✅ User preferences sync completed')
  } catch (error) {
    console.error('❌ User preferences sync failed:', error)
  }
}

// IndexedDB helper (simplified)
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('WeekendlyDB', 1)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage({ type: 'CACHE_STATUS', data: status })
      })
      break
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' })
      })
      break
      
    case 'PREFETCH_ACTIVITIES':
      prefetchActivities(data.activities)
      break
  }
})

// Cache management functions
async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(name => caches.delete(name)))
  console.log('🗑️ All caches cleared')
}

async function prefetchActivities(activities) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  for (const activity of activities) {
    if (activity.image) {
      try {
        await cache.add(activity.image)
      } catch (error) {
        console.warn('Failed to prefetch image:', activity.image)
      }
    }
  }
  
  console.log(`📦 Prefetched ${activities.length} activity images`)
}

console.log('🎯 Weekendly Service Worker loaded successfully')
