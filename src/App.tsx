import React from 'react'
import { MinimalLayout } from './components/layout/MinimalLayout'
import { WeatherProvider } from './providers/WeatherProvider'
import './App.css'

function App() {
  return (
    <WeatherProvider>
      <div className="App">
        <MinimalLayout />
      </div>
    </WeatherProvider>
  )
}

export default App
