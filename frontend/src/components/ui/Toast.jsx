import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

/**
 * Custom hook to trigger toast notifications.
 * Must be used within a ToastProvider.
 * 
 * @returns {Object} contextValue
 * @returns {function(string, ('success'|'error'|'info'), number=3000)} contextValue.show - Function to trigger a toast message.
 */
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Toast notifications Context Provider wrapping application elements.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Inside content nodes.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
  }

  const bgColors = {
    success: 'bg-white/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200 shadow-emerald-500/5',
    error: 'bg-white/95 dark:bg-rose-950/90 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 shadow-rose-500/5',
    info: 'bg-white/95 dark:bg-sky-950/90 border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-200 shadow-sky-500/5'
  }

  return (
    <div className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 ${bgColors[toast.type] || bgColors.info}`}>
      <div className="flex items-center gap-3">
        {icons[toast.type] || icons.info}
        <span className="text-sm font-semibold">{toast.message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ml-4 shrink-0 cursor-pointer text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
