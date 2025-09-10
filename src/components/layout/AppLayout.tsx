import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import WeekendTimeline from '../features/WeekendTimeline'
import { WeekendSummary } from '../features/WeekendSummary'
import GoogleCalendarIntegration from '../features/GoogleCalendarIntegration'
import ShareExportPanel from '../features/ShareExportPanel'
import { AnimatePresence } from 'framer-motion'

export const AppLayout: React.FC = () => {
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Header */}
      <Header 
        onCalendarClick={() => setShowCalendarIntegration(true)}
        onShareClick={() => setShowSharePanel(true)}
      />
      
      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Timeline - Takes 2/3 of the space */}
            <div className="col-span-2 overflow-y-auto custom-scrollbar">
              <WeekendTimeline />
            </div>
            
            {/* Summary Panel - Takes 1/3 of the space */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <WeekendSummary />
            </div>
          </div>
        </main>
      </div>

      {/* Modal Overlays */}
      <AnimatePresence>
        {showCalendarIntegration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GoogleCalendarIntegration onClose={() => setShowCalendarIntegration(false)} />
          </div>
        )}
        
        {showSharePanel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <ShareExportPanel onClose={() => setShowSharePanel(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
