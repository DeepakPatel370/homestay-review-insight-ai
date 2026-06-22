import React from 'react'

/**
 * Reusable Button component with multiple variants, sizes, and support for disabled/loading states.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render inside the button.
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - The visual style variant of the button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size variant of the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {function} [props.onClick] - Click event handler.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The HTML button type attribute.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all active:scale-[0.98] select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-brand text-white shadow-md shadow-indigo-500/10 hover:shadow-sky-500/20 hover:opacity-95',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-300/20 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-white/5',
    outline: 'bg-transparent border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 dark:border-white/20 dark:hover:border-white/40 dark:text-gray-200 dark:hover:text-white'
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
