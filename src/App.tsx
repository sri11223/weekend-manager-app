import { MinimalLayout } from './components/layout/MinimalLayout'
import { WeatherProvider } from './providers/WeatherProvider'
import { AIProvider } from './contexts/AIContext'
import './App.css'

function App() {
  return (
    <WeatherProvider>
      <AIProvider>
        <div className="App">
          <MinimalLayout />
        </div>
      </AIProvider>
    </WeatherProvider>
  )
}

export default App
