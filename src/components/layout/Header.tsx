import React from 'react'
import { Calendar, Share2, Settings } from 'lucide-react'

interface HeaderProps {
  onCalendarClick?: () => void
  onShareClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onCalendarClick, onShareClick }) => {
  return (
    <header className="h-20 bg-white/25 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weekendly
            </h1>
            <p className="text-xs text-gray-600 font-medium">Plan your perfect weekend</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <span className="text-sm font-semibold text-blue-600 border-b-2 border-blue-500 pb-1">Today</span>
          <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Tasks</span>
          <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Calendar</span>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCalendarClick}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={onShareClick}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
