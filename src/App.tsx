import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SimpleMinimalLayout } from './components/layout/SimpleMinimalLayout'
import MobileLayout from './components/layout/MobileLayout'
import { WeatherProvider } from './providers/WeatherProvider'
import { useIsMobile, useIsSmallScreen } from './hooks/useMediaQuery'
import './App.css'

function App() {
  const isMobile = useIsMobile()
  const isSmallScreen = useIsSmallScreen()

  return (
    <WeatherProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          {(isMobile || isSmallScreen) ? (
            <MobileLayout />
          ) : (
            <SimpleMinimalLayout />
          )}
        </div>
      </DndProvider>
    </WeatherProvider>
  )
}

export default App
