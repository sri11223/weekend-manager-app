import React from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleDelay: number
}

interface StarryNightBackgroundProps {
  isNight: boolean
  className?: string
}

const generateStars = (count: number = 15): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.7 + 0.3,
    twinkleDelay: Math.random() * 3
  }))
}

const StarryNightBackground: React.FC<StarryNightBackgroundProps> = ({
  isNight,
  className = ''
}) => {
  const stars = React.useMemo(() => generateStars(12), [])

  if (!isNight) return null

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'radial-gradient(circle, #ffffff 0%, #a78bfa 50%, transparent 70%)',
            boxShadow: `0 0 ${star.size * 2}px #a78bfa40, 0 0 ${star.size * 4}px #ffffff20`
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.4, star.opacity],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: star.twinkleDelay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Subtle moon glow effect */}
      <motion.div
        className="absolute top-4 right-4 w-8 h-8 rounded-full"
        style={{
          background: 'radial-gradient(circle, #f1f5f9 0%, #e2e8f0 30%, transparent 70%)',
          boxShadow: '0 0 20px #f1f5f950, 0 0 40px #e2e8f030'
        }}
        animate={{
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="w-full h-full rounded-full flex items-center justify-center text-white text-lg"
          style={{ textShadow: '0 0 10px #ffffff80' }}
        >
          🌙
        </div>
      </motion.div>
    </div>
  )
}

export default StarryNightBackground