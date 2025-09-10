import React from 'react'
import { Sun, CloudRain, Calendar, DollarSign, Clock, Trash2 } from 'lucide-react'
import { format, addDays, startOfWeek } from 'date-fns'
import { useWeather } from '../../hooks/useWeather'
import { useDrop } from 'react-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeekendStore } from '../../store/weekendStore'
import { ItemTypes } from '../features/DraggableActivityCard'
import toast from 'react-hot-toast'

const TIME_SLOTS = [
  { time: '9:00 AM', label: 'Morning' },
  { time: '12:00 PM', label: 'Afternoon' },
  { time: '3:00 PM', label: 'Late Afternoon' },
  { time: '6:00 PM', label: 'Evening' },
  { time: '9:00 PM', label: 'Night' },
]

export const WeekendTimeline: React.FC = () => {
  // Get current weekend dates
  const today = new Date()
  const weekStart = startOfWeek(today)
  const saturday = addDays(weekStart, 6)
  const sunday = addDays(weekStart, 7)

  // Get weather data for forecasting
  const { forecast, loading: weatherLoading } = useWeather({ daysForward: 2, daysBack: 0 })
  
  // Weekend store
  const { 
    totalCost, 
    addActivity, 
    removeActivity, 
    getActivityForSlot,
    hasTimeConflict 
  } = useWeekendStore()

  const getWeatherForDay = (dayIndex: number) => {
    return forecast[dayIndex] || null
  }

  const WeatherIcon = ({ day }: { day: 'saturday' | 'sunday' }) => {
    const dayIndex = day === 'saturday' ? 0 : 1
    const weatherData = getWeatherForDay(dayIndex)
    
    if (weatherLoading || !weatherData) {
      return <Sun className="w-5 h-5 text-yellow-500 animate-pulse" />
    }
    
    const weather = weatherData.weather.toLowerCase()
    if (weather.includes('rain') || weather.includes('drizzle')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />
    } else {
      return <Sun className="w-5 h-5 text-yellow-500" />
    }
  }

  const getTemperature = (day: 'saturday' | 'sunday') => {
    const dayIndex = day === 'saturday' ? 0 : 1
    const weatherData = getWeatherForDay(dayIndex)
    return weatherData ? `${weatherData.temperature}°C` : '--°C'
  }

  // Droppable slot component
  const DroppableSlot: React.FC<{ day: 'saturday' | 'sunday'; timeSlot: string }> = ({ day, timeSlot }) => {
    const scheduledActivity = getActivityForSlot(day, timeSlot)
    
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.ACTIVITY,
      drop: (item: { activity: any }) => {
        if (hasTimeConflict(day, timeSlot, item.activity.duration)) {
          toast.error('Time conflict! This slot overlaps with another activity.')
          return
        }
        
        addActivity(item.activity, day, timeSlot)
        toast.success(`Added ${item.activity.title} to ${day} ${timeSlot}`)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    })

    const handleRemoveActivity = (activityId: string) => {
      removeActivity(activityId)
      toast.success('Activity removed from schedule')
    }

    return (
      <div
        ref={drop as any}
        className={`h-24 rounded-2xl transition-all duration-200 ${
          scheduledActivity
            ? 'bg-gradient-to-br from-white/60 to-white/40 border-2 border-white/50'
            : isOver && canDrop
            ? day === 'saturday'
              ? 'border-2 border-blue-400 bg-blue-50/50'
              : 'border-2 border-purple-400 bg-purple-50/50'
            : 'border-2 border-dashed border-gray-300 hover:border-gray-400'
        } flex items-center justify-center cursor-pointer`}
      >
        <AnimatePresence>
          {scheduledActivity ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full h-full p-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {scheduledActivity.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {scheduledActivity.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveActivity(scheduledActivity.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Clock className="w-3 h-3" />
                    <span>{Math.round(scheduledActivity.duration / 60)}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <DollarSign className="w-3 h-3" />
                    <span>{scheduledActivity.cost === 0 ? 'Free' : `$${scheduledActivity.cost}`}</span>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {scheduledActivity.category.split(' ')[0]}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.span
              initial={{ opacity: 0.6 }}
              animate={{ opacity: isOver && canDrop ? 1 : 0.6 }}
              className={`text-sm font-medium ${
                isOver && canDrop
                  ? day === 'saturday'
                    ? 'text-blue-600'
                    : 'text-purple-600'
                  : 'text-gray-500'
              }`}
            >
              {isOver && canDrop ? 'Drop here!' : 'Drop activity here'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Weekend Timeline</h2>
          </div>
          
          {/* Budget Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium opacity-90">Total Budget</div>
                <div className="text-xl font-bold">${totalCost}</div>
              </div>
            </div>
          </motion.div>
        </div>
        <p className="text-lg text-gray-600">Plan your perfect weekend activities with drag & drop</p>
      </div>

      {/* Timeline Grid */}
      <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-xl">
        {/* Days Header - WITH INTEGRATED WEATHER */}
        <div className="grid grid-cols-2 border-b border-white/30">
          {/* Saturday */}
          <div className="p-8 border-r border-white/30 bg-gradient-to-br from-blue-50/50 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Saturday</h3>
                <p className="text-sm text-gray-600 font-medium">{format(saturday, 'MMMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-xl px-4 py-2">
                <WeatherIcon day="saturday" />
                <span className="text-sm font-bold text-gray-700">{getTemperature('saturday')}</span>
              </div>
            </div>
          </div>

          {/* Sunday */}
          <div className="p-8 bg-gradient-to-br from-purple-50/50 to-transparent">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Sunday</h3>
                <p className="text-sm text-gray-600 font-medium">{format(sunday, 'MMMM d, yyyy')}</p>
              </div>
              <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm rounded-xl px-4 py-2">
                <WeatherIcon day="sunday" />
                <span className="text-sm font-bold text-gray-700">{getTemperature('sunday')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="divide-y divide-white/20">
          {TIME_SLOTS.map((slot, index) => (
            <div key={slot.time} className="grid grid-cols-2">
              {/* Saturday Slot */}
              <div className="p-6 border-r border-white/20 min-h-[140px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-gray-800">{slot.time}</div>
                  <div className="text-xs text-gray-500 font-medium">{slot.label}</div>
                </div>
                
                <DroppableSlot day="saturday" timeSlot={slot.time} />
              </div>

              {/* Sunday Slot */}
              <div className="p-6 min-h-[140px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-gray-800">{slot.time}</div>
                  <div className="text-xs text-gray-500 font-medium">{slot.label}</div>
                </div>
                
                <DroppableSlot day="sunday" timeSlot={slot.time} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
