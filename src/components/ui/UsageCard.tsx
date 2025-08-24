'use client'

import { useUserUsage } from '@/hooks/useUserUsage'
import UsageVisualization from './UsageVisualization'

interface UsageCardProps {
  className?: string
  showUpgradeButton?: boolean
  onUpgradeClick?: () => void
}

export default function UsageCard({ 
  className = '', 
  showUpgradeButton = true,
  onUpgradeClick 
}: UsageCardProps) {
  const { usage, loading, error, refreshUsage } = useUserUsage()

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <h3 className="text-sm font-medium text-red-900 mb-1">사용량 로드 실패</h3>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshUsage}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (!usage) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm">사용량 정보가 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <UsageVisualization 
      usage={usage}
      className={className}
      showUpgradeButton={showUpgradeButton}
      onUpgradeClick={onUpgradeClick}
    />
  )
}