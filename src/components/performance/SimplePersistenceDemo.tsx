import React, { useState, useEffect } from 'react'

export const SimplePersistenceDemo: React.FC = () => {
  const [testData, setTestData] = useState<string>('')
  const [lastSaved, setLastSaved] = useState<string>('')

  // Key for localStorage
  const STORAGE_KEY = 'weekend-planner-test'

  const saveTestData = () => {
    const timestamp = new Date().toLocaleString()
    const data = {
      message: `Test data saved at ${timestamp}`,
      timestamp,
      testNumber: Math.random().toString(36).substring(7)
    }
    
    // Save to localStorage (simpler than IndexedDB for demo)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setLastSaved(`✅ Saved: ${data.message}`)
  }

  const loadTestData = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setTestData(`📥 Loaded: ${data.message} (ID: ${data.testNumber})`)
      } catch (e) {
        setTestData('❌ Error loading data')
      }
    } else {
      setTestData('📭 No saved data found')
    }
  }

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setTestData('🗑️ Data cleared')
    setLastSaved('')
  }

  // Auto-load on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setTestData(`Found saved data from: ${data.timestamp}`)
      } catch (e) {
        setTestData('No valid saved data')
      }
    } else {
      setTestData('No saved data found')
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Persistence Test - Data Survives Page Refresh</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">🧪 How to Test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>Save data</strong> using the button below</li>
            <li><strong>Refresh the page</strong> (F5 or Ctrl+R)</li>
            <li><strong>Return to this test</strong> - data should still be here!</li>
          </ol>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={saveTestData}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
          >
            💾 Save Test Data
          </button>
          
          <button
            onClick={loadTestData}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            📥 Load Saved Data
          </button>
          
          <button
            onClick={clearData}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            🗑️ Clear Data
          </button>
        </div>

        {lastSaved && (
          <div className="bg-green-100 p-3 rounded text-green-800">
            {lastSaved}
          </div>
        )}

        {testData && (
          <div className="bg-gray-100 p-3 rounded">
            <strong>Status:</strong> {testData}
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded">
          <h3 className="font-semibold mb-2">💡 What This Proves:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Data Persistence:</strong> Information survives browser refresh</li>
            <li><strong>Client-side Storage:</strong> Uses browser's localStorage API</li>
            <li><strong>Error Handling:</strong> Gracefully handles missing or corrupt data</li>
            <li><strong>User Experience:</strong> Clear feedback on save/load operations</li>
          </ul>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <strong>Technical Note:</strong> The main weekend planner uses IndexedDB for more robust storage,
          but this demo uses localStorage for simplicity. Both demonstrate client-side data persistence.
        </div>
      </div>
    </div>
  )
}