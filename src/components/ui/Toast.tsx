'use client'

import { useState, useEffect } from 'react'

export interface ToastProps {
  id?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
  onClose?: () => void
}

export default function Toast({ 
  type = 'info', 
  title, 
  message, 
  action, 
  duration = 5000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: '✅',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900',
          messageColor: 'text-green-700',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        }
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: '❌',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700'
        }
      case 'warning':
        return {
          container: 'bg-orange-50 border-orange-200',
          icon: '⚠️',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          titleColor: 'text-orange-900',
          messageColor: 'text-orange-700',
          buttonColor: 'bg-orange-600 hover:bg-orange-700'
        }
      default:
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
    }
  }

  if (!isVisible) return null

  const style = getToastStyle()

  return (
    <div className={`
      transform transition-all duration-300 ease-out
      ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      max-w-md w-full
    `}>
      <div className={`
        relative p-4 border rounded-lg shadow-lg backdrop-blur-sm
        ${style.container}
      `}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${style.iconBg}
          `}>
            <span>{style.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`font-medium text-sm mb-1 ${style.titleColor}`}>
                {title}
              </h4>
            )}
            <p className={`text-sm ${style.messageColor}`}>
              {message}
            </p>
            
            {action && (
              <button
                onClick={action.onClick}
                className={`
                  mt-3 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-colors
                  ${style.buttonColor}
                `}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-full hover:bg-current hover:bg-opacity-10 transition-colors
              ${style.iconColor}
            `}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[]
  onRemoveToast: (id: string) => void
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  )
}