import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDrag } from 'react-dnd'
import { Clock, DollarSign, Star, Calendar, Plus, GripVertical, X } from 'lucide-react'
import { Activity } from './DraggableActivityCard'

interface DraggableActivityItemProps {
  activity: Activity
  onQuickAdd: (activity: Activity, day: 'saturday' | 'sunday', timeSlot: string) => void
  scheduledActivities?: any[]
  onRemoveActivity?: (activityId: string) => void
}

interface TimeSlotSelectorProps {
  activity: Activity
  onSelect: (activity: Activity, day: 'saturday' | 'sunday', timeSlot: string) => void
  onClose: () => void
  scheduledActivities?: any[]
  onRemoveActivity?: (activityId: string) => void
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  activity, 
  onSelect, 
  onClose, 
  scheduledActivities = [],
  onRemoveActivity
}) => {
  const [selectedSlot, setSelectedSlot] = useState<{ day: 'saturday' | 'sunday', time: string } | null>(null)
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedModalDay, setSelectedModalDay] = useState<'saturday' | 'sunday'>('saturday')

  const timeSlots = [
    { id: '6:00 AM', label: '6:00 AM', period: 'Early Morning' },
    { id: '7:00 AM', label: '7:00 AM', period: 'Morning' },
    { id: '8:00 AM', label: '8:00 AM', period: 'Morning' },
    { id: '9:00 AM', label: '9:00 AM', period: 'Morning' },
    { id: '10:00 AM', label: '10:00 AM', period: 'Late Morning' },
    { id: '11:00 AM', label: '11:00 AM', period: 'Late Morning' },
    { id: '12:00 PM', label: '12:00 PM', period: 'Noon' },
    { id: '1:00 PM', label: '1:00 PM', period: 'Afternoon' },
    { id: '2:00 PM', label: '2:00 PM', period: 'Afternoon' },
    { id: '3:00 PM', label: '3:00 PM', period: 'Afternoon' },
    { id: '4:00 PM', label: '4:00 PM', period: 'Late Afternoon' },
    { id: '5:00 PM', label: '5:00 PM', period: 'Evening' },
    { id: '6:00 PM', label: '6:00 PM', period: 'Evening' },
    { id: '7:00 PM', label: '7:00 PM', period: 'Evening' },
    { id: '8:00 PM', label: '8:00 PM', period: 'Night' },
    { id: '9:00 PM', label: '9:00 PM', period: 'Night' },
    { id: '10:00 PM', label: '10:00 PM', period: 'Late Night' },
    { id: '11:00 PM', label: '11:00 PM', period: 'Late Night' },
  ]

  // Convert time to ID format for checking occupation
  const convertTimeToId = (timeString: string): string => {
    const timeMap: { [key: string]: string } = {
      '6:00 AM': '6am', '7:00 AM': '7am', '8:00 AM': '8am', '9:00 AM': '9am',
      '10:00 AM': '10am', '11:00 AM': '11am', '12:00 PM': '12pm', '1:00 PM': '1pm',
      '2:00 PM': '2pm', '3:00 PM': '3pm', '4:00 PM': '4pm', '5:00 PM': '5pm',
      '6:00 PM': '6pm', '7:00 PM': '7pm', '8:00 PM': '8pm', '9:00 PM': '9pm',
      '10:00 PM': '10pm', '11:00 PM': '11pm'
    }
    return timeMap[timeString] || timeString.toLowerCase().replace(/[:\s]/g, '')
  }

  // Check if slot is occupied
  const isSlotOccupied = (timeString: string, day: 'saturday' | 'sunday'): boolean => {
    const timeId = convertTimeToId(timeString)
    return scheduledActivities.some(activity => 
      activity.timeSlot === timeId && activity.day === day
    )
  }

  // Handle time slot selection
  const handleTimeSlotClick = async (slot: any, day: 'saturday' | 'sunday') => {
    if (isSlotOccupied(slot.label, day) || isScheduling) {
      return // Prevent scheduling on occupied slots
    }

    setIsScheduling(true)
    setSelectedSlot({ day, time: slot.label })

    try {
      // Call the parent's onSelect function
      onSelect(activity, day, slot.label)
      
      // Show success feedback briefly before closing
      setTimeout(() => {
        onClose()
      }, 300)
    } catch (error) {
      console.error('Error scheduling activity:', error)
      setIsScheduling(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Schedule Activity</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{activity.title}</p>
                  <p className="text-white/80 text-sm">Choose your perfect time slot</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-6">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setSelectedModalDay('saturday')}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all ${
                selectedModalDay === 'saturday'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectedModalDay === 'saturday' ? 'bg-white' : 'bg-blue-400'}`}></div>
                Saturday
                <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded-full">
                  {scheduledActivities.filter(a => a.day === 'saturday' && !a.isBlocked).length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setSelectedModalDay('sunday')}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all ${
                selectedModalDay === 'sunday'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectedModalDay === 'sunday' ? 'bg-white' : 'bg-purple-400'}`}></div>
                Sunday
                <span className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded-full">
                  {scheduledActivities.filter(a => a.day === 'sunday' && !a.isBlocked).length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {timeSlots.map((slot) => {
              const isOccupied = isSlotOccupied(slot.label, selectedModalDay)
              const isSelected = selectedSlot?.day === selectedModalDay && selectedSlot?.time === slot.label
              const occupiedActivity = scheduledActivities.find(a => 
                a.day === selectedModalDay && convertTimeToId(slot.label) === a.timeSlot
              )
              
              return (
                <motion.div
                  key={`${selectedModalDay}-${slot.id}`}
                  whileHover={{ scale: isOccupied ? 1 : 1.02, y: isOccupied ? 0 : -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-lg
                    ${isOccupied
                      ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50 cursor-not-allowed'
                      : isSelected && isScheduling
                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg scale-105'
                        : selectedModalDay === 'saturday'
                          ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:border-blue-400 hover:shadow-xl hover:scale-102'
                          : 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-400 hover:shadow-xl hover:scale-102'
                    }
                  `}
                  onClick={() => !isOccupied && handleTimeSlotClick(slot, selectedModalDay)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isOccupied
                          ? 'bg-red-100'
                          : isSelected && isScheduling
                            ? 'bg-green-100'
                            : selectedModalDay === 'saturday'
                              ? 'bg-blue-100'
                              : 'bg-purple-100'
                      }`}>
                        <Clock className={`w-5 h-5 ${
                          isOccupied
                            ? 'text-red-500'
                            : isSelected && isScheduling
                              ? 'text-green-500'
                              : selectedModalDay === 'saturday'
                                ? 'text-blue-500'
                                : 'text-purple-500'
                        }`} />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">{slot.label}</div>
                        <div className="text-sm text-gray-500">{slot.period}</div>
                        {occupiedActivity && (
                          <div className="text-xs text-red-600 font-medium mt-1">
                            {occupiedActivity.isBlocked ? 'Continued Activity' : occupiedActivity.title}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        isOccupied
                          ? 'bg-red-100 text-red-700'
                          : isSelected && isScheduling
                            ? 'bg-green-100 text-green-700'
                            : selectedModalDay === 'saturday'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                      }`}>
                        {isOccupied
                          ? 'Occupied'
                          : isSelected && isScheduling
                            ? 'Scheduling...'
                            : 'Available'
                        }
                      </span>
                      
                      {occupiedActivity && !occupiedActivity.isBlocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onRemoveActivity) {
                              onRemoveActivity(occupiedActivity.id)
                            }
                          }}
                          className="p-3 rounded-xl hover:bg-red-100 transition-all text-red-500 hover:text-red-700 hover:scale-110"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Click any available slot to schedule your activity
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const DraggableActivityItem: React.FC<DraggableActivityItemProps> = ({ activity, onQuickAdd, scheduledActivities = [], onRemoveActivity }) => {
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  
  const [{ isDragging }, drag] = useDrag({
    type: 'activity',
    item: activity,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const handleScheduleClick = () => {
    setShowTimeSelector(true)
  }

  return (
    <>
      <motion.div
        ref={drag as any}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group ${
          isDragging ? 'opacity-50 rotate-3 scale-105' : ''
        }`}
      >
        <div className="relative">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Drag Handle */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-gray-600" />
          </div>
          
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            {activity.cost === 0 ? (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Free
              </span>
            ) : (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                ${activity.cost}
              </span>
            )}
          </div>
          
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white/90 px-4 py-2 rounded-lg font-medium text-blue-700">
                Drop on timeline
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {activity.duration}min
            </div>
            {activity.popularity && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                {activity.popularity}%
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleScheduleClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Activity
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onQuickAdd(activity, 'saturday', '2:00 PM')}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
              >
                <Plus className="w-3 h-3 mr-1" />
                Sat 2PM
              </button>
              <button
                onClick={() => onQuickAdd(activity, 'sunday', '7:00 PM')}
                className="bg-purple-50 text-purple-700 text-xs px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center"
              >
                <Plus className="w-3 h-3 mr-1" />
                Sun 7PM
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time Slot Selector Modal */}
      {showTimeSelector && (
        <TimeSlotSelector
          activity={activity}
          onSelect={onQuickAdd}
          onClose={() => setShowTimeSelector(false)}
          scheduledActivities={scheduledActivities}
          onRemoveActivity={onRemoveActivity}
        />
      )}
    </>
  )
}

export default DraggableActivityItem
