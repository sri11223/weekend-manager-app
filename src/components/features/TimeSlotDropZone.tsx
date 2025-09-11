import React from 'react'
import { motion } from 'framer-motion'
import { useDrop } from 'react-dnd'
import { Clock, X } from 'lucide-react'
import { Activity } from './DraggableActivityCard'

interface TimeSlotDropZoneProps {
  time: string
  day: 'saturday' | 'sunday'
  activity?: any
  onAddActivity: (activity: any, day: 'saturday' | 'sunday', timeSlot: string) => void
  onRemoveActivity?: (activityId: string) => void
}

const TimeSlotDropZone: React.FC<TimeSlotDropZoneProps> = ({
  time,
  day,
  activity,
  onAddActivity,
  onRemoveActivity
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'activity',
    drop: (item: Activity) => {
      onAddActivity(item, day, time)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  return (
    <motion.div
      ref={drop as any}
      whileHover={{ scale: 1.02 }}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 min-h-[60px]
        ${isOver 
          ? 'border-blue-400 bg-blue-50 scale-105' 
          : activity 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{time}</span>
        </div>
        {activity && (
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {activity ? (
        <div>
          <h4 className="font-medium text-gray-900 truncate">{activity.name || activity.title}</h4>
          <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{activity.duration} min</span>
            </div>
            {onRemoveActivity && (
              <button
                onClick={() => onRemoveActivity(activity.id)}
                className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
              >
                <X className="w-3 h-3 text-red-600" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 text-center py-2">
          {isOver ? 'Drop here!' : 'Drop activity'}
        </div>
      )}

      {isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-400/20 rounded-lg flex items-center justify-center"
        >
          <span className="text-blue-700 font-medium text-sm">Drop Here!</span>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TimeSlotDropZone
