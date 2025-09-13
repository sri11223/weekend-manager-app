import { SimpleMinimalLayout } from './components/layout/SimpleMinimalLayout'
import { WeatherProvider } from './providers/WeatherProvider'
import './App.css'

function App() {
  return (
    <WeatherProvider>
      <div className="App">
        <SimpleMinimalLayout />
      </div>
    </WeatherProvider>
  )
}

export default App
