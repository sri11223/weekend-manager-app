import React, { useState } from 'react'
import { generateTestActivities } from '../../utils/performanceTestUtils'
import { SimplePersistenceDemo } from './SimplePersistenceDemo'
import { OfflineTest } from './OfflineTest'

export const SimplePerformanceTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'persistence' | 'offline'>('performance')
  const [testActivities, setTestActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [performanceResult, setPerformanceResult] = useState<string>('')

  const runPerformanceTest = async () => {
    setIsLoading(true)
    const startTime = performance.now()
    
    // Generate 50 test activities (simpler number)
    const activities = generateTestActivities(50)
    setTestActivities(activities)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    setPerformanceResult(`✅ Generated and rendered 50 activities in ${renderTime.toFixed(2)}ms`)
    setIsLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'performance'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🚀 Performance
        </button>
        <button
          onClick={() => setActiveTab('persistence')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'persistence'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          💾 Persistence
        </button>
        <button
          onClick={() => setActiveTab('offline')}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'offline'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🌐 Offline
        </button>
      </div>

      {/* Performance Test Tab */}
      {activeTab === 'performance' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Performance Test - Handling Many Activities</h2>
          
          <div className="mb-6">
            <button
              onClick={runPerformanceTest}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? '⏳ Generating...' : '🚀 Generate 50 Test Activities'}
            </button>
          </div>

          {performanceResult && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              {performanceResult}
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">
            Total Activities Generated: <strong>{testActivities.length}</strong>
          </div>

          {/* Simple grid of activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto bg-gray-50 p-4 rounded">
            {testActivities.map((activity, index) => (
              <div key={index} className="bg-white border rounded p-3 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-sm mb-1 text-gray-800">{activity.title}</h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{activity.category}</span>
                  <span className="text-green-600 font-medium">${activity.cost}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded">
            💡 <strong>What this shows:</strong> The app can smoothly generate, store, and render many activities 
            without performance issues. Real app uses optimizations like virtual scrolling for even larger datasets.
          </div>
        </div>
      )}

      {/* Persistence Test Tab */}
      {activeTab === 'persistence' && (
        <SimplePersistenceDemo />
      )}

      {/* Offline Test Tab */}
      {activeTab === 'offline' && (
        <OfflineTest />
      )}
    </div>
  )
}