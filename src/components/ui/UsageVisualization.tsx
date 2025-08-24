'use client'

import { UserUsage } from '@/types/folder'

interface UsageVisualizationProps {
  usage: UserUsage
  className?: string
  showUpgradeButton?: boolean
  onUpgradeClick?: () => void
}

export default function UsageVisualization({ 
  usage, 
  className = '', 
  showUpgradeButton = false,
  onUpgradeClick 
}: UsageVisualizationProps) {
  const formatStorage = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`
    }
    return `${Math.round(mb)} MB`
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-500'
    if (percent >= 90) return 'bg-orange-500'
    if (percent >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getProgressBgColor = (percent: number) => {
    if (percent >= 100) return 'bg-red-50'
    if (percent >= 90) return 'bg-orange-50'
    if (percent >= 70) return 'bg-yellow-50'
    return 'bg-green-50'
  }

  const getTextColor = (percent: number) => {
    if (percent >= 100) return 'text-red-700'
    if (percent >= 90) return 'text-orange-700'
    if (percent >= 70) return 'text-yellow-700'
    return 'text-green-700'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">사용량 현황</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              usage.plan === 'pro' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {usage.plan === 'pro' ? '🌟 Pro Plan' : '🆓 Free Plan'}
            </span>
            {(usage.is_storage_warning || usage.is_folders_full) && (
              <span className="text-xs text-orange-600 font-medium">
                ⚠️ 한계 근접
              </span>
            )}
          </div>
        </div>
        
        {showUpgradeButton && usage.plan === 'free' && (
          <button 
            onClick={onUpgradeClick}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            🚀 Pro 업그레이드
          </button>
        )}
      </div>

      {/* Usage Bars */}
      <div className="space-y-6">
        {/* Storage Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">💾 저장공간</span>
            <span className={`text-sm font-medium ${getTextColor(usage.storage_usage_percent)}`}>
              {formatStorage(usage.current_storage_mb)} / {usage.limits.storage_limit_gb}GB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usage.storage_usage_percent)}`}
              style={{ width: `${Math.min(usage.storage_usage_percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className={getTextColor(usage.storage_usage_percent)}>
              {usage.storage_usage_percent}%
            </span>
          </div>
        </div>

        {/* Folders Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">📁 폴더</span>
            <span className={`text-sm font-medium ${getTextColor(usage.folder_usage_percent)}`}>
              {usage.current_folders} / {usage.limits.max_folders}개
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usage.folder_usage_percent)}`}
              style={{ width: `${Math.min(usage.folder_usage_percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className={getTextColor(usage.folder_usage_percent)}>
              {usage.folder_usage_percent}%
            </span>
          </div>
        </div>

        {/* Marketplace Folders Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">🛍️ 마켓플레이스 공유</span>
            <span className={`text-sm font-medium ${getTextColor(usage.marketplace_usage_percent)}`}>
              {usage.current_marketplace_folders} / {usage.limits.max_marketplace_folders}개
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(usage.marketplace_usage_percent)}`}
              style={{ width: `${Math.min(usage.marketplace_usage_percent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span className={getTextColor(usage.marketplace_usage_percent)}>
              {usage.marketplace_usage_percent}%
            </span>
          </div>
        </div>
      </div>

      {/* Pro Features Preview (Free 사용자만) */}
      {usage.plan === 'free' && showUpgradeButton && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-medium text-purple-900 mb-2">🌟 Pro로 업그레이드하면</h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>💾 저장공간 10GB (현재 {usage.limits.storage_limit_gb}GB)</li>
            <li>📁 폴더 {PLAN_LIMITS.pro.max_folders}개 (현재 {usage.limits.max_folders}개)</li>
            <li>💰 유료 마켓플레이스 판매 가능</li>
            <li>📊 고급 분석 & 수익 통계</li>
          </ul>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          마지막 업데이트: {new Date(usage.last_calculated_at).toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  )
}

// PLAN_LIMITS를 임포트하기 위해 추가
import { PLAN_LIMITS } from '@/types/folder'