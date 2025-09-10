import React from 'react'
import { useDrag } from 'react-dnd'
import { motion } from 'framer-motion'
import { Clock, DollarSign, Sun, Cloud, CloudRain } from 'lucide-react'

export interface Activity {
  id: string
  title: string
  category: string
  duration: number
  cost: number
  weatherPreference: string
  moodTags: string[]
  description: string
  image: string
  rating?: number
  [key: string]: any
}

interface DraggableActivityCardProps {
  activity: Activity
  index: number
}

const ItemTypes = {
  ACTIVITY: 'activity'
}

const WeatherIcon: React.FC<{ weather: string }> = ({ weather }) => {
  switch (weather.toLowerCase()) {
    case 'sunny':
    case 'outdoor':
      return <Sun className="w-4 h-4 text-yellow-500" />
    case 'rainy':
    case 'indoor':
      return <CloudRain className="w-4 h-4 text-blue-500" />
    default:
      return <Cloud className="w-4 h-4 text-gray-500" />
  }
}

export const DraggableActivityCard: React.FC<DraggableActivityCardProps> = ({ activity, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: { 
      id: activity.id, 
      activity,
      index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <motion.div
      ref={drag}
      className={`activity-card cursor-grab active:cursor-grabbing transform transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
      whileHover={{ scale: 1.05, y: -4, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <div className="bg-white/40 backdrop-blur-xl rounded-xl p-3 border border-white/40 shadow-md hover:shadow-lg hover:bg-white/50 transition-all group">
        <div className="flex gap-3">
          {/* Compact Image */}
          <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={activity.image.startsWith('https://') ? activity.image : `https://${activity.image}`}
              alt={activity.title}
              className="w-16 h-16 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/64x64/6366f1/white?text=${encodeURIComponent(activity.title.slice(0, 2))}`;
              }}
            />
            {activity.rating && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activity.rating}
              </div>
            )}
          </div>

          {/* Activity Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
              {activity.title}
            </h3>
            
            <p className="text-xs text-gray-600 line-clamp-1">
              {activity.description}
            </p>

            {/* Compact Meta Information */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                <span>{Math.round(activity.duration / 60)}h</span>
              </div>

              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <DollarSign className="w-3 h-3" />
                <span>{activity.cost === 0 ? 'Free' : `$${activity.cost}`}</span>
              </div>

              <WeatherIcon weather={activity.weatherPreference} />
            </div>

            {/* Category & Mood Tags */}
            <div className="flex items-center justify-between">
              <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                {activity.category.split(' ')[0]}
              </span>
              
              {activity.moodTags.length > 0 && (
                <div className="flex gap-1">
                  {activity.moodTags.slice(0, 1).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {activity.moodTags.length > 1 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                      +{activity.moodTags.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export { ItemTypes }
