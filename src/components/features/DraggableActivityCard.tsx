import React from 'react'
import { useDrag } from 'react-dnd'
import { motion } from 'framer-motion'
import { Clock, DollarSign, MapPin, Star, Sparkles, Heart } from 'lucide-react'

export const ItemTypes = {
  ACTIVITY: 'activity',
}

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
  popularity?: number
  isApiGenerated?: boolean
  apiSource?: string
  rating?: number
  location?: string
}

interface DraggableActivityCardProps {
  activity: Activity
  index: number
}

const getCategoryGradient = (category: string) => {
  const gradients = {
    'entertainment': 'from-violet-400 via-purple-500 to-fuchsia-500',
    'outdoor': 'from-emerald-400 via-teal-500 to-cyan-500',
    'food': 'from-amber-400 via-orange-500 to-red-500',
    'culture': 'from-blue-400 via-indigo-500 to-purple-500',
    'social': 'from-pink-400 via-rose-500 to-red-500',
    'wellness': 'from-green-400 via-emerald-500 to-teal-500',
  }
  return gradients[category as keyof typeof gradients] || 'from-slate-400 via-gray-500 to-zinc-500'
}

const getCategoryIcon = (category: string) => {
  const icons = {
    'entertainment': '',
    'outdoor': '',
    'food': '',
    'culture': '',
    'social': '',
    'wellness': '',
  }
  return icons[category as keyof typeof icons] || ''
}

const DraggableActivityCard: React.FC<DraggableActivityCardProps> = ({ activity, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ACTIVITY,
    item: {
      activity,
      index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <motion.div
      ref={drag as any}
      className={`cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
      }`}
      whileHover={{ 
        scale: 1.03, 
        y: -12,
        rotateY: 2,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.95 }}
      drag={!isDragging}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 25 
      }}
    >
      {/* Glassmorphism Card with Gradient Border */}
      <div className="relative group">
        {/* Gradient Border */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${getCategoryGradient(activity.category)} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">

          {/* Header with Category Icon and Rating */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryGradient(activity.category)} flex items-center justify-center text-xl shadow-lg`}>
                {getCategoryIcon(activity.category)}
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryGradient(activity.category)} text-white shadow-sm`}>
                  {activity.category}
                </span>
              </div>
            </div>

            {activity.rating && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-yellow-700">{activity.rating}</span>
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
              {activity.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {activity.description}
            </p>
          </div>

          {/* Activity Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {activity.cost === 0 ? 'Free' : `$${activity.cost}`}
              </span>
            </div>
          </div>

          {/* Location */}
          {activity.location && (
            <div className="flex items-center gap-2 mb-4 bg-blue-50 rounded-lg p-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700 font-medium truncate">{activity.location}</span>
            </div>
          )}

          {/* Mood Tags */}
          {activity.moodTags && activity.moodTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activity.moodTags.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-xs font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  {tag}
                </motion.span>
              ))}
              {activity.moodTags.length > 3 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  <Heart className="w-3 h-3" />
                  +{activity.moodTags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Popularity Indicator */}
          {activity.popularity && activity.popularity > 8 && (
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                Popular
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default DraggableActivityCard
