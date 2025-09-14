// src/components/features/ThemeSelector.tsx - RESPONSIVE THEME SELECTOR
import React, { useState } from 'react'
import { Palette, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { useIsMobile } from '../../hooks/useMediaQuery'

const ThemeSelector: React.FC = React.memo(() => {
  const { currentTheme, changeTheme, availableThemes, forceRender } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleThemeChange = (themeId: string) => {
    changeTheme(themeId)
    setIsOpen(false)
  }

  // Mobile version - horizontal scroll
  if (isMobile) {
    return (
      <div key={`theme-selector-mobile-${forceRender}`} className="theme-selector-mobile">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
          <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
            Choose Your Mood
          </span>
        </div>
        
        <div className="theme-options-scroll">
          {availableThemes.map((theme) => (
            <motion.button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`theme-option ${currentTheme.id === theme.id ? 'active' : ''}`}
              style={{ 
                backgroundColor: theme.colors.primary,
                boxShadow: currentTheme.id === theme.id ? `0 4px 12px ${theme.colors.primary}40` : 'none'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="theme-preview">
                <div 
                  className="theme-color"
                  style={{ background: theme.colors.gradient }}
                />
              </div>
              <span className="theme-name">{theme.name}</span>
              {currentTheme.id === theme.id && (
                <Check className="w-3 h-3 text-white" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // Desktop version - dropdown
  return (
    <div key={`theme-selector-desktop-${forceRender}`} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-white/20 text-white"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden md:inline">Theme</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border z-50 p-6"
              style={{ borderColor: currentTheme.colors.border }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
                  Choose Your Mood
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className="relative p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02]"
                    style={{
                      borderColor: currentTheme.id === theme.id ? theme.colors.primary : theme.colors.border,
                      backgroundColor: currentTheme.id === theme.id ? `${theme.colors.primary}10` : 'white'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Color Preview */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ background: theme.colors.gradient }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold" style={{ color: theme.colors.text }}>
                          {theme.name}
                        </h4>
                        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {theme.description}
                        </p>
                      </div>
                      {currentTheme.id === theme.id && (
                        <Check className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      )}
                    </div>

                    {/* Color Palette Preview */}
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: currentTheme.colors.background }}>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  💡 Your theme affects the entire app's appearance and creates a personalized experience based on your mood.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
})

export default ThemeSelector