import React from 'react'

/**
 * Reusable text Input component supporting labels, error states, and responsive styling.
 * 
 * @param {Object} props - The component props.
 * @param {string} [props.label] - Optional text label displayed above the input.
 * @param {string} [props.placeholder] - Custom placeholder text.
 * @param {string} [props.type='text'] - HTML input type (e.g. 'text', 'password', 'email').
 * @param {string|number} [props.value] - Binding value of the input component.
 * @param {function} [props.onChange] - Value change callback handler.
 * @param {string} [props.error] - Validation error message to render below the field.
 * @param {string} [props.className=''] - Additional CSS classes for parent container.
 */
export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1.5 text-left w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 transition-colors">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-slate-950/40 border ${
          error 
            ? 'border-rose-500/50 focus:border-rose-500 dark:border-rose-500/50 dark:focus:border-rose-500' 
            : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 focus:border-sky-500/50 dark:focus:border-sky-500/50'
        } rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none transition-all`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 transition-colors">{error}</p>
      )}
    </div>
  )
}
