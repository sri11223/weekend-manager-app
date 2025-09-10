import React from 'react'
import { Calendar, User, Settings, Bell } from 'lucide-react'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
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
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="primary" size="sm">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>
    </header>
  )
}
