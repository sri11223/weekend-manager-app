import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, DollarSign, Trash2, RefreshCw } from 'lucide-react'
import { useScheduleStore } from '../../store/scheduleStore'
import { format, addDays, startOfWeek } from 'date-fns'

export const WeekendSummary: React.FC = () => {
  const { scheduledActivities, clearAllActivities } = useScheduleStore()
  
  const today = new Date()
  const weekStart = startOfWeek(today)
  const saturday = addDays(weekStart, 6)
  const sunday = addDays(weekStart, 7)

  const saturdayActivities = scheduledActivities.filter(a => a.day === 'saturday')
  const sundayActivities = scheduledActivities.filter(a => a.day === 'sunday')

  const totalDuration = scheduledActivities.reduce((sum, activity) => sum + activity.duration, 0)
  const totalHours = Math.round(totalDuration / 60 * 10) / 10

  if (scheduledActivities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 text-center"
      >
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Activities Planned</h3>
        <p className="text-gray-500 text-sm">
          Drag activities from the sidebar to start planning your weekend!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/25 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Weekend Summary</h3>
        <button
          onClick={clearAllActivities}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{scheduledActivities.length}</div>
          <div className="text-xs text-blue-600 font-medium">Activities</div>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">$135</div>
          <div className="text-xs text-green-600 font-medium">Total Cost</div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{totalHours}h</div>
          <div className="text-xs text-purple-600 font-medium">Total Time</div>
        </div>
      </div>

      {/* Day Breakdown */}
      <div className="space-y-4">
        {/* Saturday */}
        <div className="bg-blue-50/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h4 className="font-semibold text-gray-900">
              Saturday - {format(saturday, 'MMM d')}
            </h4>
            <span className="text-sm text-gray-500">
              ({saturdayActivities.length} activities)
            </span>
          </div>
          
          {saturdayActivities.length > 0 ? (
            <div className="space-y-2">
              {saturdayActivities
                .sort((a: any, b: any) => (a.timeSlot || a.startTime || '').localeCompare(b.timeSlot || b.startTime || ''))
                .map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between bg-white/60 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-600">{activity.timeSlot || activity.startTime}</div>
                      <div className="text-sm font-semibold text-gray-900">{activity.name || activity.title}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{Math.round(activity.duration / 60)}h</span>
                      <DollarSign className="w-3 h-3" />
                      <span>$15</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No activities planned</p>
          )}
        </div>

        {/* Sunday */}
        <div className="bg-purple-50/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <h4 className="font-semibold text-gray-900">
              Sunday - {format(sunday, 'MMM d')}
            </h4>
            <span className="text-sm text-gray-500">
              ({sundayActivities.length} activities)
            </span>
          </div>
          
          {sundayActivities.length > 0 ? (
            <div className="space-y-2">
              {sundayActivities
                .sort((a: any, b: any) => (a.timeSlot || a.startTime || '').localeCompare(b.timeSlot || b.startTime || ''))
                .map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between bg-white/60 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-600">{activity.timeSlot || activity.startTime}</div>
                      <div className="text-sm font-semibold text-gray-900">{activity.name || activity.title}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{Math.round(activity.duration / 60)}h</span>
                      <DollarSign className="w-3 h-3" />
                      <span>$15</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No activities planned</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {scheduledActivities.length > 0 
              ? `Your weekend is ${Math.round((scheduledActivities.length / 10) * 100)}% planned`
              : 'Start planning your weekend!'
            }
          </span>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
            <RefreshCw className="w-3 h-3" />
            Optimize
          </button>
        </div>
      </div>
    </motion.div>
  )
}
