import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AppLayout } from './components/layout/AppLayout'
import { CurrentWeather } from './components/features/WeatherDisplay'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50">
        {/* Current Weather - Top Right */}
        <div className="fixed top-20 right-6 z-40">
          <CurrentWeather />
        </div>
        
        {/* Main App Layout - NO WEATHER TIMELINE AT BOTTOM */}
        <AppLayout />
      </div>
    </DndProvider>
  )
}

export default App
