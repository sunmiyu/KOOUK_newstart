'use client'

import { useUserUsage } from './useUserUsage'
import { UserUsage } from '@/types/folder'

interface LimitCheckResult {
  canProceed: boolean
  reason?: 'storage_full' | 'folders_full' | 'marketplace_full'
  message?: string
  percentage?: number
}

export function useLimitCheck() {
  const { usage, loading } = useUserUsage()

  const checkStorageLimit = (): LimitCheckResult => {
    if (!usage) return { canProceed: false, reason: 'storage_full', message: '사용량 정보를 불러올 수 없습니다.' }
    
    if (usage.is_storage_full) {
      return {
        canProceed: false,
        reason: 'storage_full',
        message: `저장공간이 가득 찼습니다 (${usage.storage_usage_percent}%)`,
        percentage: usage.storage_usage_percent
      }
    }
    
    return { canProceed: true }
  }

  const checkFoldersLimit = (): LimitCheckResult => {
    if (!usage) return { canProceed: false, reason: 'folders_full', message: '사용량 정보를 불러올 수 없습니다.' }
    
    if (usage.is_folders_full) {
      return {
        canProceed: false,
        reason: 'folders_full',
        message: `폴더 개수 한계에 도달했습니다 (${usage.current_folders}/${usage.limits.max_folders})`,
        percentage: usage.folder_usage_percent
      }
    }
    
    return { canProceed: true }
  }

  const checkMarketplaceLimit = (): LimitCheckResult => {
    if (!usage) return { canProceed: false, reason: 'marketplace_full', message: '사용량 정보를 불러올 수 없습니다.' }
    
    if (usage.marketplace_usage_percent >= 100) {
      return {
        canProceed: false,
        reason: 'marketplace_full',
        message: `마켓플레이스 공유 한계에 도달했습니다 (${usage.current_marketplace_folders}/${usage.limits.max_marketplace_folders})`,
        percentage: usage.marketplace_usage_percent
      }
    }
    
    return { canProceed: true }
  }

  const checkPaidSellingLimit = (): LimitCheckResult => {
    if (!usage) return { canProceed: false, message: '사용량 정보를 불러올 수 없습니다.' }
    
    if (!usage.limits.can_sell_paid_folders) {
      return {
        canProceed: false,
        message: '유료 판매는 Pro 플랜에서만 가능합니다.'
      }
    }
    
    return { canProceed: true }
  }

  const checkAdvancedAnalytics = (): LimitCheckResult => {
    if (!usage) return { canProceed: false, message: '사용량 정보를 불러올 수 없습니다.' }
    
    if (!usage.limits.advanced_analytics) {
      return {
        canProceed: false,
        message: '고급 분석은 Pro 플랜에서만 가능합니다.'
      }
    }
    
    return { canProceed: true }
  }

  // 여러 제한 동시 체크
  const checkMultipleConditions = (conditions: ('storage' | 'folders' | 'marketplace' | 'paid_selling' | 'analytics')[]): LimitCheckResult => {
    for (const condition of conditions) {
      let result: LimitCheckResult
      
      switch (condition) {
        case 'storage':
          result = checkStorageLimit()
          break
        case 'folders':
          result = checkFoldersLimit()
          break
        case 'marketplace':
          result = checkMarketplaceLimit()
          break
        case 'paid_selling':
          result = checkPaidSellingLimit()
          break
        case 'analytics':
          result = checkAdvancedAnalytics()
          break
        default:
          continue
      }
      
      if (!result.canProceed) {
        return result
      }
    }
    
    return { canProceed: true }
  }

  return {
    usage,
    loading,
    checkStorageLimit,
    checkFoldersLimit,
    checkMarketplaceLimit,
    checkPaidSellingLimit,
    checkAdvancedAnalytics,
    checkMultipleConditions
  }
}