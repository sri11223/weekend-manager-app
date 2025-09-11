import React from 'react'
import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'interactive' | 'primary' | 'secondary' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  loading?: boolean
  as?: 'div' | 'article' | 'section'
  onDrag?: React.DragEventHandler<HTMLDivElement>
  onDragStart?: React.DragEventHandler<HTMLDivElement>
  onDragEnd?: React.DragEventHandler<HTMLDivElement>
  onAnimationStart?: React.AnimationEventHandler<HTMLDivElement>
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  loading = false,
  as: Component = 'div',
  className,
  onClick,
  onDrag,
  onDragStart,
  onDragEnd,
  onAnimationStart,
  onAnimationEnd,
  ...props
}) => {
  const isInteractive = !!onClick || variant === 'interactive'

  const CardComponent = isInteractive ? motion.div : Component

  const motionProps = isInteractive ? {
    whileHover: { scale: 1.01, y: -2 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <CardComponent
      className={cn(
        // Base styles using your CSS classes
        'relative overflow-hidden',
        {
          // Variant styles (using your amazing CSS classes)
          'card': variant === 'default',
          'card-interactive': variant === 'interactive' || isInteractive,
          'card-primary': variant === 'primary',
          'card-secondary': variant === 'secondary',
          'glass rounded-3xl p-6': variant === 'glass',
          
          // Size variations
          'p-3': size === 'sm',
          'p-6': size === 'md',
          'p-8': size === 'lg',
          
          // Interactive states
          'cursor-pointer': isInteractive,
          'ring-2 ring-primary-400 ring-offset-2': selected,
          
          // Loading state
          'pointer-events-none': loading
        },
        className
      )}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick({} as any)
        }
      } : undefined}
      aria-pressed={selected}
      {...(isInteractive ? motionProps : {})}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      )}
      
      {children}
    </CardComponent>
  )
}

// Card subcomponents for better composition
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)}>
    {children}
  </div>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('flex-1', className)}>
    {children}
  </div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn('flex items-center gap-3 pt-4 border-t border-white/10', className)}>
    {children}
  </div>
)

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }> = ({ 
  children, 
  className,
  as: Component = 'h3'
}) => (
  <Component className={cn('font-semibold text-lg text-neutral-900', className)}>
    {children}
  </Component>
)

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={cn('text-sm text-neutral-600', className)}>
    {children}
  </p>
)
