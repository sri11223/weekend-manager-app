import React from 'react'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, ...buttonProps } = props

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      className={cn(
        // Base styles
        'btn',
        'relative inline-flex items-center justify-center gap-2',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'disabled:transform-none',
        
        // Variant styles (using your amazing CSS classes)
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary', 
          'btn-accent': variant === 'accent',
          'btn-ghost': variant === 'ghost',
          'border-2 border-white/20 text-neutral-700 hover:bg-white/30': variant === 'outline'
        },
        
        // Size styles
        {
          'btn-sm': size === 'sm',
          'btn-lg': size === 'lg'
        },
        
        className
      )}
      disabled={isDisabled}
      {...buttonProps}
    >
      {/* Loading spinner */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      
      {/* Left icon */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      
      {/* Button text */}
      <span className={cn(loading && 'opacity-70')}>
        {children}
      </span>
      
      {/* Right icon */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
    </motion.button>
  )
}
