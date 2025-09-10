import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { WeekendTimeline } from '../features/WeekendTimeline'
import { WeekendSummary } from '../features/WeekendSummary'

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Header */}
      <Header />
      
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
    </div>
  )
}
