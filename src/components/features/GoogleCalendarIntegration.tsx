import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download, Upload, ExternalLink, Check, AlertCircle } from 'lucide-react'
import { useWeekendStore } from '../../store/weekendStore'
import { format, parseISO } from 'date-fns'

interface GoogleCalendarIntegrationProps {
  onClose?: () => void
}

export const GoogleCalendarIntegration: React.FC<GoogleCalendarIntegrationProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { scheduledActivities } = useWeekendStore()

  // Google Calendar API integration
  const initializeGoogleCalendar = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, you would:
      // 1. Load Google Calendar API
      // 2. Handle OAuth authentication
      // 3. Get user permissions
      
      // For demo purposes, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToGoogleCalendar = async () => {
    if (!isConnected) {
      await initializeGoogleCalendar()
      return
    }

    setIsLoading(true)
    setExportStatus('idle')

    try {
      // Convert scheduled activities to Google Calendar events
      const events = scheduledActivities.map(activity => ({
        summary: activity.title,
        description: `${activity.description}\n\nCategory: ${activity.category}\nCost: $${activity.cost}\nDuration: ${activity.duration} minutes`,
        start: {
          dateTime: getActivityDateTime(activity.day, activity.timeSlot),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: getActivityEndDateTime(activity.day, activity.timeSlot, activity.duration),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        location: activity.location || '',
        colorId: getCategoryColorId(activity.category)
      }))

      // In a real implementation, you would:
      // 1. Use Google Calendar API to create events
      // 2. Handle batch creation
      // 3. Manage conflicts and duplicates
      
      // For demo purposes, simulate the export
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      console.log('Would export these events to Google Calendar:', events)
      setExportStatus('success')
    } catch (error) {
      console.error('Failed to export to Google Calendar:', error)
      setExportStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const generateICalFile = () => {
    const icalEvents = scheduledActivities.map(activity => {
      const startDate = getActivityDateTime(activity.day, activity.timeSlot)
      const endDate = getActivityEndDateTime(activity.day, activity.timeSlot, activity.duration)
      
      return [
        'BEGIN:VEVENT',
        `DTSTART:${formatDateForICal(startDate)}`,
        `DTEND:${formatDateForICal(endDate)}`,
        `SUMMARY:${activity.title}`,
        `DESCRIPTION:${activity.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${activity.location || ''}`,
        `UID:${activity.id}@weekend-planner.com`,
        'END:VEVENT'
      ].join('\n')
    }).join('\n')

    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Weekend Planner//Weekend Planner//EN',
      'CALSCALE:GREGORIAN',
      icalEvents,
      'END:VCALENDAR'
    ].join('\n')

    // Create and download the .ics file
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `weekend-plan-${format(new Date(), 'yyyy-MM-dd')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper functions
  const getActivityDateTime = (day: string, timeSlot: string): string => {
    const today = new Date()
    const dayOffset = day === 'saturday' ? 6 : 7
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + (dayOffset - today.getDay()))
    
    const [time] = timeSlot.split(' - ')
    const [hours, minutes] = time.split(':').map(Number)
    targetDate.setHours(hours, minutes, 0, 0)
    
    return targetDate.toISOString()
  }

  const getActivityEndDateTime = (day: string, timeSlot: string, duration: number): string => {
    const startDate = new Date(getActivityDateTime(day, timeSlot))
    startDate.setMinutes(startDate.getMinutes() + duration)
    return startDate.toISOString()
  }

  const formatDateForICal = (dateString: string): string => {
    return parseISO(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const getCategoryColorId = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      'entertainment': '9',
      'food': '11',
      'outdoor': '10',
      'culture': '5',
      'social': '1',
      'wellness': '2'
    }
    return colorMap[category] || '1'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-md w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Calendar Integration</h3>
            <p className="text-sm text-gray-500">Export your weekend plan</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Status */}
      {exportStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">Successfully exported to Google Calendar!</span>
        </motion.div>
      )}

      {exportStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">Failed to export. Please try again.</span>
        </motion.div>
      )}

      {/* Activities Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Weekend Plan Summary</h4>
        <div className="text-sm text-gray-600">
          <p>{scheduledActivities.length} activities scheduled</p>
          <p>Total duration: {scheduledActivities.reduce((total, activity) => total + activity.duration, 0)} minutes</p>
          <p>Estimated cost: ${scheduledActivities.reduce((total, activity) => total + activity.cost, 0)}</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        {/* Google Calendar Export */}
        <button
          onClick={exportToGoogleCalendar}
          disabled={isLoading || scheduledActivities.length === 0}
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isConnected ? 'Export to Google Calendar' : 'Connect & Export to Google Calendar'}
        </button>

        {/* iCal Download */}
        <button
          onClick={generateICalFile}
          disabled={scheduledActivities.length === 0}
          className="w-full p-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download .ics File
        </button>

        {/* View in Browser */}
        <button
          onClick={() => window.open('https://calendar.google.com', '_blank')}
          className="w-full p-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open Google Calendar
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Export your weekend plan to keep track of your activities</p>
        <p>and get reminders on your phone or computer.</p>
      </div>
    </motion.div>
  )
}

export default GoogleCalendarIntegration
