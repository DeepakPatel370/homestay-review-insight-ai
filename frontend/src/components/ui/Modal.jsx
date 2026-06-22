import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable modal overlay component featuring focus-trapping and keyboard Escape-key dismissal.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is open and visible.
 * @param {function} props.onClose - Trigger callback when the user closes the modal.
 * @param {string} props.title - Title header text displayed at the top of the modal.
 * @param {React.ReactNode} props.children - Inside content nodes to render.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children
}) {
  const modalRef = useRef(null)

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scrolling
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return
    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    modal.addEventListener('keydown', handleTabKey)
    firstElement.focus()

    return () => {
      modal.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/65 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg glass-panel bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm text-slate-600 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  )
}
