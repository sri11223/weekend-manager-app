import React from 'react'
import { useDrop } from 'react-dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { ItemTypes } from './DraggableActivityCard'
import { useScheduleStore } from '../../store/scheduleStore'
import { Clock, X, Sunrise, Sun, Sunset, Moon, Star, Calendar, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const timeSlots = [
  { time: '8:00 AM', period: 'morning', icon: Sunrise, gradient: 'from-amber-200 to-orange-300', bg: 'bg-gradient-to-br from-amber-50 to-orange-100' },
  { time: '10:00 AM', period: 'morning', icon: Sun, gradient: 'from-yellow-200 to-amber-300', bg: 'bg-gradient-to-br from-yellow-50 to-amber-100' },
  { time: '12:00 PM', period: 'afternoon', icon: Sun, gradient: 'from-blue-200 to-cyan-300', bg: 'bg-gradient-to-br from-blue-50 to-cyan-100' },
  { time: '2:00 PM', period: 'afternoon', icon: Sun, gradient: 'from-emerald-200 to-teal-300', bg: 'bg-gradient-to-br from-emerald-50 to-teal-100' },
  { time: '4:00 PM', period: 'afternoon', icon: Sunset, gradient: 'from-orange-200 to-pink-300', bg: 'bg-gradient-to-br from-orange-50 to-pink-100' },
  { time: '6:00 PM', period: 'evening', icon: Moon, gradient: 'from-purple-200 to-indigo-300', bg: 'bg-gradient-to-br from-purple-50 to-indigo-100' },
  { time: '8:00 PM', period: 'evening', icon: Star, gradient: 'from-indigo-200 to-purple-300', bg: 'bg-gradient-to-br from-indigo-50 to-purple-100' },
]

const WeekendTimeline: React.FC = () => {
  const { removeActivity, getActivitiesForSlot, isSlotOccupied, addActivity } = useScheduleStore()

  const DroppableSlot: React.FC<{ day: 'saturday' | 'sunday'; timeSlot: string; slotData: any }> = ({ day, timeSlot, slotData }) => {
    // Convert timeSlot format from "8:00 AM" to "8am" to match scheduleStore format
    const convertTimeSlot = (time: string) => {
      return time.toLowerCase().replace(/:/g, '').replace(' ', '')
    }
    
    const convertedTimeSlot = convertTimeSlot(timeSlot)
    const scheduledActivities = getActivitiesForSlot(day, convertedTimeSlot)
    const scheduledActivity = scheduledActivities.length > 0 ? scheduledActivities[0] : null
    
    const [{ isOver, canDrop }, drop] = useDrop({
      accept: ItemTypes.ACTIVITY,
      drop: (item: { activity: any }) => {
        if (isSlotOccupied(day, convertedTimeSlot)) {
          toast.error('⚠️ Time conflict! This slot is already occupied.')
          return
        }
        
        addActivity(item.activity, convertedTimeSlot, day)
        toast.success(`✨ Added ${item.activity.name || item.activity.title} to ${day} ${timeSlot}`)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    })

    const IconComponent = slotData.icon

    return (
      <motion.div
        ref={drop as any}
        className={`
          relative group rounded-2xl border-2 transition-all duration-300 overflow-hidden
          ${isOver && canDrop 
            ? 'border-violet-400 shadow-lg shadow-violet-200 scale-105 bg-violet-50' 
            : scheduledActivity 
              ? 'border-emerald-300 shadow-md bg-white' 
              : 'border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
          ${!scheduledActivity && !isOver ? slotData.bg : ''}
        `}
        whileHover={{ scale: scheduledActivity ? 1.02 : 1.01 }}
        layout
        style={{ minHeight: '120px' }}
      >
        {/* Time Indicator */}
        <div className={`absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${slotData.gradient} shadow-sm z-10`}>
          <IconComponent className="w-4 h-4 text-white" />
          <span className="text-sm font-semibold text-white">{timeSlot}</span>
        </div>

        <AnimatePresence mode="wait">
          {scheduledActivity ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 pt-14 h-full"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 h-full relative group">
                {/* Remove Button - Better positioned */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeActivity(scheduledActivity.id)
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </motion.button>

                <div className="mb-3">
                  <h4 className="font-bold text-gray-900 text-base leading-tight mb-2 pr-4">
                    {scheduledActivity.name || scheduledActivity.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {scheduledActivity.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {Math.floor(scheduledActivity.duration / 60)}h {scheduledActivity.duration % 60}m
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <span className="font-medium">
                      Free
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full pt-14 pb-4 px-4"
            >
              <motion.div
                animate={isOver && canDrop ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: isOver && canDrop ? Infinity : 0 }}
                className="text-center"
              >
                {isOver && canDrop ? (
                  <>
                    <Sparkles className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                    <p className="text-violet-600 font-semibold text-sm">Drop your activity here!</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-gray-200 transition-colors">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Drag an activity here</p>
                    <p className="text-gray-400 text-xs mt-1">Perfect time for {slotData.period} activities</p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-xl p-8 border border-white/50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
          <Calendar className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Weekend Planner</h2>
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-gray-600 text-lg">Create your perfect weekend by dragging activities to time slots</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saturday */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Saturday
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <DroppableSlot day="saturday" timeSlot={slot.time} slotData={slot} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sunday */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"></div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sunday
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
          </div>
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={slot.time}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <DroppableSlot day="sunday" timeSlot={slot.time} slotData={slot} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WeekendTimeline
