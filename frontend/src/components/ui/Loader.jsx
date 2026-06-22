import React from 'react'

/**
 * Reusable Loader component supporting both spinners and skeleton loading placeholders.
 * 
 * @param {Object} props - The component props.
 * @param {'spinner' | 'skeleton'} [props.type='spinner'] - The layout type of loader to display.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner (ignored for skeleton type).
 * @param {string} [props.className=''] - Additional styling classes.
 * @param {number} [props.rows=3] - Number of skeleton rows to render (ignored for spinner type).
 */
export function Loader({
  type = 'spinner', // 'spinner' | 'skeleton'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  rows = 3
}) {
  if (type === 'skeleton') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg" 
            style={{ width: i === rows - 1 ? '70%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-transparent border-sky-500 ${sizes[size]}`}></div>
    </div>
  )
}
