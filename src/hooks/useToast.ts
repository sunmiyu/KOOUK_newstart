'use client'

import { useState, useCallback } from 'react'
import { ToastProps } from '@/components/ui/Toast'

interface ToastWithId extends ToastProps {
  id: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastWithId[]>([])

  const addToast = useCallback((toast: Omit<ToastWithId, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: ToastWithId = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])
    
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // 편의 메서드들
  const showSuccess = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'success', message, ...options })
  }, [addToast])

  const showError = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'error', message, ...options })
  }, [addToast])

  const showWarning = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'warning', message, ...options })
  }, [addToast])

  const showInfo = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ type: 'info', message, ...options })
  }, [addToast])

  // 제한 관련 특수 토스트들
  const showStorageWarning = useCallback((percentage: number, onUpgrade?: () => void) => {
    return addToast({
      type: 'warning',
      title: '저장공간 부족',
      message: `저장공간 ${percentage}% 사용 중입니다. 곧 한계에 도달할 예정입니다.`,
      action: onUpgrade ? {
        label: 'Pro 업그레이드',
        onClick: onUpgrade
      } : undefined,
      duration: 8000
    })
  }, [addToast])

  const showStorageError = useCallback((percentage: number, onUpgrade?: () => void) => {
    return addToast({
      type: 'error',
      title: '저장공간 가득참',
      message: `저장공간이 가득 찼습니다 (${percentage}%). 새로운 콘텐츠를 추가할 수 없습니다.`,
      action: onUpgrade ? {
        label: 'Pro 업그레이드',
        onClick: onUpgrade
      } : undefined,
      duration: 0 // 수동으로 닫아야 함
    })
  }, [addToast])

  const showFolderLimitError = useCallback((current: number, max: number, onUpgrade?: () => void) => {
    return addToast({
      type: 'error',
      title: '폴더 개수 한계',
      message: `폴더 개수 한계에 도달했습니다 (${current}/${max}). 새로운 폴더를 만들 수 없습니다.`,
      action: onUpgrade ? {
        label: 'Pro 업그레이드',
        onClick: onUpgrade
      } : undefined,
      duration: 0
    })
  }, [addToast])

  const showMarketplaceLimitError = useCallback((current: number, max: number, onUpgrade?: () => void) => {
    return addToast({
      type: 'error',
      title: '마켓플레이스 공유 한계',
      message: `마켓플레이스 공유 한계에 도달했습니다 (${current}/${max}). 더 이상 폴더를 공유할 수 없습니다.`,
      action: onUpgrade ? {
        label: 'Pro 업그레이드',
        onClick: onUpgrade
      } : undefined,
      duration: 0
    })
  }, [addToast])

  const showProFeatureError = useCallback((featureName: string, onUpgrade?: () => void) => {
    return addToast({
      type: 'warning',
      title: 'Pro 전용 기능',
      message: `${featureName}은(는) Pro 플랜에서만 사용할 수 있습니다.`,
      action: onUpgrade ? {
        label: 'Pro 업그레이드',
        onClick: onUpgrade
      } : undefined,
      duration: 6000
    })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showStorageWarning,
    showStorageError,
    showFolderLimitError,
    showMarketplaceLimitError,
    showProFeatureError
  }
}