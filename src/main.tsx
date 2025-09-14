import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: Service worker temporarily disabled for deployment debugging
// Will re-enable once core app is working on Vercel

/*
// Initialize offline capabilities for PWA functionality
import { offlineManager } from './services/offline/OfflineManager'
import { DataSyncService } from './services/sync/DataSyncService'

// Initialize offline services (constructors handle the setup)
console.log('🔧 Initializing PWA services...')

// Trigger offline manager initialization (registers service worker)
offlineManager.isOffline() // This ensures the singleton is created

// Trigger data sync service initialization 
DataSyncService.getInstance() // This ensures sync is set up

console.log('✅ PWA services ready - App will work offline!')
*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
